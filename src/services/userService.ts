import { UserModel } from '../db/models';
import logger from '../utils/logger';
import type { AnyBulkWriteOperation } from 'mongodb';
import type { FilterQuery, SortOrder, Types, UpdateQuery } from 'mongoose';
import type { BulkWriteResults } from '../@types/global';
import type { User, UserDocType } from '../db/models/UserModel';

type Sort = string | { [key: string]: SortOrder | { $meta: 'textScore' } } | [string, SortOrder][] | undefined | null;

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

const defaultBatchSize = 100;
const maxBatchSize = 1000;
const defaultLimit = 100;
const maxLimit = 1000;
const defaultSort: Sort = { _id: 1 };

const bulkWrite = async (ops: AnyBulkWriteOperation<UserDocType>[]): Promise<BulkWriteResults | undefined> => {
  if (ops.length === 0) {
    return undefined;
  }

  return UserModel.bulkWrite(ops)
    .then((result) => {
      const { ok, nInserted, nUpserted, nMatched, nModified, nRemoved } = result;

      return { ok, nInserted, nUpserted, nMatched, nModified, nRemoved };
    })
    .catch((error) => {
      logger.warn('userService: bulkWrite failed', { error });

      return undefined;
    });
};

const create = async (data: UserData): Promise<User> => {
  const user = new UserModel(data);

  return user
    .save()
    .then((result) => {
      return result;
    })
    .catch((error) => {
      logger.warn('userService: create failed', { error });

      return null;
    });
};

type FindOptions = { batchSize?: number; limit?: number; sort?: Sort };
const find = async (filter: FilterQuery<UserData>, options?: FindOptions): Promise<User[]> => {
  const { batchSize = defaultBatchSize, limit = defaultLimit, sort } = options || {};
  const users: User[] = [];

  try {
    const cursor = UserModel.find(filter)
      .sort(sort)
      .limit(Math.min(limit, maxLimit))
      .cursor({ batchSize: Math.min(batchSize, maxBatchSize) });

    // eslint-disable-next-line no-await-in-loop
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      users.push(doc);
    }
  } catch (error) {
    logger.warn('userService: find error', { error });
  }

  return users;
};

const findAll = async (filter: FilterQuery<UserData>): Promise<User[]> => {
  logger.debug('userService: findAll called', { filter });
  let allUsers: User[] = [];
  let afterId: Types.ObjectId | undefined;
  let hasMore = false;

  const pageSize = 100;
  const options = { limit: pageSize, sort: defaultSort };

  do {
    const findFilter = { ...filter, ...(afterId ? { _id: { $gt: afterId } } : {}) };
    // eslint-disable-next-line no-await-in-loop
    const users = await find(findFilter, options);

    if (users.length > 0) {
      allUsers = [...allUsers, ...users];
    }

    afterId = users.at(-1)?._id || undefined;
    hasMore = users.length > 0 && users.length === pageSize;
  } while (hasMore);

  return allUsers;
};

const findOne = async (filter: FilterQuery<UserData>): Promise<User> => {
  return UserModel.findOne(filter)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      logger.warn('userService: findOne failed', { error });

      return null;
    });
};

const findOneAndUpdateByUserId = async (userId: string, data: UpdateQuery<UserData>): Promise<User> => {
  const filter = { userId };
  const options = { new: true, setDefaultsOnInsert: true, upsert: true };

  return UserModel.findOneAndUpdate(filter, data, options)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      logger.warn('userService: findOneAndUpdateByUserId failed', { error });

      return null;
    });
};

const findOneOrCreateByUserId = async (userId: string): Promise<User> => {
  let user = await findOne({ userId });
  if (!user) {
    user = await create({ userId });
  }

  return user;
};

export default { bulkWrite, create, find, findAll, findOne, findOneAndUpdateByUserId, findOneOrCreateByUserId };
