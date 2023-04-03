/* istanbul ignore file */
import process from 'node:process';
import { parentPort } from 'node:worker_threads';
import { jobService } from '@services';
import { db, logger } from '@utils';

/**
 * This job is to find all tomorrow's birthdays.
 */
(async () => {
  logger.info('jobs: findTomorrowsBirthdays started');

  const { isConnected: isDbConnected } = await db.connect();
  if (!isDbConnected) {
    logger.info('jobs: findTomorrowsBirthdays exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  await jobService.findTomorrowsBirthdays();
  logger.info('jobs: findTomorrowsBirthdays completed');

  await db.disconnect();

  if (parentPort) {
    parentPort.postMessage('done');
  } else {
    process.exit(0);
  }
})();
