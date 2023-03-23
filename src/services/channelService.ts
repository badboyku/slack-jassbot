import {ChannelModel} from '../db/models';
import {
  DB_DEFAULT_BATCH_SIZE,
  DB_DEFAULT_LIMIT,
  DB_DEFAULT_OPTIONS,
  DB_DEFAULT_SORT,
  DB_MAX_BATCH_SIZE,
  DB_MAX_LIMIT,
} from '../utils/constants';
import logger from '../utils/logger';
import type {AnyBulkWriteOperation} from 'mongodb';
import type {FilterQuery, Types, UpdateQuery} from 'mongoose';
import type {BulkWriteResults, FindOptions} from '../@types/global';
import type {Channel, ChannelDocType} from '../db/models/ChannelModel';

type ChannelData = {
  channelId?: string;
  isMember?: boolean;
  isPrivate?: boolean;
  numMembers?: number;
  members?: string[];
};

const bulkWrite = (ops: AnyBulkWriteOperation<ChannelDocType>[]): Promise<BulkWriteResults> | undefined => {
  logger.debug('channelService: bulkWrite called', { numOps: ops.length });

  return ops.length > 0
    ? ChannelModel.bulkWrite(ops)
        .then((result) => {
          const { ok, nInserted, nUpserted, nMatched, nModified, nRemoved } = result;

          return { ok, nInserted, nUpserted, nMatched, nModified, nRemoved };
        })
        .catch((error) => {
          logger.warn('channelService: bulkWrite failed', { error });

          return undefined;
        })
    : undefined;
};

const create = async (data: ChannelData): Promise<Channel> => {
  logger.debug('channelService: create called', { data });
  const channel = new ChannelModel(data);

  return channel
    .save()
    .then((result) => result)
    .catch((error) => {
      logger.warn('channelService: create failed', { error });

      return null;
    });
};

const find = async (filter: FilterQuery<ChannelData>, options?: FindOptions): Promise<Channel[]> => {
  logger.debug('channelService: find called', { filter, options });
  const {
    batchSize = DB_DEFAULT_BATCH_SIZE,
    limit = DB_DEFAULT_LIMIT,
    sort = undefined,
  } = options || DB_DEFAULT_OPTIONS;
  const channels: Channel[] = [];

  try {
    const cursor = ChannelModel.find(filter)
      .sort(sort)
      .limit(Math.min(limit, DB_MAX_LIMIT))
      .cursor({ batchSize: Math.min(batchSize, DB_MAX_BATCH_SIZE) });

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
  logger.debug('channelService: findAll called', { filter, options });
  const {
    batchSize = DB_DEFAULT_BATCH_SIZE,
    limit = DB_DEFAULT_LIMIT,
    sort = DB_DEFAULT_SORT,
  } = options || DB_DEFAULT_OPTIONS;
  let allChannels: Channel[] = [];
  let afterId: Types.ObjectId | undefined;
  let hasMore = false;

  const findOptions = { batchSize, limit, sort };

  do {
    const findFilter = { ...filter, ...(afterId ? { _id: { $gt: afterId } } : {}) };
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

const findOne = (filter: FilterQuery<ChannelData>): Promise<Channel> => {
  logger.debug('channelService: findOne called', { filter });

  return ChannelModel.findOne(filter)
    .then((result) => result)
    .catch((error) => {
      logger.warn('channelService: findOne failed', { error });

      return null;
    });
};

const findOneAndUpdateByChannelId = (channelId: string, data: UpdateQuery<ChannelData>): Promise<Channel> => {
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

const findOneOrCreateByChannelId = (channelId: string): Promise<Channel> => {
  logger.debug('channelService: findOneOrCreateByChannelId called', { channelId });

  return findOne({ channelId }).then((result) => result || create({ channelId }).then((newResult) => newResult));
};

export default { bulkWrite, create, find, findAll, findOne, findOneAndUpdateByChannelId, findOneOrCreateByChannelId };
