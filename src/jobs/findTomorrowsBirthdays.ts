import * as process from 'node:process';
import { parentPort } from 'node:worker_threads';
import { breeService } from '../services';
import db from '../utils/db';
import logger from '../utils/logger';

/**
 * This job is to find all tomorrow's birthdays.
 */
(async () => {
  logger.info('jobs: findTomorrowsBirthdays called');

  const { isConnected: isDbConnected } = await db.connect();
  if (!isDbConnected) {
    logger.info('jobs: findTomorrowsBirthdays exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  await breeService.findTomorrowsBirthdays();
  logger.info('jobs: findTomorrowsBirthdays completed');

  await db.disconnect();

  if (parentPort) {
    parentPort.postMessage('done');
  } else {
    process.exit(0);
  }
})();
