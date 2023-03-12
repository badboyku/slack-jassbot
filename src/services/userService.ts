import { UserModel } from '../db/models';
import logger from '../utils/logger';
import type { AnyBulkWriteOperation, BulkWriteResult } from 'mongodb';
import type { FilterQuery, UpdateQuery } from 'mongoose';
import type { BulkWriteResults } from '../@types/global';
import type { User, UserDocType } from '../db/models/UserModel';

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

const bulkWrite = async (ops: AnyBulkWriteOperation<UserDocType>[]): Promise<BulkWriteResults | undefined> => {
  logger.debug('userService: bulkWrite called', { numOps: ops.length });

  if (!ops.length) {
    return undefined;
  }

  let result: BulkWriteResult | undefined;
  try {
    result = await UserModel.bulkWrite(ops);
  } catch (error) {
    logger.warn('userService: bulkWrite failed', { error });
  }

  let results: BulkWriteResults | undefined;
  if (result) {
    const { ok, nInserted, nUpserted, nMatched, nModified, nRemoved } = result;
    results = { ok, nInserted, nUpserted, nMatched, nModified, nRemoved };
    logger.debug('userService: bulkWrite success', { results });
  }

  return results;
};

const create = async (data: UserData): Promise<User> => {
  logger.debug('userService: create called', { data });

  const user = new UserModel(data);
  try {
    await user.save();
    logger.debug('userService: create success', { user });
  } catch (error) {
    logger.error('userService: create failed', { error });
  }

  return user;
};

// const find = async (filter: FilterQuery<UserData>): Promise<User[]> => {
//   logger.debug('userService: find called', { filter });
//
//   // const cursor = UserModel.find(filters).sort({ _id: 1 }).limit(300).cursor({ batchSize: 100 });
//   // for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
//   //   console.log(doc);
//   // }
//
//   const users: User[] = [];
//   // try {
//   // } catch (error) {
//   //   logger.warn('userService: findUsers failed', { error });
//   // }
//   //
//   // if (users?.length) {
//   //   logger.debug('userService: findUsers success', { usersCount: users.length });
//   // }
//
//   return users;
// };

const findOne = async (filter: FilterQuery<UserData>): Promise<User> => {
  logger.debug('userService: findOne called', { filter });

  let user: User = null;
  try {
    user = await UserModel.findOne(filter);
  } catch (error) {
    logger.warn('userService: findOne failed', { error });
  }

  if (user) {
    logger.debug('userService: findOne success', { user });
  }

  return user;
};

const findOneAndUpdateByUserId = async (userId: string, data: UpdateQuery<UserData>): Promise<User> => {
  logger.debug('userService: findOneAndUpdateByUserId called', { userId, data });
  const filter = { userId };
  const options = { new: true, setDefaultsOnInsert: true, upsert: true };

  let user: User = null;
  try {
    user = await UserModel.findOneAndUpdate(filter, data, options);
  } catch (error) {
    logger.warn('userService: findOneAndUpdateByUserId failed', { error });
  }

  if (user) {
    logger.debug('userService: findOneAndUpdateByUserId success', { user });
  }

  return user;
};

const findOneOrCreateByUserId = async (userId: string): Promise<User> => {
  logger.debug('userService: findOneOrCreateByUserId called', { userId });

  let user = await findOne({ userId });
  if (!user) {
    user = await create({ userId });
  }

  return user;
};

export default { bulkWrite, create, findOne, findOneAndUpdateByUserId, findOneOrCreateByUserId };
