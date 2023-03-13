import * as process from 'node:process';
import { parentPort } from 'node:worker_threads';
import { jobService } from '../services';
import db from '../utils/db';
import logger from '../utils/logger';

/**
 * This job is to get all the channels from slack api
 * and update each channel's fields in the db:
 *  isMember   - true/false if app bot is a member of the channel
 *  isPrivate  - true/false if channel is private
 *  numMembers - number of members in channel
 *  members    - array list of userIds who are members of the channel
 */
(async () => {
  logger.info('jobs: updateChannels started');

  const { isConnected: isDbConnected } = await db.connect();
  if (!isDbConnected) {
    logger.info('jobs: updateChannels exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  const { results } = await jobService.updateChannels();
  logger.info('jobs: updateChannels completed', { results });

  await db.disconnect();

  if (parentPort) {
    parentPort.postMessage('done');
  } else {
    process.exit(0);
  }
})();
