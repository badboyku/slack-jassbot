import { ObjectId } from 'mongodb';
import { ChannelModel } from '@db/models';
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
import type { BulkWriteResults, Channel, ChannelData, FindOptions } from '@types';

const bulkWrite = (ops: AnyBulkWriteOperation<ChannelData>[]): Promise<BulkWriteResults> | undefined => {
  logger.debug('channelService: bulkWrite called', { numOps: ops.length });

  return ops.length > 0
    ? ChannelModel.bulkWrite(ops)
        .then((result) => {
          const { ok, insertedCount, upsertedCount, matchedCount, modifiedCount, deletedCount } = result;

          return { ok, insertedCount, upsertedCount, matchedCount, modifiedCount, deletedCount };
        })
        .catch((error) => {
          logger.warn('channelService: bulkWrite failed', { error });

          return undefined;
        })
    : undefined;
};

const create = async (data: ChannelData | ChannelData[]): Promise<Channel | Channel[] | null> => {
  logger.debug('channelService: create called', { data });

  return ChannelModel.create(data)
    .then((result) => result)
    .catch((error) => {
      logger.warn('channelService: create failed', { error });

      return null;
    });
};

const find = async (filter: FilterQuery<ChannelData>, options?: FindOptions): Promise<Channel[]> => {
  logger.debug('channelService: find called', { filter, options });
  const { batchSize = DB_BATCH_SIZE_DEFAULT, limit = DB_LIMIT_DEFAULT, sort = undefined } = options || {};
  const channels: Channel[] = [];

  try {
    const cursor = ChannelModel.find(filter)
      .sort(sort)
      .limit(Math.min(limit, DB_LIMIT_MAX))
      .cursor({ batchSize: Math.min(batchSize, DB_BATCH_SIZE_MAX) });

    // eslint-disable-next-line no-await-in-loop
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      channels.push(doc);
    }
  } catch (error) {
    logger.warn('channelService: find error', { error });
  }

  return channels;
};

const findAll = async (filter: FilterQuery<ChannelData>, options?: FindOptions): Promise<Channel[]> => {
  const { limit = DB_LIMIT_DEFAULT, sort = DB_SORT_DEFAULT } = options || {};
  const findOptions = { ...options, limit, sort };
  let allChannels: Channel[] = [];
  let afterId: Types.ObjectId | undefined;
  let hasMore = false;

  do {
    const findFilter = { ...filter, ...(afterId ? { _id: { $gt: new ObjectId(afterId) } } : {}) };
    // eslint-disable-next-line no-await-in-loop
    const channels = await find(findFilter, findOptions);

    if (channels.length > 0) {
      allChannels = [...allChannels, ...channels];
    }

    afterId = channels.at(-1)?._id || undefined;
    hasMore = channels.length > 0 && channels.length === limit;
  } while (hasMore);

  return allChannels;
};

const findOne = (filter: FilterQuery<ChannelData>): Promise<Channel | null> => {
  logger.debug('channelService: findOne called', { filter });

  return ChannelModel.findOne(filter)
    .then((result) => result)
    .catch((error) => {
      logger.warn('channelService: findOne failed', { error });

      return null;
    });
};

const findOneAndUpdateByChannelId = (channelId: string, data: UpdateQuery<ChannelData>): Promise<Channel | null> => {
  logger.debug('channelService: findOneAndUpdateByChannelId called', { channelId, data });
  const filter = { channelId };
  const options = { new: true, setDefaultsOnInsert: true, upsert: true };

  return ChannelModel.findOneAndUpdate(filter, data, options)
    .then((result) => result)
    .catch((error) => {
      logger.warn('channelService: findOneAndUpdateByChannelId failed', { error });

      return null;
    });
};

const findOneOrCreateByChannelId = (channelId: string): Promise<Channel | null> => {
  return findOne({ channelId }).then(
    (result) => result || create({ channelId }).then((newResult) => newResult as Channel),
  );
};

export default { bulkWrite, create, find, findAll, findOne, findOneAndUpdateByChannelId, findOneOrCreateByChannelId };
