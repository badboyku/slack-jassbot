import { UserModel } from '../db/models';
import logger from '../utils/logger';
import type { AnyBulkWriteOperation } from 'mongodb';
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
  if (!ops.length) {
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
      logger.error('userService: create failed', { error });

      return null;
    });
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

export default { bulkWrite, create, findOne, findOneAndUpdateByUserId, findOneOrCreateByUserId };
