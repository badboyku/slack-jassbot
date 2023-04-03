import { UserModel } from '@db/models';
import { logger } from '@utils';
import {
  DEFAULT_DB_BATCH_SIZE,
  DEFAULT_DB_LIMIT,
  DEFAULT_DB_FIND_OPTIONS,
  DEFAULT_DB_SORT,
  DB_MAX_BATCH_SIZE,
  DB_MAX_LIMIT,
} from '@utils/constants';
import type { AnyBulkWriteOperation } from 'mongodb';
import type { FilterQuery, Types, UpdateQuery } from 'mongoose';
import type { User, UserDocType } from '@db/models/UserModel';
import type { BulkWriteResults, FindOptions } from '@types';

type UserData = {
  userId?: string;
  birthday?: string;
  birthdayLookup?: string;
  birthdayRaw?: string; // TODO: REMOVE THIS!!!
  birthdayRawLookup?: string; // TODO: REMOVE THIS!!!
  workAnniversary?: string;
  workAnniversaryLookup?: string;
  workAnniversaryRaw?: string; // TODO: REMOVE THIS!!!
  workAnniversaryRawLookup?: string; // TODO: REMOVE THIS!!!
};

const bulkWrite = (ops: AnyBulkWriteOperation<UserDocType>[]): Promise<BulkWriteResults> | undefined => {
  logger.debug('userService: bulkWrite called', { numOps: ops.length });

  return ops.length > 0
    ? UserModel.bulkWrite(ops)
        .then((result) => {
          const { ok, nInserted, nUpserted, nMatched, nModified, nRemoved } = result;

          return { ok, nInserted, nUpserted, nMatched, nModified, nRemoved };
        })
        .catch((error) => {
          logger.warn('userService: bulkWrite failed', { error });

          return undefined;
        })
    : undefined;
};

const create = (data: UserData): Promise<User> => {
  logger.debug('userService: create called', { data });
  const user = new UserModel(data);

  return user
    .save()
    .then((result) => result)
    .catch((error) => {
      logger.warn('userService: create failed', { error });

      return null;
    });
};

const find = async (filter: FilterQuery<UserData>, options?: FindOptions): Promise<User[]> => {
  logger.debug('userService: find called', { filter, options });
  const {
    batchSize = DEFAULT_DB_BATCH_SIZE,
    limit = DEFAULT_DB_LIMIT,
    sort = undefined,
  } = options || DEFAULT_DB_FIND_OPTIONS;
  const users: User[] = [];

  try {
    const cursor = UserModel.find(filter)
      .sort(sort)
      .limit(Math.min(limit, DB_MAX_LIMIT))
      .cursor({ batchSize: Math.min(batchSize, DB_MAX_BATCH_SIZE) });

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
  logger.debug('userService: findAll called', { filter, options });
  const {
    batchSize = DEFAULT_DB_BATCH_SIZE,
    limit = DEFAULT_DB_LIMIT,
    sort = DEFAULT_DB_SORT,
  } = options || DEFAULT_DB_FIND_OPTIONS;
  let allUsers: User[] = [];
  let afterId: Types.ObjectId | undefined;
  let hasMore = false;

  const findOptions = { batchSize, limit, sort };

  do {
    const findFilter = { ...filter, ...(afterId ? { _id: { $gt: afterId } } : {}) };
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

const findOne = (filter: FilterQuery<UserData>): Promise<User> => {
  logger.debug('userService: findOne called', { filter });

  return UserModel.findOne(filter)
    .then((result) => result)
    .catch((error) => {
      logger.warn('userService: findOne failed', { error });

      return null;
    });
};

const findOneAndUpdateByUserId = (userId: string, data: UpdateQuery<UserData>): Promise<User> => {
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

const findOneOrCreateByUserId = (userId: string): Promise<User> => {
  logger.debug('userService: findOneOrCreateByUserId called', { userId });

  return findOne({ userId }).then((result) => result || create({ userId }).then((newResult) => newResult));
};

export default { bulkWrite, create, find, findAll, findOne, findOneAndUpdateByUserId, findOneOrCreateByUserId };
