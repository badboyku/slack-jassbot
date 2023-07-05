import { ChannelModel, UserModel } from '@db/models';
import { db as dbJassbot } from '@db/sources/jassbotSource';
import { logger } from '@utils';
import type { Collection } from 'mongodb';
import type { DbCloseResult, DbConnectResult } from '@types';

jest.mock('@db/models/channelModel');
jest.mock('@db/models/userModel');
jest.mock('@utils/config');
jest.mock('@utils/logger/logger');

describe('db source jassbot', () => {
  const client = { close: jest.fn(), connect: jest.fn(), db: jest.fn() };
  const db = { collection: jest.fn(), command: jest.fn() };
  const collection = {};
  const collName = 'collName';
  const error = 'error';
  const validator = {};

  describe('calling function close', () => {
    let result: DbCloseResult;

    describe('successfully', () => {
      beforeEach(async () => {
        client.close.mockResolvedValueOnce({});

        result = await dbJassbot(client as never).close();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls client.close', () => {
        expect(client.close).toHaveBeenCalled();
      });

      it('returns result isClosed=true', () => {
        expect(result).toEqual({ isClosed: true });
      });
    });

    describe('with error', () => {
      beforeEach(async () => {
        client.close.mockRejectedValueOnce(error);
        jest.spyOn(logger, 'warn');

        result = await dbJassbot(client as never).close();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('db: jassbot close failed', { error });
      });

      it('returns result isClosed=false', () => {
        expect(result).toEqual({ isClosed: false });
      });
    });
  });

  describe('calling function connect', () => {
    let result: DbConnectResult;

    describe('successfully', () => {
      beforeEach(async () => {
        client.connect.mockResolvedValueOnce({});

        result = await dbJassbot(client as never).connect();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls client.connect', () => {
        expect(client.connect).toHaveBeenCalled();
      });

      it('returns result isConnected=true', () => {
        expect(result).toEqual({ isConnected: true });
      });
    });

    describe('with error', () => {
      beforeEach(async () => {
        client.connect.mockRejectedValueOnce(error);
        jest.spyOn(logger, 'warn');

        result = await dbJassbot(client as never).connect();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('db: jassbot connect failed', { error });
      });

      it('returns result isConnected=false', () => {
        expect(result).toEqual({ isConnected: false });
      });
    });
  });

  describe('calling function getChannelCollection', () => {
    let result: Collection;

    describe('successfully', () => {
      beforeEach(async () => {
        client.db.mockReturnValueOnce(db);
        jest.spyOn(ChannelModel, 'getCollectionName').mockReturnValueOnce(collName);
        db.collection.mockReturnValueOnce(collection);

        result = await dbJassbot(client as never).getChannelCollection();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls client.db', () => {
        expect(client.db).toHaveBeenCalledWith('jassbot');
      });

      it('calls ChannelModel.getCollectionName', () => {
        expect(ChannelModel.getCollectionName).toHaveBeenCalled();
      });

      it('calls db.collection', () => {
        expect(db.collection).toHaveBeenCalledWith(collName);
      });

      it('returns collection', () => {
        expect(result).toEqual(collection);
      });
    });
  });

  describe('calling function getUserCollection', () => {
    let result: Collection;

    describe('successfully', () => {
      beforeEach(async () => {
        client.db.mockReturnValueOnce(db);
        jest.spyOn(UserModel, 'getCollectionName').mockReturnValueOnce(collName);
        db.collection.mockReturnValueOnce(collection);

        result = await dbJassbot(client as never).getUserCollection();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls client.db', () => {
        expect(client.db).toHaveBeenCalledWith('jassbot');
      });

      it('calls UserModel.getCollectionName', () => {
        expect(UserModel.getCollectionName).toHaveBeenCalled();
      });

      it('calls db.collection', () => {
        expect(db.collection).toHaveBeenCalledWith(collName);
      });

      it('returns collection', () => {
        expect(result).toEqual(collection);
      });
    });
  });

  describe('calling function syncValidations', () => {
    const testCases = [
      { modelName: 'ChannelModel', model: ChannelModel },
      { modelName: 'UserModel', model: UserModel },
    ];
    testCases.forEach(({ modelName, model }) => {
      describe(`successfully for ${modelName}`, () => {
        beforeEach(async () => {
          client.db.mockReturnValue(db);
          jest.spyOn(model, 'getCollectionName').mockReturnValue(collName);
          jest.spyOn(model, 'getValidator').mockReturnValue(validator);
          db.command.mockResolvedValue({});

          await dbJassbot(client as never).syncValidations();
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('calls client.db', () => {
          expect(client.db).toHaveBeenCalledWith('jassbot');
        });

        it(`calls ${modelName}.getCollectionName`, () => {
          expect(model.getCollectionName).toHaveBeenCalled();
        });

        it(`calls ${modelName}.getValidator`, () => {
          expect(model.getValidator).toHaveBeenCalled();
        });

        it('calls db.command', () => {
          expect(db.command).toHaveBeenCalledWith({ collMod: collName, validator });
        });
      });
    });

    describe('with model validator undefined', () => {
      beforeEach(async () => {
        client.db.mockReturnValue(db);
        db.command.mockResolvedValue({});

        await dbJassbot(client as never).syncValidations();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('does not call db.command', () => {
        expect(db.command).not.toHaveBeenCalled();
      });
    });

    describe('with error', () => {
      beforeEach(async () => {
        client.db.mockReturnValue(db);
        jest.spyOn(ChannelModel, 'getCollectionName').mockReturnValue(collName);
        jest.spyOn(ChannelModel, 'getValidator').mockReturnValue(validator);
        jest.spyOn(UserModel, 'getCollectionName').mockReturnValue(collName);
        jest.spyOn(UserModel, 'getValidator').mockReturnValue(validator);
        db.command.mockRejectedValue(error);
        jest.spyOn(logger, 'warn');

        await dbJassbot(client as never).syncValidations();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('db: jassbot syncValidation failed', { collMod: collName, error });
      });
    });
  });
});
