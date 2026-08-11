const { exec } = require('node:child_process');
const db = require('../data/db.js');

let schedulerInterval = null;

function runTask(taskId) {
  return new Promise((resolve) => {
    const task = db.getTaskById(taskId);
    if (!task) {
      return resolve({ success: false, error: `Task ${taskId} not found.` });
    }

    const nowIso = new Date().toISOString();
    db.updateTask(taskId, { status: 'running', last_run_at: nowIso });

    const startTime = Date.now();
    // Run the task's real command_or_prompt as-is. No hardcoded substitutions.
    const commandToExec = task.command_or_prompt;

    exec(commandToExec, { timeout: 30000 }, (error, stdout, stderr) => {
      const durationMs = Date.now() - startTime;
      const rawOutput = (stdout + '\n' + stderr).trim() || (error ? error.message : 'Execution completed with no output.');
      const finalStatus = error ? 'error' : 'active';
      const formattedOutput = `[${finalStatus.toUpperCase()}] (${durationMs}ms) ${rawOutput}`;

      db.updateTask(taskId, {
        status: finalStatus,
        last_run_at: new Date().toISOString(),
        last_output: formattedOutput
      });

      db.logTaskExecution(taskId, finalStatus === 'active' ? 'success' : 'failed', formattedOutput);

      resolve({
        success: !error,
        taskId,
        output: formattedOutput,
        durationMs
      });
    });
  });
}

function startScheduler(intervalMs = 60000) {
  if (schedulerInterval) return;
  
  // Run an immediate check on active tasks
  checkScheduledTasks();

  schedulerInterval = setInterval(() => {
    checkScheduledTasks();
  }, intervalMs);
}

function stopScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
  }
}

function checkScheduledTasks() {
  try {
    const activeTasks = db.getTasks({ status: 'active' });
    const now = new Date();

    for (const task of activeTasks) {
      if (!task.last_run_at) continue;

      // Basic interval calculation
      const lastRun = new Date(task.last_run_at);
      const elapsedMinutes = (now.getTime() - lastRun.getTime()) / (1000 * 60);

      let shouldRun = false;
      if (task.schedule.includes('every 30m') && elapsedMinutes >= 30) {
        shouldRun = true;
      } else if (task.schedule.includes('every 6h') && elapsedMinutes >= 360) {
        shouldRun = true;
      } else if (task.schedule.includes('daily') && elapsedMinutes >= 1440) {
        shouldRun = true;
      }

      if (shouldRun) {
        console.log(`[SCHEDULER] Auto-triggering task: ${task.id} (${task.name})`);
        runTask(task.id);
      }
    }
  } catch (err) {
    console.error('[SCHEDULER ERROR]', err);
  }
}

module.exports = {
  runTask,
  startScheduler,
  stopScheduler
};
