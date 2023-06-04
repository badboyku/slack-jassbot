import mongoose from 'mongoose';
import { dbJassbot } from '@db/sources';
import { config, logger } from '@utils';
import type { Mongoose } from 'mongoose';
import type { DbConnectResult, DbDisconnectResult } from '@types';

jest.mock('mongoose');
jest.mock('@utils/config');
jest.mock('@utils/logger/logger');

describe('dbJassbot Source', () => {
  describe('calling function connect', () => {
    const uri = 'uri';
    let result: DbConnectResult;

    describe('successfully', () => {
      beforeEach(async () => {
        config.db = { jassbot: { uri } };
        jest.spyOn(mongoose, 'set').mockReturnValueOnce({} as Mongoose);
        jest.spyOn(mongoose, 'connect').mockResolvedValueOnce({ connection: { readyState: 1 } } as Mongoose);

        result = await dbJassbot.connect();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls mongoose.set', () => {
        expect(mongoose.set).toHaveBeenCalledWith('strictQuery', false);
      });

      it('calls mongoose.connect', () => {
        expect(mongoose.connect).toHaveBeenCalledWith(uri, { autoIndex: false });
      });

      it('returns isConnected is true', () => {
        expect(result).toEqual({ isConnected: true });
      });
    });

    describe('with error', () => {
      const error = 'error';

      beforeEach(async () => {
        jest.spyOn(mongoose, 'connect').mockRejectedValueOnce(error);
        jest.spyOn(logger, 'warn').mockImplementationOnce(() => {
          // Do nothing.
        });

        result = await dbJassbot.connect();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('dbJassbot: connect failed', { error });
      });

      it('returns isConnected is false', () => {
        expect(result).toEqual({ isConnected: false });
      });
    });
  });

  describe('calling function disconnect', () => {
    let result: DbDisconnectResult;

    describe('successfully', () => {
      beforeEach(async () => {
        jest.spyOn(mongoose, 'disconnect').mockResolvedValueOnce();

        result = await dbJassbot.disconnect();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls mongoose.disconnect', () => {
        expect(mongoose.disconnect).toHaveBeenCalled();
      });

      it('returns isDisconnected is true', () => {
        expect(result).toEqual({ isDisconnected: true });
      });
    });

    describe('with error', () => {
      const error = 'error';

      beforeEach(async () => {
        jest.spyOn(mongoose, 'disconnect').mockRejectedValueOnce(error);

        result = await dbJassbot.disconnect();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('dbJassbot: disconnect failed', { error });
      });

      it('returns isDisconnected is false', () => {
        expect(result).toEqual({ isDisconnected: false });
      });
    });
  });
});
