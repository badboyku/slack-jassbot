import Bree from 'bree';
import { breeHelper, config, logger } from '@utils';
import type { BreeOptions } from 'bree';

jest.mock('bree');
jest.mock('@utils/config');
jest.mock('@utils/logger/logger');

describe('utils breeHelper', () => {
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
    const configBreeDefault = { jobs: { updateChannelsCron: '', updateUsersCron: '' }, isDisabled: false };

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

    describe('with jobs', () => {
      const jobs = { updateChannelsCron: 'updateChannelsCron', updateUsersCron: 'updateUsersCron' };
      const expected = [
        { cron: 'updateChannelsCron', name: 'updateChannels' },
        { cron: 'updateUsersCron', name: 'updateUsers' },
      ];
      let options: BreeOptions;

      beforeEach(() => {
        config.bree = { ...configBreeDefault, jobs };

        options = breeHelper.getBreeOptions();
      });

      it('returns options with jobs', () => {
        expect(options.jobs).toEqual(expected);
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
