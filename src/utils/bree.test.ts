import { breeHelper, gracefulHelper } from '@utilHelpers';
import { bree, config, logger } from '@utils';
import type Bree from 'bree';
import type { BreeOptions } from 'bree';
import type Graceful from '@ladjs/graceful';
import type { GracefulOptions } from '@ladjs/graceful';

jest.mock('bree');
jest.mock('@ladjs/graceful');
jest.mock('@utilHelpers/breeHelper');
jest.mock('@utilHelpers/gracefulHelper');
jest.mock('@utils/config');
jest.mock('@utils/logger');

describe('utils bree', () => {
  const configBreeDefault = { jobs: { updateChannelsCron: '' }, isDisabled: false };
  const options = { foo: 'bar' };

  describe('calling function start', () => {
    describe('successfully', () => {
      const on = (_: string, callback: (_name: string) => void) => {
        callback('name');
      };
      const breeMock = { on, start: jest.fn() };
      const gracefulMock = { listen: jest.fn() };

      beforeEach(async () => {
        config.bree = configBreeDefault;
        jest.spyOn(breeHelper, 'getBreeOptions').mockReturnValueOnce(options as unknown as BreeOptions);
        jest.spyOn(breeHelper, 'getBree').mockReturnValueOnce(breeMock as unknown as Bree);
        jest.spyOn(gracefulHelper, 'getGracefulOptions').mockReturnValueOnce(options as unknown as GracefulOptions);
        jest.spyOn(gracefulHelper, 'getGraceful').mockReturnValueOnce(gracefulMock as unknown as Graceful);
        jest.spyOn(logger, 'info').mockImplementationOnce(() => {
          // Do nothing.
        });
        jest.spyOn(logger, 'debug').mockImplementation(() => {
          // Do nothing.
        });

        await bree.start();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls breeHelper.getBreeOptions', () => {
        expect(breeHelper.getBreeOptions).toHaveBeenCalled();
      });

      it('calls breeHelper.getBree', () => {
        expect(breeHelper.getBree).toHaveBeenCalledWith(options);
      });

      it('calls logger.debug with worker created event', () => {
        expect(logger.debug).toHaveBeenNthCalledWith(1, 'bree: worker created', { data: { name: 'name' } });
      });

      it('calls logger.debug with worker deleted event', () => {
        expect(logger.debug).toHaveBeenNthCalledWith(2, 'bree: worker deleted', { data: { name: 'name' } });
      });

      it('calls gracefulHelper.getGracefulOptions', () => {
        expect(gracefulHelper.getGracefulOptions).toHaveBeenCalledWith(breeMock);
      });

      it('calls gracefulHelper.getGraceful', () => {
        expect(gracefulHelper.getGraceful).toHaveBeenCalledWith(options);
      });

      it('calls graceful.listen', () => {
        expect(gracefulMock.listen).toHaveBeenCalled();
      });

      it('calls bree.start', () => {
        expect(breeMock.start).toHaveBeenCalled();
      });

      it('calls logger.info', () => {
        expect(logger.info).toHaveBeenCalledWith('bree: start success');
      });
    });

    describe('with config.bree.isDisabled=true', () => {
      const breeMock = { start: jest.fn() };

      beforeEach(async () => {
        config.bree = { ...configBreeDefault, isDisabled: true };
        jest.spyOn(breeHelper, 'getBree').mockReturnValueOnce(breeMock as unknown as Bree);

        await bree.start();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('does not call bree.start', () => {
        expect(breeMock.start).not.toHaveBeenCalled();
      });
    });
  });
});