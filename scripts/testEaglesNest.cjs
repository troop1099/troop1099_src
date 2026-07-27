/**
 * Eagles Nest — Reusable Test Script
 *
 * Tests the full Eagle Scout create → read → delete flow through the
 * sheets-proxy backend function (the same path the frontend uses).
 *
 * Run via exec_tool:
 *   const runTest = require('./scripts/testEaglesNest.cjs');
 *   return await runTest(base44);
 *
 * Run just the cleanup (remove leftover test records):
 *   const runTest = require('./scripts/testEaglesNest.cjs');
 *   return await runTest(base44, { cleanupOnly: true });
 */

const TEST_PREFIX = 'AUTOMATED TEST —';
const TEST_NAME = `${TEST_PREFIX} Eagle Scout`;
const TEST_DATE = '2026-07-27';
const TEST_PROJECT = 'Automated test entry — safe to delete';

async function invoke(base44, payload) {
  const res = await base44.asServiceRole.functions.invoke('sheets-proxy', payload);
  return res.data;
}

async function listEagles(base44) {
  return await invoke(base44, { entity: 'Eagle', operation: 'list' });
}

function assert(condition, message) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

async function runTest(base44, options = {}) {
  const results = { steps: [], passed: 0, failed: 0 };

  const step = async (name, fn) => {
    try {
      const detail = await fn();
      results.steps.push({ name, status: 'pass', detail });
      results.passed++;
    } catch (e) {
      results.steps.push({ name, status: 'fail', error: e.message });
      results.failed++;
    }
  };

  // ── Cleanup leftover test records ──────────────────────────────
  await step('Cleanup leftover test records', async () => {
    const eagles = await listEagles(base44);
    const leftovers = eagles.filter(e => e.name?.startsWith(TEST_PREFIX));
    for (const eagle of leftovers) {
      await invoke(base44, { entity: 'Eagle', operation: 'delete', id: eagle.id });
    }
    return `Removed ${leftovers.length} leftover test record(s)`;
  });

  if (options.cleanupOnly) {
    results.summary = results.failed === 0 ? 'Cleanup complete' : 'Cleanup had errors';
    return results;
  }

  let createdId = null;

  // ── Create ─────────────────────────────────────────────────────
  await step('Create Eagle Scout record', async () => {
    const created = await invoke(base44, {
      entity: 'Eagle',
      operation: 'create',
      data: { name: TEST_NAME, date: TEST_DATE, project: TEST_PROJECT },
    });
    assert(created?.id, 'Created record should have an id');
    assert(created?.name === TEST_NAME, 'Name should match');
    assert(created?.date === TEST_DATE, 'Date should match');
    createdId = created.id;
    return `Created record ${createdId}`;
  });

  // ── Update (uses authenticated read — verifies fresh data after write) ──
  await step('Update Eagle Scout record', async () => {
    const updated = await invoke(base44, {
      entity: 'Eagle',
      operation: 'update',
      id: createdId,
      data: { project: 'Updated project — automated test' },
    });
    assert(updated?.id === createdId, 'Updated record should return same id');
    assert(updated?.project === 'Updated project — automated test', 'Project should be updated');
    assert(updated?.name === TEST_NAME, 'Name should be preserved after update');
    return `Updated record ${createdId} — project changed to "${updated.project}"`;
  });

  // ── Delete ─────────────────────────────────────────────────────
  await step('Delete Eagle Scout record', async () => {
    const result = await invoke(base44, {
      entity: 'Eagle',
      operation: 'delete',
      id: createdId,
    });
    assert(result?.success, 'Delete should return success: true');

    const eagles = await listEagles(base44);
    const stillThere = eagles.find(e => e.id === createdId);
    assert(!stillThere, 'Deleted record should not appear in list');
    return `Deleted record ${createdId} and confirmed removal`;
  });

  results.summary =
    results.failed === 0
      ? `All ${results.passed} steps passed ✓`
      : `${results.failed} step(s) failed ✗`;
  return results;
}

module.exports = runTest;