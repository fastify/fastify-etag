'use strict'

module.exports = function printReport (results) {
  for (let group of Object.keys(results)) {
    console.log(`\n${group}\n${'-'.repeat(group.length)}\n`)
    for (let subgroup of Object.keys(results[group])) {
      console.log(`  ${subgroup}\n  ${'-'.repeat(subgroup.length)}`)

      // sort the results by mean of req/sec
      const sorted = (results[group][subgroup])
        .sort((a, b) => b.results.requests.mean - a.results.requests.mean)

      let i = 0
      for (let b of sorted) {
        console.log(`  ${++i}. ${b.name}\t${b.results.requests.mean} req/sec${b.results.errors ? `(${b.results.errors} errors - ${b.results.timeouts})`}`)
      }
      console.log()
    }
  }
}
