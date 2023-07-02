import { ObjectId } from 'mongodb';
import { logger, mongodb } from '@utils';
import type { BulkWrite, DeleteMany, Find, FindOne, FindOneAndUpdate, InsertOne } from '@types';

jest.mock('@utils/logger/logger');

describe('RequestHelper Utils', () => {
  const collection = {
    bulkWrite: jest.fn(),
    deleteMany: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    insertOne: jest.fn(),
  };
  const filter = {};
  const update = {};
  const options = {};
  const params = {};
  const defaultFindOptions = { limit: 301, sort: { _id: 1 } };
  const doc = {};
  const doc1 = { _id: 'foo' };
  const doc2 = { _id: 'bar' };
  const Model = { addTimestamps: jest.fn(), getModel: jest.fn() };
  const error = 'error';
  const nowDate = new Date('2023-06-02T00:00:00');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(nowDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('calling function bulkWrite', () => {
    let result: BulkWrite;

    describe('successfully', () => {
      const operations = ['foo'];
      const bulkWriteResult = 'foo';

      beforeEach(async () => {
        jest.spyOn(collection, 'bulkWrite').mockResolvedValueOnce(bulkWriteResult);

        result = await mongodb.bulkWrite(collection as never, operations as never, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls collection.bulkWrite', () => {
        expect(collection.bulkWrite).toHaveBeenCalledWith(operations, options);
      });

      it('returns result', () => {
        expect(result).toEqual({ result: bulkWriteResult });
      });
    });

    describe('with no operations', () => {
      beforeEach(async () => {
        jest.spyOn(collection, 'bulkWrite');

        result = await mongodb.bulkWrite(collection as never, []);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('does not call collection.bulkWrite', () => {
        expect(collection.bulkWrite).not.toHaveBeenCalled();
      });

      it('returns result with nothing', () => {
        expect(result).toEqual({});
      });
    });

    describe('with error', () => {
      const bulkWriteError = {
        code: 'code',
        writeErrors: [],
        result: { insertedCount: 0, matchedCount: 0, modifiedCount: 0, deletedCount: 0, upsertedCount: 0 },
      };

      beforeEach(async () => {
        jest.spyOn(collection, 'bulkWrite').mockRejectedValueOnce(bulkWriteError);
        jest.spyOn(logger, 'warn');

        result = await mongodb.bulkWrite(collection as never, ['foo'] as never);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('mongodb: bulkWrite failed', {
          result: bulkWriteError.result,
          error: { code: bulkWriteError.code, writeErrors: bulkWriteError.writeErrors },
        });
      });

      it('returns error', () => {
        expect(result).toEqual({ error: bulkWriteError });
      });
    });
  });

  describe('calling function deleteMany', () => {
    let result: DeleteMany;

    describe('successfully', () => {
      const deleteManyResult = 'foo';

      beforeEach(async () => {
        jest.spyOn(collection, 'deleteMany').mockResolvedValueOnce(deleteManyResult);

        result = await mongodb.deleteMany(collection as never, filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls collection.deleteMany', () => {
        expect(collection.deleteMany).toHaveBeenCalledWith(filter, options);
      });

      it('returns result', () => {
        expect(result).toEqual({ result: deleteManyResult });
      });
    });

    describe('with error', () => {
      beforeEach(async () => {
        jest.spyOn(collection, 'deleteMany').mockRejectedValueOnce(error);
        jest.spyOn(logger, 'warn');

        result = await mongodb.deleteMany(collection as never);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('mongodb: deleteMany failed', { error });
      });

      it('returns error', () => {
        expect(result).toEqual({ error });
      });
    });
  });

  describe('calling function find', () => {
    let result: Find;

    describe('successfully with no options or params', () => {
      beforeEach(async () => {
        jest.spyOn(collection, 'find').mockReturnValueOnce([doc1, doc2]);

        result = await mongodb.find(collection as never, filter, options, params);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls collection.find with default limit and sort', () => {
        expect(collection.find).toHaveBeenCalledWith(filter, defaultFindOptions);
      });

      it('returns result with docs', () => {
        expect(result.result).toEqual([doc1, doc2]);
      });
    });

    describe('with no results found', () => {
      beforeEach(async () => {
        jest.spyOn(collection, 'find').mockReturnValueOnce([]);

        result = await mongodb.find(collection as never, filter);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('returns result with docs empty and no pageInfo', () => {
        expect(result).toEqual({ result: [] });
      });
    });

    const testCases1 = [
      {
        test: 'options limit',
        exp: 'limit passed in from options',
        testOptions: { limit: 500 },
        testParams: params,
        findFilter: filter,
        findOptions: { ...defaultFindOptions, limit: 501 },
      },
      {
        test: 'params limit',
        exp: 'limit passed in from params',
        testOptions: options,
        testParams: { limit: 500 },
        findFilter: filter,
        findOptions: { ...defaultFindOptions, limit: 501 },
      },
      {
        test: 'limit too large',
        exp: 'max limit instead',
        testOptions: options,
        testParams: { limit: 10000 },
        findFilter: filter,
        findOptions: { ...defaultFindOptions, limit: 1001 },
      },
      {
        test: 'options sort',
        exp: 'sort passed in from options',
        testOptions: { sort: 'sort' },
        testParams: params,
        findFilter: filter,
        findOptions: { ...defaultFindOptions, sort: 'sort' },
      },
      {
        test: 'params sort and no before param',
        exp: 'sort in ascending order passed in from params',
        testOptions: options,
        testParams: { sort: 'sort' },
        findFilter: filter,
        findOptions: { ...defaultFindOptions, sort: { sort: 1 } },
      },
      {
        test: 'params sort and before param',
        exp: 'sort in descending order passed in from params',
        testOptions: options,
        testParams: { sort: 'sort', before: 'before' },
        findFilter: { _id: { $lt: undefined } },
        findOptions: { ...defaultFindOptions, sort: { sort: -1 } },
      },
    ];
    testCases1.forEach(({ test, exp, testOptions, testParams, findFilter, findOptions }) => {
      describe(`with ${test}`, () => {
        beforeEach(async () => {
          jest.spyOn(collection, 'find').mockReturnValueOnce([]);

          result = await mongodb.find(collection as never, filter, testOptions, testParams);
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it(`calls collection.find with ${exp}`, () => {
          expect(collection.find).toHaveBeenCalledWith(findFilter, findOptions);
        });
      });
    });

    const testCases2 = [
      {
        test: 'params after',
        exp: 'greater than after param',
        findParams: { after: 'foo' },
        findFilter: { _id: { $gt: 'bar' } },
        findOptions: defaultFindOptions,
      },
      {
        test: 'params before',
        exp: 'less than before param',
        findParams: { before: 'foo' },
        findFilter: { _id: { $lt: 'bar' } },
        findOptions: { ...defaultFindOptions, sort: { _id: -1 } },
      },
    ];
    testCases2.forEach(({ test, exp, findParams, findFilter, findOptions }) => {
      describe(`with ${test}`, () => {
        beforeEach(async () => {
          jest.spyOn(ObjectId, 'createFromHexString').mockReturnValueOnce('bar' as never);
          jest.spyOn(collection, 'find').mockReturnValueOnce([]);

          result = await mongodb.find(collection as never, filter, options, findParams);
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('calls ObjectId.createFromHexString', () => {
          expect(ObjectId.createFromHexString).toHaveBeenCalledWith('foo');
        });

        it(`calls collection.find with filter containing _id ${exp}`, () => {
          expect(collection.find).toHaveBeenCalledWith(findFilter, findOptions);
        });
      });
    });

    const testCases3 = [
      { test: 'no more results', findOptions: {}, endCursor: doc2._id, hasNextPage: false },
      { test: 'more results', findOptions: { limit: 1 }, endCursor: doc1._id, hasNextPage: true },
    ];
    testCases3.forEach(({ test, findOptions, endCursor, hasNextPage }) => {
      describe(`with params after and has ${test}`, () => {
        const findParams = { after: 'foo' };

        beforeEach(async () => {
          jest.spyOn(collection, 'find').mockReturnValueOnce([doc1, doc2]);

          result = await mongodb.find(collection as never, filter, findOptions, findParams);
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it(`returns pageInfo containing endCursor and hasNextPage=${hasNextPage}`, () => {
          expect(result.pageInfo).toEqual({ endCursor, hasNextPage });
        });
      });
    });

    const testCases4 = [
      { test: 'no more results', findOptions: {}, startCursor: doc1._id, hasPreviousPage: false },
      { test: 'more results', findOptions: { limit: 1 }, startCursor: doc2._id, hasPreviousPage: true },
    ];
    testCases4.forEach(({ test, findOptions, startCursor, hasPreviousPage }) => {
      describe(`with params before and has ${test}`, () => {
        const findParams = { before: 'foo' };

        beforeEach(async () => {
          jest.spyOn(collection, 'find').mockReturnValueOnce([doc2, doc1]);

          result = await mongodb.find(collection as never, filter, findOptions, findParams);
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it(`returns pageInfo containing startCursor and hasPreviousPage=${hasPreviousPage}`, () => {
          expect(result.pageInfo).toEqual({ startCursor, hasPreviousPage });
        });
      });
    });

    describe('with Model that has getModel', () => {
      beforeEach(async () => {
        jest.spyOn(Model, 'getModel').mockReturnValueOnce(doc1);
        jest.spyOn(collection, 'find').mockReturnValueOnce([doc1]);

        result = await mongodb.find(collection as never, filter, options, params, Model as never);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls Model.getModel on result', () => {
        expect(Model.getModel).toHaveBeenCalled();
      });
    });
  });

  describe('calling function findOne', () => {
    const findOneResult = 'foo';
    let result: FindOne;

    describe('successfully', () => {
      beforeEach(async () => {
        jest.spyOn(collection, 'findOne').mockResolvedValueOnce(findOneResult);

        result = await mongodb.findOne(collection as never, filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls collection.findOne', () => {
        expect(collection.findOne).toHaveBeenCalledWith(filter, options);
      });

      it('returns result', () => {
        expect(result).toEqual({ result: findOneResult });
      });
    });

    describe('with Model that has getModel', () => {
      beforeEach(async () => {
        jest.spyOn(Model, 'getModel').mockReturnValueOnce(findOneResult);
        jest.spyOn(collection, 'findOne').mockResolvedValueOnce(findOneResult);

        result = await mongodb.findOne(collection as never, filter, options, Model as never);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls Model.getModel', () => {
        expect(Model.getModel).toHaveBeenCalled();
      });
    });

    describe('with error', () => {
      beforeEach(async () => {
        jest.spyOn(collection, 'findOne').mockRejectedValueOnce(error);
        jest.spyOn(logger, 'warn');

        result = await mongodb.findOne(collection as never, filter);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('mongodb: findOne failed', { error });
      });

      it('returns error', () => {
        expect(result).toEqual({ error });
      });
    });
  });

  describe('calling function findOneAndUpdate', () => {
    const modifyResult = { ok: 1, value: 'foo' };
    const updateOptions = { returnDocument: 'after', upsert: true, ...options };
    let result: FindOneAndUpdate;

    describe('successfully', () => {
      beforeEach(async () => {
        jest.spyOn(collection, 'findOneAndUpdate').mockResolvedValueOnce(modifyResult);

        result = await mongodb.findOneAndUpdate(collection as never, filter, update, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls collection.findOneAndUpdate', () => {
        expect(collection.findOneAndUpdate).toHaveBeenCalledWith(filter, update, updateOptions);
      });

      it('returns updated doc and result', () => {
        expect(result).toEqual({ doc: modifyResult.value, result: modifyResult });
      });
    });

    describe('with Model that has addTimestamps', () => {
      const updateFilter = { $set: { updatedAt: nowDate }, $setOnInsert: { createdAt: nowDate } };

      beforeEach(async () => {
        jest.spyOn(Model, 'addTimestamps').mockReturnValueOnce(true);
        jest.spyOn(collection, 'findOneAndUpdate').mockResolvedValueOnce(modifyResult);

        result = await mongodb.findOneAndUpdate(collection as never, filter, update, options, Model as never);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls Model.addTimestamps', () => {
        expect(Model.addTimestamps).toHaveBeenCalled();
      });

      it('calls collection.findOneAndUpdate with update filter containing timestamps', () => {
        expect(collection.findOneAndUpdate).toHaveBeenCalledWith(filter, updateFilter, updateOptions);
      });
    });

    describe('with Model that has getModel', () => {
      beforeEach(async () => {
        jest.spyOn(Model, 'addTimestamps').mockReturnValueOnce(false);
        jest.spyOn(Model, 'getModel');
        jest.spyOn(collection, 'findOneAndUpdate').mockResolvedValueOnce(modifyResult);

        result = await mongodb.findOneAndUpdate(collection as never, filter, update, options, Model as never);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls Model.getModel', () => {
        expect(Model.getModel).toHaveBeenCalled();
      });
    });

    const testCases = [
      { test: 'not ok', findOneAndUpdateResult: { ok: 0 } },
      { test: 'having no value', findOneAndUpdateResult: { ok: 1, value: null } },
    ];
    testCases.forEach(({ test, findOneAndUpdateResult }) => {
      describe(`with result ${test}`, () => {
        beforeEach(async () => {
          jest.spyOn(collection, 'findOneAndUpdate').mockResolvedValueOnce(findOneAndUpdateResult);

          result = await mongodb.findOneAndUpdate(collection as never, filter, update);
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('returns result only and no doc', () => {
          expect(result).toEqual({ result: findOneAndUpdateResult });
        });
      });
    });

    describe('with error', () => {
      beforeEach(async () => {
        jest.spyOn(collection, 'findOneAndUpdate').mockRejectedValueOnce(error);

        result = await mongodb.findOneAndUpdate(collection as never, filter, update, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('mongodb: findOneAndUpdate failed', { error });
      });

      it('returns error', () => {
        expect(result).toEqual({ error });
      });
    });
  });

  describe('calling function insertOne', () => {
    const insertOneResult = { acknowledged: true, insertedId: 'insertedId' };
    let result: InsertOne;

    describe('successfully', () => {
      beforeEach(async () => {
        jest.spyOn(collection, 'insertOne').mockResolvedValueOnce(insertOneResult);

        result = await mongodb.insertOne(collection as never, doc, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls collection.insertOne', () => {
        expect(collection.insertOne).toHaveBeenCalledWith(doc, options);
      });

      it('returns inserted doc and result', () => {
        expect(result).toEqual({ doc: { _id: insertOneResult.insertedId, ...doc }, result: insertOneResult });
      });
    });

    describe('with Model that has addTimestamps', () => {
      const newDoc = { ...doc, createdAt: nowDate, updatedAt: nowDate, deletedAt: null };

      beforeEach(async () => {
        jest.spyOn(Model, 'addTimestamps').mockReturnValueOnce(true);
        jest.spyOn(collection, 'insertOne').mockResolvedValueOnce(insertOneResult);

        result = await mongodb.insertOne(collection as never, doc, options, Model as never);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls Model.addTimestamps', () => {
        expect(Model.addTimestamps).toHaveBeenCalled();
      });

      it('calls collection.insertOne with doc containing timestamps', () => {
        expect(collection.insertOne).toHaveBeenCalledWith(newDoc, options);
      });
    });

    describe('with Model that has getModel', () => {
      beforeEach(async () => {
        jest.spyOn(Model, 'addTimestamps').mockReturnValueOnce(false);
        jest.spyOn(Model, 'getModel');
        jest.spyOn(collection, 'insertOne').mockResolvedValueOnce(insertOneResult);

        result = await mongodb.insertOne(collection as never, doc, options, Model as never);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls Model.getModel', () => {
        expect(Model.getModel).toHaveBeenCalled();
      });
    });

    describe('with result not acknowledged', () => {
      const resultNotAck = { acknowledged: false };

      beforeEach(async () => {
        jest.spyOn(collection, 'insertOne').mockResolvedValueOnce(resultNotAck);

        result = await mongodb.insertOne(collection as never, doc, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('returns result only and no doc', () => {
        expect(result).toEqual({ result: resultNotAck });
      });
    });

    describe('with error', () => {
      beforeEach(async () => {
        jest.spyOn(collection, 'insertOne').mockRejectedValueOnce(error);

        result = await mongodb.insertOne(collection as never, doc);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('mongodb: insertOne failed', { error });
      });

      it('returns error', () => {
        expect(result).toEqual({ error });
      });
    });
  });
});
