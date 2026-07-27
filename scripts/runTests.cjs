/**
 * Reusable Test Suite Runner
 *
 * Registers and runs all test scripts in the scripts/ directory.
 * To add a new test, create a script that exports a function
 * `runTest(base44, options)` and register it below.
 *
 * Run all tests via exec_tool:
 *   const runAll = require('./scripts/runTests.cjs');
 *   return await runAll(base44);
 *
 * Run a single test by name:
 *   const runAll = require('./scripts/runTests.cjs');
 *   return await runAll(base44, { only: 'Eagles Nest' });
 */

const testEaglesNest = require('./testEaglesNest.cjs');

const TESTS = [
  { name: 'Eagles Nest', run: testEaglesNest },
];

module.exports = async function runAll(base44, options = {}) {
  const suites = [];
  let totalPassed = 0;
  let totalFailed = 0;

  for (const test of TESTS) {
    if (options.only && test.name !== options.only) continue;
    try {
      const result = await test.run(base44, options);
      suites.push({ name: test.name, ...result });
      totalPassed += result.passed || 0;
      totalFailed += result.failed || 0;
    } catch (e) {
      suites.push({ name: test.name, steps: [], passed: 0, failed: 1, summary: `Suite crashed: ${e.message}` });
      totalFailed++;
    }
  }

  return {
    suites,
    totalPassed,
    totalFailed,
    summary: totalFailed === 0
      ? `All ${totalPassed} tests passed ✓`
      : `${totalFailed} test(s) failed ✗ across ${suites.length} suite(s)`,
  };
};