/* istanbul ignore file */
import process from 'node:process';
import { parentPort } from 'node:worker_threads';
import { dbJassbot } from '@db/sources';
import { jobService } from '@services';
import { logger } from '@utils';

/**
 * This job is to get all the users from slack api
 * and update user's fields in the db.
 */
(async () => {
  logger.info('jobs: updateUsers started');

  const { isConnected: isDbConnected } = await dbJassbot.connect();
  if (!isDbConnected) {
    logger.info('jobs: updateUsers exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  const { results } = await jobService.updateUsers();
  logger.info('jobs: updateUsers completed', { results });

  await dbJassbot.disconnect();

  if (parentPort) {
    parentPort.postMessage('done');
  } else {
    process.exit(0);
  }
})();
