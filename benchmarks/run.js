'use strict'

const { writeFileSync } = require('fs')
const { spawn } = require('child_process')
const { resolve, join } = require('path')
const autocannon = require('autocannon')
const testCases = require('./testCases')
const printReport = require('./printReport')

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
      stdio: [ 'ignore', 'ignore', 'ignore' ]
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
    duration: 30
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

  // save and display results
  writeFileSync('benchResults.json', JSON.stringify(results, null, 2))
  printReport(results)
}

process.once('SIGINT', () => {
  console.log('\n\n🛑 Benchmark stopped!')

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
