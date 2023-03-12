import path from 'node:path';
import Bree from 'bree';
import Graceful from '@ladjs/graceful';
import config from './config';
import logger from './logger';

const getBree = () => {
  const {
    app: { isTsNode },
    bree: {
      jobs: { updateChannelsCron },
    },
  } = config;

  const jobs = [];
  if (updateChannelsCron) {
    jobs.push({ name: 'updateChannels', cron: updateChannelsCron });
  }

  const bree = new Bree({
    logger: false,
    defaultExtension: isTsNode ? 'ts' : 'js',
    root: path.join(__dirname, '../jobs'),
    jobs,
    errorHandler: (error: Error, workerMetadata: { name: string; err?: Error }) => {
      logger.warn('bree: error has occurred', { data: { error, workerMetadata } });
    },
    workerMessageHandler: (message: { name: string; message: unknown }) => {
      logger.debug('bree: worker completed', { data: { ...message } });
    },
  });

  bree.on('worker created', (name: string) => {
    logger.debug('bree: worker created', { data: { name } });
  });
  bree.on('worker deleted', (name: string) => {
    logger.debug('bree: worker deleted', { data: { name } });
  });

  return bree;
};

const start = async () => {
  const {
    bree: { isDisabled },
  } = config;

  if (isDisabled) {
    return;
  }

  const bree = getBree();

  const graceful = new Graceful({ brees: [bree] });
  graceful.listen();

  await bree.start();
  logger.info('bree: start success');
};

export default { start };
