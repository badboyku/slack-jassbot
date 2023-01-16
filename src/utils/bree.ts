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
      logger.error('Bree error', { data: { error, workerMetadata } });
    },
    workerMessageHandler: (message: { name: string; message: unknown }) => {
      logger.debug('Worker completed', { data: { ...message } });
    },
  });

  bree.on('worker created', (name: string) => {
    logger.debug('Worker created', { data: { name } });
  });
  bree.on('worker deleted', (name: string) => {
    logger.debug('Worker deleted', { data: { name } });
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
  logger.info('Bree started');
};

export default { start };
