import path from 'node:path';
import Bree from 'bree';
import { config, logger } from '@utils';
import type { BreeOptions, Job } from 'bree';

const getBreeOptions = (): BreeOptions => {
  const jobs: Job[] = [];
  if (config.bree.jobs.updateChannelsCron) {
    jobs.push({ name: 'updateChannels', cron: config.bree.jobs.updateChannelsCron } as Job);
  }

  return {
    logger: false,
    defaultExtension: config.app.isTsNode ? 'ts' : 'js',
    root: path.join(__dirname, '../../jobs'),
    jobs,
    errorHandler: (error: Error, workerMetadata: { name: string; err?: Error }) => {
      logger.warn('bree: error has occurred', { data: { error, workerMetadata } });
    },
    workerMessageHandler: (message: { name: string; message: unknown }) => {
      logger.debug('bree: worker completed', { data: { ...message } });
    },
  };
};

const getBree = (options: BreeOptions = getBreeOptions()): Bree => new Bree(options);

export default { getBree, getBreeOptions };
