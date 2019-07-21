'use strict'

const { writeFileSync, openSync, closeSync } = require('fs')
const { spawn } = require('child_process')
const { resolve, join } = require('path')
const autocannon = require('autocannon')
const testCases = require('./testCases')

const ts = (new Date()).toISOString().replace(/[-:.]/g, '')
const reportFile = `.bench-${ts}-report.json`
const serverLogsFile = `.bench-${ts}-logs.txt`
const serverErrorsFile = `.bench-${ts}-err.txt`
const logs = openSync(serverLogsFile, 'a')
const errors = openSync(serverErrorsFile, 'a')

const serverPath = resolve(join(__dirname, 'server.js'))

const pauseFor = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms)
})

let currentServerInstance = null
const startServerFor = (test, port) => {
  const env = Object.assign({}, test.options, { PORT: port, PATH: process.env.PATH })
  currentServerInstance = spawn(
    serverPath,
    [],
    {
      env,
      stdio: [ 'ignore', logs, errors ],
      shell: true
    }
  )

  return currentServerInstance
}

let currentBenchmark = null
const shoot = (port) => new Promise((resolve) => {
  const opts = {
    url: `http://localhost:${port}/`,
    connections: 100,
    pipelining: 4,
    duration: 40,
    timeout: 40
  }

  currentBenchmark = autocannon(opts)
  currentBenchmark.once('done', resolve)
  autocannon.track(currentBenchmark, { renderResultsTable: false })
})

async function run () {
  const results = {}
  let port = 3000

  for (let test of testCases) {
    port++
    console.log(`🚗 ${test.name} (${test.group}, ${test.subgroup}) 🚗`)

    // run server in the background
    const server = startServerFor(test, port)

    // wait 1 second to make sure the server is listening
    await pauseFor(1000)

    if (server.exitCode !== null) {
      console.error(`Server exited with exit code ${server.exitCode}`)
      continue
    }

    // run autocannon and collect results
    const benchResults = await shoot(port)
    console.log(`> ${benchResults.requests.mean} req/sec - Latency: ${benchResults.latency.mean}ms\n\n`)

    if (typeof results[test.group] === 'undefined') {
      results[test.group] = {}
    }
    if (typeof results[test.group][test.subgroup] === 'undefined') {
      results[test.group][test.subgroup] = []
    }
    results[test.group][test.subgroup].push({ name: test.name, results: benchResults })

    // shutdown the server
    server.kill('SIGINT')

    // wait for the server to be shutdown
    await pauseFor(1000)
  }

  // close logs file handle
  closeSync(logs)
  closeSync(errors)

  // save and display results
  writeFileSync(reportFile, JSON.stringify(results, null, 2))
  printReport(results)
}

function printReport (results) {
  for (let group of Object.keys(results)) {
    console.log(`\n${group}\n${'-'.repeat(group.length)}\n`)
    for (let subgroup of Object.keys(results[group])) {
      console.log(`  ${subgroup}\n  ${'-'.repeat(subgroup.length)}`)

      // sort the results by mean of req/sec
      const sorted = (results[group][subgroup])
        .sort((a, b) => b.results.requests.mean - a.results.requests.mean)

      let i = 0
      let best = 0
      let diff = ''
      let err = ''
      let name = ''
      let pos = ''
      let reqSec = ''

      for (let b of sorted) {
        if (i === 0) {
          best = b.results.requests.mean
          diff = ''
        } else {
          diff = ` ${String(((b.results.requests.mean - best) / best * 100).toFixed(3)).padStart(12)}%`
        }

        if (b.results.errors) {
          err = ` (${b.results.errors} errors - ${b.results.timeouts} timeouts)`
        } else {
          err = ''
        }

        pos = String(++i).padStart(2)
        name = b.name.padEnd(16)
        reqSec = `${b.results.requests.mean.toFixed(2)} req/sec`.padStart(20)

        console.log(`  ${pos}. ${name}${reqSec}${diff}${err}`)
      }
      console.log()
    }
  }
}

process.once('SIGINT', () => {
  console.log('\n\n🛑 Benchmark stopped!')
  // close logs file handle
  closeSync(logs)
  closeSync(errors)

  // make sure current server is killed if the main process exits
  if (currentServerInstance && !currentServerInstance.killed) {
    currentServerInstance.kill('SIGINT')
  }

  if (currentBenchmark) {
    currentBenchmark.stop()
  }

  process.exit(1)
})

run()
