import * as process from 'node:process';
import { parentPort } from 'node:worker_threads';
import { breeService } from '../services';
import db from '../utils/db';
import logger from '../utils/logger';

/**
 * This job is to find all tomorrow's birthdays.
 */
(async () => {
  logger.info('Starting job: findTomorrowsBirthdays');

  const { isConnected: isDbConnected } = await db.connect();
  if (!isDbConnected) {
    process.exit(1);
  }

  await breeService.findTomorrowsBirthdays();
  logger.info('Finished job: findTomorrowsBirthdays');

  await db.disconnect();

  if (parentPort) {
    parentPort.postMessage('done');
  } else {
    process.exit(0);
  }
})();
