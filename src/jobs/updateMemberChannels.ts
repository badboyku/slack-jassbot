import * as process from 'node:process';
import { parentPort } from 'node:worker_threads';
import { breeService } from '../services';
import db from '../utils/db';
import logger from '../utils/logger';

/**
 * This job is to get all the channels from slack api and update channels isMember field in the db.
 */
(async () => {
  logger.info('Starting job: updateMemberChannels');

  const { isConnected: isDbConnected } = await db.connect();
  if (!isDbConnected) {
    process.exit(1);
  }

  const { result } = await breeService.updateMemberChannels();
  logger.info('Finished job: updateMemberChannels', { result });

  await db.disconnect();

  if (parentPort) {
    parentPort.postMessage('done');
  } else {
    process.exit(0);
  }
})();
