/* istanbul ignore file */
import process from 'node:process';
import { parentPort } from 'node:worker_threads';
import { dbJassbot } from '@db/sources';
import { jobService } from '@services';
import { logger } from '@utils';

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

  const { isConnected: isDbConnected } = await dbJassbot.connect();
  if (!isDbConnected) {
    logger.info('jobs: updateChannels exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  const { results } = await jobService.updateChannels();
  logger.info('jobs: updateChannels completed', { results });

  await dbJassbot.disconnect();

  if (parentPort) {
    parentPort.postMessage('done');
  } else {
    process.exit(0);
  }
})();
