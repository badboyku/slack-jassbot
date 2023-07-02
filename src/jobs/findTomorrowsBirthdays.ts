/* istanbul ignore file */
import process from 'node:process';
import { parentPort } from 'node:worker_threads';
import { dbJassbot } from '@db/sources';
import { jobService } from '@services';
import { logger } from '@utils';

/**
 * This job is to find all tomorrow's birthdays.
 */
(async () => {
  logger.info('jobs: findTomorrowsBirthdays started');

  const { isConnected } = await dbJassbot.connect();
  if (!isConnected) {
    logger.info('jobs: findTomorrowsBirthdays exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  await jobService.findTomorrowsBirthdays();
  logger.info('jobs: findTomorrowsBirthdays completed');

  await dbJassbot.close();

  if (parentPort) {
    parentPort.postMessage('done');
  } else {
    process.exit(0);
  }
})();
