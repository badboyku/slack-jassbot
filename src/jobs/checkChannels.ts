import * as process from 'node:process';
import { parentPort } from 'node:worker_threads';
import { slackService } from '../services';
import logger from '../utils/logger';

(async () => {
  logger.info('Starting checkChannels');

  const results = await slackService.checkChannels();

  if (parentPort) {
    if (results.complete) {
      logger.info('Finished checkChannels', { results });
      parentPort.postMessage('done');
    }
  } else {
    process.exit(0);
  }
})();
