/* istanbul ignore file */
import process from 'node:process';
import { parentPort } from 'node:worker_threads';
import { dbJassbot } from '@db/sources';
import { jobService } from '@services';
import { logger } from '@utils';

/**
 * This job is to get all the channels from slack api
 * and update channel's fields in the db.
 */
(async () => {
  logger.info('jobs: updateChannels started');

  const { isConnected } = await dbJassbot.connect();
  if (!isConnected) {
    logger.info('jobs: updateChannels exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  const { results } = await jobService.updateChannels();
  logger.info('jobs: updateChannels completed', { results });

  await dbJassbot.close();

  if (parentPort) {
    parentPort.postMessage('done');
  } else {
    process.exit(0);
  }
})();
