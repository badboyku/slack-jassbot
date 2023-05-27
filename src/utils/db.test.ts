import mongoose from 'mongoose';
import { config, db, logger } from '@utils';
import type { Mongoose } from 'mongoose';
import type { DbConnectResult, DbDisconnectResult } from '@types';

jest.mock('mongoose');
jest.mock('@utils/config');
jest.mock('@utils/logger/logger');

describe('utils slackLogger', () => {
  describe('calling function connect', () => {
    const uri = 'uri';
    let result: DbConnectResult;

    describe('successfully', () => {
      beforeEach(async () => {
        config.db = { uri };
        jest.spyOn(mongoose, 'set').mockReturnValueOnce({} as Mongoose);
        jest.spyOn(mongoose, 'connect').mockResolvedValueOnce({} as Mongoose);

        result = await db.connect();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls mongoose.connect', () => {
        expect(mongoose.connect).toHaveBeenCalled();
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

        result = await db.connect();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('db: connect failed', { error });
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

        result = await db.disconnect();
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

        result = await db.disconnect();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('db: disconnect failed', { error });
      });

      it('returns isDisconnected is false', () => {
        expect(result).toEqual({ isDisconnected: false });
      });
    });
  });
});
