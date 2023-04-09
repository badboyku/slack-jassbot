import Bree from 'bree';
import { config, logger } from '@utils';
import { breeHelper } from '@utils/helpers';
import type { BreeOptions, Job } from 'bree';

jest.mock('bree');
jest.mock('@utils/config');
jest.mock('@utils/logger');

describe('utils/helpers breeHelper', () => {
  describe('calling function getBree', () => {
    describe('successfully', () => {
      let result: Bree;

      beforeEach(() => {
        result = breeHelper.getBree();
      });

      it('returns new Bree object', () => {
        expect(result).toBeTruthy();
      });
    });
  });

  describe('calling function getBreeOptions', () => {
    const configAppDefault = { logLevel: '', logOutputFormat: '', nodeEnv: '', port: 123, isTsNode: false };
    const configBreeDefault = { jobs: { updateChannelsCron: '' }, isDisabled: false };

    beforeEach(() => {
      jest.spyOn(logger, 'warn').mockImplementationOnce(() => {
        // Do nothing.
      });
      jest.spyOn(logger, 'debug').mockImplementationOnce(() => {
        // Do nothing.
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    describe('successfully', () => {
      let options: BreeOptions;

      beforeEach(() => {
        config.bree = configBreeDefault;

        options = breeHelper.getBreeOptions();
      });

      it('returns options with logger false', () => {
        expect(options.logger).toEqual(false);
      });

      it('returns options with defaultExtension js', () => {
        expect(options.defaultExtension).toEqual('js');
      });

      it('returns options with root', () => {
        expect(options.root).toContain('/jobs');
      });

      it('returns options with jobs', () => {
        expect(options.jobs).toEqual([]);
      });

      it('returns options with errorHandler', () => {
        expect(options.errorHandler).toBeTruthy();
      });

      it('returns options with workerMessageHandler', () => {
        expect(options.errorHandler).toBeTruthy();
      });
    });

    describe('when options errorHandler called', () => {
      const error = new Error('some error');
      const workerMetadata = { name: 'name', err: error };

      beforeEach(() => {
        config.bree = configBreeDefault;
        const options = breeHelper.getBreeOptions();

        if (options.errorHandler) {
          options.errorHandler(error, workerMetadata);
        }
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('bree: error has occurred', { data: { error, workerMetadata } });
      });
    });

    describe('when options workerMessageHandler called', () => {
      const message = { name: 'name', message: 'message' };
      const workerMetadata = { name: 'name' };

      beforeEach(() => {
        config.bree = configBreeDefault;
        const options = breeHelper.getBreeOptions();

        if (options.workerMessageHandler) {
          options.workerMessageHandler(message, workerMetadata);
        }
      });

      it('calls logger.debug', () => {
        expect(logger.debug).toHaveBeenCalledWith('bree: worker completed', { data: { ...message } });
      });
    });

    describe('with job updateChannelsCron', () => {
      const jobName = 'updateChannels';
      const jobCron = 'updateChannelsCron';
      let options: BreeOptions;

      beforeEach(() => {
        config.bree = { ...configBreeDefault, jobs: { updateChannelsCron: jobCron } };

        options = breeHelper.getBreeOptions();
      });

      it('returns options with updateChannels job', () => {
        const actualJob = options.jobs?.find((job) => {
          const { name } = job as Job;

          return name === jobName;
        });

        expect(actualJob).toEqual({ name: jobName, cron: jobCron });
      });
    });

    describe('with config app isTsNode', () => {
      let options: BreeOptions;

      beforeEach(() => {
        config.app = { ...configAppDefault, isTsNode: true };

        options = breeHelper.getBreeOptions();
      });

      it('returns options with defaultExtension ts', () => {
        expect(options.defaultExtension).toEqual('ts');
      });
    });
  });
});
