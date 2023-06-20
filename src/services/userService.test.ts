import { ObjectId } from 'mongodb';
import { UserModel } from '@db/models';
import { userService } from '@services';
import { logger } from '@utils';
import {
  DB_BATCH_SIZE_DEFAULT,
  DB_BATCH_SIZE_MAX,
  DB_LIMIT_DEFAULT,
  DB_LIMIT_MAX,
  DB_SORT_DEFAULT_OLD,
} from '@utils/constants';
import type { Query } from 'mongoose';
import type { UserOld } from '@types';

jest.mock('@db/models/userModel');
jest.mock('@utils/logger/logger');

describe('services user', () => {
  const user1 = { _id: '6471bdeb1eda180988fb5a19', userId: 'foo' };
  const user2 = { _id: '6471bee81eda180988fb5b0e', userId: 'bar' };
  const error = 'error';

  // TODO: change to mongodb
  // describe('calling function bulkWrite', () => {
  //   const ops: AnyBulkWriteOperation<UserData>[] = [{ updateOne: { filter: {}, update: {} } }];
  //   let results: BulkWriteResults;
  //
  //   describe('successfully', () => {
  //     const result = {
  //       ok: 1, insertedCount: 1, upsertedCount: 1, matchedCount: 1, modifiedCount: 1, deletedCount: 1 };
  //
  //     beforeEach(async () => {
  //       jest.spyOn(UserModel, 'bulkWrite').mockResolvedValueOnce(result as unknown as BulkWriteResult);
  //
  //       results = await userService.bulkWrite(ops);
  //     });
  //
  //     afterEach(() => {
  //       jest.restoreAllMocks();
  //     });
  //
  //     it('calls UserModel.bulkWrite', () => {
  //       expect(UserModel.bulkWrite).toHaveBeenCalledWith(ops);
  //     });
  //
  //     it('returns results', () => {
  //       expect(results).toEqual({ ...result });
  //     });
  //   });
  //
  //   describe('with ops empty', () => {
  //     beforeEach(async () => {
  //       jest.spyOn(UserModel, 'bulkWrite');
  //
  //       results = await userService.bulkWrite([]);
  //     });
  //
  //     afterEach(() => {
  //       jest.restoreAllMocks();
  //     });
  //
  //     it('does not call UserModel.bulkWrite', () => {
  //       expect(UserModel.bulkWrite).not.toHaveBeenCalled();
  //     });
  //
  //     it('returns undefined', () => {
  //       expect(results).toEqual(undefined);
  //     });
  //   });
  //
  //   describe('with error on UserModel.bulkWrite', () => {
  //     beforeEach(async () => {
  //       jest.spyOn(UserModel, 'bulkWrite').mockRejectedValueOnce(error);
  //
  //       results = await userService.bulkWrite(ops);
  //     });
  //
  //     afterEach(() => {
  //       jest.restoreAllMocks();
  //     });
  //
  //     it('calls logger.warn', () => {
  //       expect(logger.warn).toHaveBeenCalledWith('userService: bulkWrite failed', { error });
  //     });
  //
  //     it('returns undefined', () => {
  //       expect(results).toEqual(undefined);
  //     });
  //   });
  // });

  // TODO: change to mongodb
  // describe('calling function create', () => {
  //   const data = { userId: 'foo' };
  //   let result: User | User[] | null;
  //
  //   describe('successfully', () => {
  //     beforeEach(async () => {
  //       jest.spyOn(UserModel, 'create').mockResolvedValueOnce(user1 as unknown as User[]);
  //
  //       result = await userService.create(data);
  //     });
  //
  //     afterEach(() => {
  //       jest.restoreAllMocks();
  //     });
  //
  //     it('calls UserModel.create', () => {
  //       expect(UserModel.create).toHaveBeenCalledWith(data);
  //     });
  //
  //     it('returns new User', () => {
  //       expect(result).toEqual(user1);
  //     });
  //   });
  //
  //   describe('with error on UserModel.create', () => {
  //     beforeEach(async () => {
  //       jest.spyOn(UserModel, 'create').mockRejectedValueOnce(error);
  //
  //       result = await userService.create(data);
  //     });
  //
  //     afterEach(() => {
  //       jest.restoreAllMocks();
  //     });
  //
  //     it('calls logger.warn', () => {
  //       expect(logger.warn).toHaveBeenCalledWith('userService: create failed', { error });
  //     });
  //
  //     it('returns null', () => {
  //       expect(result).toEqual(null);
  //     });
  //   });
  // });

  // TODO: change to mongodb
  // describe('calling function deleteMany', () => {
  //   const filter = { buildingId: 123 };
  //   const options = { timestamps: false };
  //   const deleteManyResult = { acknowledged: true, deletedCount: 100 };
  //   let result: DeleteResult | null;
  //
  //   describe('successfully', () => {
  //     beforeEach(async () => {
  //       jest.spyOn(UserModel, 'deleteMany').mockResolvedValueOnce(deleteManyResult);
  //
  //       result = await userService.deleteMany(filter);
  //     });
  //
  //     afterEach(() => {
  //       jest.restoreAllMocks();
  //     });
  //
  //     it('calls UserModel.deleteMany', () => {
  //       expect(UserModel.deleteMany).toHaveBeenCalledWith(filter, undefined);
  //     });
  //
  //     it('returns result', () => {
  //       expect(result).toEqual(deleteManyResult);
  //     });
  //   });
  //
  //   describe('with options', () => {
  //     beforeEach(async () => {
  //       jest.spyOn(UserModel, 'deleteMany').mockResolvedValueOnce(deleteManyResult);
  //
  //       result = await userService.deleteMany(filter, options);
  //     });
  //
  //     afterEach(() => {
  //       jest.restoreAllMocks();
  //     });
  //
  //     it('calls UserModel.deleteMany with options', () => {
  //       expect(UserModel.deleteMany).toHaveBeenCalledWith(filter, options);
  //     });
  //   });
  //
  //   describe('with error on UserModel.deleteMany', () => {
  //     beforeEach(async () => {
  //       jest.spyOn(UserModel, 'deleteMany').mockRejectedValueOnce(error);
  //
  //       result = await userService.deleteMany(filter);
  //     });
  //
  //     afterEach(() => {
  //       jest.restoreAllMocks();
  //     });
  //
  //     it('calls logger.warn', () => {
  //       expect(logger.warn).toHaveBeenCalledWith('userService: deleteMany failed', { error });
  //     });
  //
  //     it('returns null', () => {
  //       expect(result).toEqual(null);
  //     });
  //   });
  // });

  describe('calling function find', () => {
    const filter = { isPrivate: true };
    let next: jest.Mock;
    let cursor: jest.Mock;
    let limit: jest.Mock;
    let sort: jest.Mock;
    let result: UserOld[];

    describe('successfully with no options param', () => {
      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(user1).mockReturnValueOnce(user2).mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(UserModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await userService.find(filter);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls UserModel.find', () => {
        expect(UserModel.find).toHaveBeenCalledWith(filter);
      });

      it('calls sort with undefined', () => {
        expect(sort).toHaveBeenCalledWith(undefined);
      });

      it('calls limit with DB_LIMIT_DEFAULT', () => {
        expect(limit).toHaveBeenCalledWith(DB_LIMIT_DEFAULT);
      });

      it('calls cursor with DB_BATCH_SIZE_DEFAULT', () => {
        expect(cursor).toHaveBeenCalledWith({ batchSize: DB_BATCH_SIZE_DEFAULT });
      });

      it('calls cursor.next', () => {
        expect(next).toHaveBeenCalled();
      });

      it('returns users found', () => {
        expect(result).toEqual([user1, user2]);
      });
    });

    describe('with options empty', () => {
      const options = {};

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(UserModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await userService.find(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls sort with undefined', () => {
        expect(sort).toHaveBeenCalledWith(undefined);
      });

      it('calls limit with DB_LIMIT_DEFAULT', () => {
        expect(limit).toHaveBeenCalledWith(DB_LIMIT_DEFAULT);
      });

      it('calls cursor with DB_BATCH_SIZE_DEFAULT', () => {
        expect(cursor).toHaveBeenCalledWith({ batchSize: DB_BATCH_SIZE_DEFAULT });
      });
    });

    describe('with options batchSize param', () => {
      const options = { batchSize: 10 };

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(UserModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await userService.find(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls cursor with options batchSize param', () => {
        expect(cursor).toHaveBeenCalledWith({ batchSize: options.batchSize });
      });
    });

    describe('with options limit param', () => {
      const options = { limit: 10 };

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(UserModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await userService.find(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls limit with options limit param', () => {
        expect(limit).toHaveBeenCalledWith(options.limit);
      });
    });

    describe('with options sort param', () => {
      const options = { sort: 'sort' };

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(UserModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await userService.find(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls sort with options sort param', () => {
        expect(sort).toHaveBeenCalledWith(options.sort);
      });
    });

    describe('with options batchSize param too large', () => {
      const options = { batchSize: 10000 };

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(UserModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await userService.find(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls cursor with DB_BATCH_SIZE_MAX', () => {
        expect(cursor).toHaveBeenCalledWith({ batchSize: DB_BATCH_SIZE_MAX });
      });
    });

    describe('with options limit param too large', () => {
      const options = { limit: 10000 };

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(UserModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await userService.find(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls limit with DB_LIMIT_MAX', () => {
        expect(limit).toHaveBeenCalledWith(DB_LIMIT_MAX);
      });
    });

    describe('with error on UserModel.find', () => {
      beforeEach(async () => {
        jest.spyOn(UserModel, 'find').mockImplementationOnce(() => {
          throw error;
        });

        result = await userService.find(filter);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('userService: find error', { error });
      });

      it('returns users empty array', () => {
        expect(result).toEqual([]);
      });
    });
  });

  describe('calling function findAll', () => {
    const filter = { isPrivate: true };
    let next: jest.Mock;
    let cursor: jest.Mock;
    let limit: jest.Mock;
    let sort: jest.Mock;
    let result: UserOld[];

    describe('successfully with no options param', () => {
      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(user1).mockReturnValueOnce(user2).mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(UserModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await userService.findAll(filter);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls UserModel.find', () => {
        expect(UserModel.find).toHaveBeenCalledWith(filter);
      });

      it('calls sort with DB_SORT_DEFAULT', () => {
        expect(sort).toHaveBeenCalledWith(DB_SORT_DEFAULT_OLD);
      });

      it('calls limit with DB_LIMIT_DEFAULT', () => {
        expect(limit).toHaveBeenCalledWith(DB_LIMIT_DEFAULT);
      });

      it('calls cursor with DB_BATCH_SIZE_DEFAULT', () => {
        expect(cursor).toHaveBeenCalledWith({ batchSize: DB_BATCH_SIZE_DEFAULT });
      });

      it('returns users found', () => {
        expect(result).toEqual([user1, user2]);
      });
    });

    describe('with options empty', () => {
      const options = {};

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(UserModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await userService.findAll(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls sort with DB_SORT_DEFAULT', () => {
        expect(sort).toHaveBeenCalledWith(DB_SORT_DEFAULT_OLD);
      });

      it('calls limit with DB_LIMIT_DEFAULT', () => {
        expect(limit).toHaveBeenCalledWith(DB_LIMIT_DEFAULT);
      });

      it('calls cursor with DB_BATCH_SIZE_DEFAULT', () => {
        expect(cursor).toHaveBeenCalledWith({ batchSize: DB_BATCH_SIZE_DEFAULT });
      });
    });

    describe('with options batchSize param', () => {
      const options = { batchSize: 10 };

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(UserModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await userService.findAll(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls cursor with options batchSize param', () => {
        expect(cursor).toHaveBeenCalledWith({ batchSize: options.batchSize });
      });
    });

    describe('with options limit param', () => {
      const options = { limit: 10 };

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(UserModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await userService.findAll(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls limit with options limit param', () => {
        expect(limit).toHaveBeenCalledWith(options.limit);
      });
    });

    describe('with options sort param', () => {
      const options = { sort: 'sort' };

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(UserModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await userService.findAll(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls sort with options sort param', () => {
        expect(sort).toHaveBeenCalledWith(options.sort);
      });
    });

    describe('with multiple pages', () => {
      const options = { limit: 2 };

      beforeEach(async () => {
        next = jest
          .fn()
          .mockReturnValueOnce(user1)
          .mockReturnValueOnce(user2)
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(UserModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await userService.findAll(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls UserModel.find for first call with no _id filter', () => {
        expect(UserModel.find).toHaveBeenNthCalledWith(1, filter);
      });

      it('calls UserModel.find for second call with _id filter of last User in page', () => {
        expect(UserModel.find).toHaveBeenNthCalledWith(2, { ...filter, _id: { $gt: new ObjectId(user2._id) } });
      });
    });
  });

  // TODO: change to mongodb
  // describe('calling function findOne', () => {
  //   const filter = { userId: 'foo' };
  //   let result: User | null;
  //
  //   describe('successfully', () => {
  //     beforeEach(async () => {
  //       jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(user1);
  //
  //       result = await userService.findOne(filter);
  //     });
  //
  //     afterEach(() => {
  //       jest.restoreAllMocks();
  //     });
  //
  //     it('calls UserModel.findOne', () => {
  //       expect(UserModel.findOne).toHaveBeenCalledWith(filter);
  //     });
  //
  //     it('returns User', () => {
  //       expect(result).toEqual(user1);
  //     });
  //   });
  //
  //   describe('with error on UserModel.findOne', () => {
  //     beforeEach(async () => {
  //       jest.spyOn(UserModel, 'findOne').mockRejectedValueOnce(error);
  //
  //       result = await userService.findOne(filter);
  //     });
  //
  //     afterEach(() => {
  //       jest.restoreAllMocks();
  //     });
  //
  //     it('calls logger.warn', () => {
  //       expect(logger.warn).toHaveBeenCalledWith('userService: findOne failed', { error });
  //     });
  //
  //     it('returns null', () => {
  //       expect(result).toEqual(null);
  //     });
  //   });
  // });

  // TODO: change to mongodb
  // describe('calling function findOneAndUpdateByUserId', () => {
  //   const userId = 'foo';
  //   const filter = { userId };
  //   const data = { foo: 'bar' };
  //   const options = { new: true, setDefaultsOnInsert: true, upsert: true };
  //   let result: User | null;
  //
  //   describe('successfully', () => {
  //     beforeEach(async () => {
  //       jest.spyOn(UserModel, 'findOneAndUpdate').mockResolvedValueOnce(user1);
  //
  //       result = await userService.findOneAndUpdateByUserId(userId, data);
  //     });
  //
  //     afterEach(() => {
  //       jest.restoreAllMocks();
  //     });
  //
  //     it('calls UserModel.findOneAndUpdate', () => {
  //       expect(UserModel.findOneAndUpdate).toHaveBeenCalledWith(filter, data, options);
  //     });
  //
  //     it('returns User', () => {
  //       expect(result).toEqual(user1);
  //     });
  //   });
  //
  //   describe('with error on UserModel.findOneAndUpdate', () => {
  //     beforeEach(async () => {
  //       jest.spyOn(UserModel, 'findOneAndUpdate').mockRejectedValueOnce(error);
  //
  //       result = await userService.findOneAndUpdateByUserId(userId, data);
  //     });
  //
  //     afterEach(() => {
  //       jest.restoreAllMocks();
  //     });
  //
  //     it('calls logger.warn', () => {
  //       expect(logger.warn).toHaveBeenCalledWith('userService: findOneAndUpdateByUserId failed', { error });
  //     });
  //
  //     it('returns null', () => {
  //       expect(result).toEqual(null);
  //     });
  //   });
  // });

  // TODO: change to mongodb
  // describe('calling function findOneOrCreateByUserId', () => {
  //   const userId = 'foo';
  //   let result: User | null;
  //
  //   describe('successfully finds one', () => {
  //     beforeEach(async () => {
  //       jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(user1);
  //
  //       result = await userService.findOneOrCreateByUserId(userId);
  //     });
  //
  //     afterEach(() => {
  //       jest.restoreAllMocks();
  //     });
  //
  //     it('calls UserModel.findOne', () => {
  //       expect(UserModel.findOne).toHaveBeenCalledWith({ userId });
  //     });
  //
  //     it('returns User', () => {
  //       expect(result).toEqual(user1);
  //     });
  //   });
  //
  //   describe('successfully creates one', () => {
  //     beforeEach(async () => {
  //       jest.spyOn(UserModel, 'findOne').mockResolvedValueOnce(null);
  //       jest.spyOn(UserModel, 'create').mockResolvedValueOnce(user1 as unknown as User[]);
  //
  //       result = await userService.findOneOrCreateByUserId(userId);
  //     });
  //
  //     afterEach(() => {
  //       jest.restoreAllMocks();
  //     });
  //
  //     it('calls UserModel.findOne', () => {
  //       expect(UserModel.findOne).toHaveBeenCalledWith({ userId });
  //     });
  //
  //     it('calls UserModel.create', () => {
  //       expect(UserModel.create).toHaveBeenCalledWith({ userId });
  //     });
  //
  //     it('returns User', () => {
  //       expect(result).toEqual(user1);
  //     });
  //   });
  // });
});
