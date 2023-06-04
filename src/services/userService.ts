import { ObjectId } from 'mongodb';
import { UserModel } from '@db/models';
import { logger } from '@utils';
import {
  DB_BATCH_SIZE_DEFAULT,
  DB_BATCH_SIZE_MAX,
  DB_LIMIT_DEFAULT,
  DB_LIMIT_MAX,
  DB_SORT_DEFAULT,
} from '@utils/constants';
import type { AnyBulkWriteOperation } from 'mongodb';
import type { FilterQuery, Types, UpdateQuery } from 'mongoose';
import type { BulkWriteResults, FindOptions, User, UserData } from '@types';

const bulkWrite = (ops: AnyBulkWriteOperation<UserData>[]): Promise<BulkWriteResults> | undefined => {
  logger.debug('userService: bulkWrite called', { numOps: ops.length });

  return ops.length > 0
    ? UserModel.bulkWrite(ops)
        .then((result) => {
          const { ok, insertedCount, upsertedCount, matchedCount, modifiedCount, deletedCount } = result;

          return { ok, insertedCount, upsertedCount, matchedCount, modifiedCount, deletedCount };
        })
        .catch((error) => {
          logger.warn('userService: bulkWrite failed', { error });

          return undefined;
        })
    : undefined;
};

const create = (data: UserData | UserData[]): Promise<User | User[] | null> => {
  logger.debug('userService: create called', { data });

  return UserModel.create(data)
    .then((result) => result)
    .catch((error) => {
      logger.warn('userService: create failed', { error });

      return null;
    });
};

const find = async (filter: FilterQuery<UserData>, options?: FindOptions): Promise<User[]> => {
  logger.debug('userService: find called', { filter, options });
  const { batchSize = DB_BATCH_SIZE_DEFAULT, limit = DB_LIMIT_DEFAULT, sort = undefined } = options || {};
  const users: User[] = [];

  try {
    const cursor = UserModel.find(filter)
      .sort(sort)
      .limit(Math.min(limit, DB_LIMIT_MAX))
      .cursor({ batchSize: Math.min(batchSize, DB_BATCH_SIZE_MAX) });

    // eslint-disable-next-line no-await-in-loop
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      users.push(doc);
    }
  } catch (error) {
    logger.warn('userService: find error', { error });
  }

  return users;
};

const findAll = async (filter: FilterQuery<UserData>, options?: FindOptions): Promise<User[]> => {
  const { limit = DB_LIMIT_DEFAULT, sort = DB_SORT_DEFAULT } = options || {};
  const findOptions = { ...options, limit, sort };
  let allUsers: User[] = [];
  let afterId: Types.ObjectId | undefined;
  let hasMore = false;

  do {
    const findFilter = { ...filter, ...(afterId ? { _id: { $gt: new ObjectId(afterId) } } : {}) };
    // eslint-disable-next-line no-await-in-loop
    const users = await find(findFilter, findOptions);

    if (users.length > 0) {
      allUsers = [...allUsers, ...users];
    }

    afterId = users.at(-1)?._id || undefined;
    hasMore = users.length > 0 && users.length === limit;
  } while (hasMore);

  return allUsers;
};

const findOne = (filter: FilterQuery<UserData>): Promise<User | null> => {
  logger.debug('userService: findOne called', { filter });

  return UserModel.findOne(filter)
    .then((result) => result)
    .catch((error) => {
      logger.warn('userService: findOne failed', { error });

      return null;
    });
};

const findOneAndUpdateByUserId = (userId: string, data: UpdateQuery<UserData>): Promise<User | null> => {
  logger.debug('userService: findOneAndUpdateByUserId called', { userId, data });
  const filter = { userId };
  const options = { new: true, setDefaultsOnInsert: true, upsert: true };

  return UserModel.findOneAndUpdate(filter, data, options)
    .then((result) => result)
    .catch((error) => {
      logger.warn('userService: findOneAndUpdateByUserId failed', { error });

      return null;
    });
};

const findOneOrCreateByUserId = (userId: string): Promise<User | null> => {
  return findOne({ userId }).then((result) => result || create({ userId }).then((newResult) => newResult as User));
};

export default { bulkWrite, create, find, findAll, findOne, findOneAndUpdateByUserId, findOneOrCreateByUserId };
