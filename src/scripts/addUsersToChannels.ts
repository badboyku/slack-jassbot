/* istanbul ignore file */
import { faker } from '@faker-js/faker';
import { dbJassbot } from '../db/sources';
import { logger, mongodb } from '../utils';
import scriptsHelper from './scriptsHelper';
import type { AnyBulkWriteOperation, Collection, WriteError } from 'mongodb';
import type { BulkWrite, Channel, User } from '@types';

const getLogContext = (bulkWrite: BulkWrite) => {
  const { result, error } = bulkWrite;

  if (error) {
    const { code, writeErrors, result: errResult } = error;
    const errors: WriteError[] = writeErrors as WriteError[];
    const { insertedCount, matchedCount, modifiedCount, deletedCount, upsertedCount } = errResult;

    return {
      result: { insertedCount, matchedCount, modifiedCount, deletedCount, upsertedCount },
      error: { code, numWriteErrors: errors.length },
    };
  }

  if (result) {
    const { insertedCount, matchedCount, modifiedCount, deletedCount, upsertedCount } = result;

    return { result: { insertedCount, matchedCount, modifiedCount, deletedCount, upsertedCount } };
  }

  return undefined;
};

const getRandomChannels = async (channelColl: Collection, key: string): Promise<Channel[]> => {
  const channels: Channel[] = [];

  const cursor = channelColl.aggregate([
    { $match: { channelId: { $regex: `^${key}` }, deletedAt: null } },
    { $sample: { size: faker.number.int({ min: 0, max: 100 }) } },
  ]);
  for await (const doc of cursor) {
    channels.push(doc as Channel);
  }

  return channels;
};

(async () => {
  const numUsersArg = Number(process.argv[2]) || undefined;
  const numUsers = Math.min(numUsersArg ?? 100, 1000);
  logger.info('scripts: addUsersToChannels called', { numUsers });

  const { key, error: keyError } = scriptsHelper.getFakedataKey();
  if (keyError) {
    logger.info('scripts: addUsersToChannels exiting', { error: keyError });

    process.exit(1);
  }

  const { isConnected } = await dbJassbot.connect();
  if (!isConnected) {
    logger.info('scripts: addUsersToChannels exiting', { error: 'Database failed to connect' });

    process.exit(1);
  }

  const channelColl = dbJassbot.getChannelCollection();
  const userColl = dbJassbot.getUserCollection();

  const channels: { [channelId: string]: { memberIds: string[] } } = {};
  const userOps: AnyBulkWriteOperation[] = [];

  const userAggCursor = userColl.aggregate([
    { $match: { deletedAt: null, userId: { $regex: `^${key}` } } },
    { $sample: { size: numUsers } },
  ]);
  for await (const doc of userAggCursor) {
    const { userId, channelIds = [] } = doc as User;
    const nowDate = new Date();
    const randChannels = await getRandomChannels(channelColl, key);

    for (let i = 0; i < randChannels.length; i += 1) {
      const { channelId, memberIds: randChannelMemberIds = [] } = randChannels[i];
      if (!channelIds.includes(channelId)) {
        channelIds.push(channelId);
      }

      if (channels[channelId]) {
        const { memberIds } = channels[channelId];
        if (!memberIds.includes(userId)) {
          memberIds.push(userId);
        }
        channels[channelId] = { memberIds };
      } else {
        if (!randChannelMemberIds.includes(userId)) {
          randChannelMemberIds.push(userId);
        }
        channels[channelId] = { memberIds: randChannelMemberIds };
      }
    }

    userOps.push({
      updateOne: {
        filter: { userId },
        update: { $set: { channelIds, updatedAt: nowDate }, $setOnInsert: { createdAt: nowDate } },
        upsert: true,
      },
    });
  }

  const channelOps: AnyBulkWriteOperation[] = [];
  const randChannelIds = Object.keys(channels);
  randChannelIds.forEach((channelId) => {
    const nowDate = new Date();
    const { memberIds } = channels[channelId];

    channelOps.push({
      updateOne: {
        filter: { channelId },
        update: {
          $set: { memberIds, numMembers: memberIds.length, updatedAt: nowDate },
          $setOnInsert: { createdAt: nowDate },
        },
        upsert: true,
      },
    });
  });

  const options = { ordered: false };
  const userBulkWrite = await mongodb.bulkWrite(userColl, userOps, options);
  logger.info('scripts: addUsersToChannels userBulkWrite completed', getLogContext(userBulkWrite));

  const channelBulkWrite = await mongodb.bulkWrite(channelColl, channelOps, options);
  logger.info('scripts: addUsersToChannels channelBulkWrite completed', getLogContext(channelBulkWrite));

  await dbJassbot.close();

  process.exit(0);
})();
