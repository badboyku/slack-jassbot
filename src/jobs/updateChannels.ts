import * as process from 'node:process';
import { parentPort } from 'node:worker_threads';
import { breeService } from '../services';
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
  logger.info('Starting job: updateChannels');

  const { isConnected: isDbConnected } = await db.connect();
  if (!isDbConnected) {
    process.exit(1);
  }

  const { result } = await breeService.updateChannels();
  logger.info('Finished job: updateChannels', { result });

  await db.disconnect();

  if (parentPort) {
    parentPort.postMessage('done');
  } else {
    process.exit(0);
  }
})();
