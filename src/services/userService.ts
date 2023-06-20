import { ObjectId } from 'mongodb';
import { UserModel, UserNewModel } from '@db/models';
import { dbNewJassbot } from '@db/sources';
import { logger, mongodb } from '@utils';
import {
  DB_BATCH_SIZE_DEFAULT,
  DB_BATCH_SIZE_MAX,
  DB_LIMIT_DEFAULT,
  DB_LIMIT_MAX,
  DB_SORT_DEFAULT_OLD,
} from '@utils/constants';
import type {
  AnyBulkWriteOperation,
  BulkWriteOptions,
  DeleteOptions,
  Filter,
  FindOneAndUpdateOptions,
  FindOptions,
  InsertOneOptions,
} from 'mongodb';
import type { FilterQuery, Types } from 'mongoose';
import type {
  BulkWrite,
  DeleteMany,
  FindOptionsOld,
  FindParams,
  UserData,
  UserDataOld,
  UserModel as UserModelType,
  UserOld,
  UserWithId,
} from '@types';

const bulkWrite = (operations: AnyBulkWriteOperation[], options?: BulkWriteOptions): Promise<BulkWrite> | BulkWrite => {
  return mongodb.bulkWrite(dbNewJassbot.getUserCollection(), operations, options);
};

const createUser = (data: UserData, options?: InsertOneOptions): Promise<UserModelType | undefined> => {
  const defaultsDoc = { ...UserNewModel.defaults, ...data };
  const { userId, ...rest } = defaultsDoc;
  const doc = { userId, ...rest };

  return mongodb
    .insertOne(dbNewJassbot.getUserCollection(), doc, options, UserNewModel.timestamps)
    .then(({ doc: user, error }) => (!error && user ? UserNewModel.getModel(user as UserWithId) : undefined));
};

const deleteMany = (filter?: Filter<UserData>, options?: DeleteOptions): Promise<DeleteMany> => {
  return mongodb.deleteMany(dbNewJassbot.getUserCollection(), filter, options);
};

const findOld = async (filter: FilterQuery<UserDataOld>, options?: FindOptionsOld): Promise<UserOld[]> => {
  logger.debug('userService: find called', { filter, options });
  const { batchSize = DB_BATCH_SIZE_DEFAULT, limit = DB_LIMIT_DEFAULT, sort = undefined } = options || {};
  const users: UserOld[] = [];

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

const find = async (filter: Filter<UserData>, options?: FindOptions, params?: FindParams) => {
  logger.debug('userService: find called', { filter, options, params });

  return mongodb
    .find(dbNewJassbot.getUserCollection(), filter, options, params, UserNewModel.getModel)
    .then((result) => result);
};

const findAll = async (filter: FilterQuery<UserDataOld>, options?: FindOptionsOld): Promise<UserOld[]> => {
  const { limit = DB_LIMIT_DEFAULT, sort = DB_SORT_DEFAULT_OLD } = options || {};
  const findOptions = { ...options, limit, sort };
  let allUsers: UserOld[] = [];
  let afterId: Types.ObjectId | undefined;
  let hasMore = false;

  do {
    const findFilter = { ...filter, ...(afterId ? { _id: { $gt: new ObjectId(afterId) } } : {}) };
    // eslint-disable-next-line no-await-in-loop
    const users = await findOld(findFilter, findOptions);

    if (users.length > 0) {
      allUsers = [...allUsers, ...users];
    }

    afterId = users.at(-1)?._id || undefined;
    hasMore = users.length > 0 && users.length === limit;
  } while (hasMore);

  return allUsers;
};

const findOneAndUpdateByUserId = (
  userId: string,
  data?: UserData,
  options?: FindOneAndUpdateOptions,
): Promise<UserModelType | undefined> => {
  const filter = { userId };
  const update = { $set: data };

  return mongodb
    .findOneAndUpdate(dbNewJassbot.getUserCollection(), filter, update, options, UserNewModel.timestamps)
    .then(({ doc: user, error }) => (!error && user ? UserNewModel.getModel(user as UserWithId) : undefined));
};

export default {
  // OLD service functions using mongoose
  findAll,

  // NEW service functions using mongodb
  bulkWrite,
  createUser,
  deleteMany,
  find,
  findOneAndUpdateByUserId,
};
