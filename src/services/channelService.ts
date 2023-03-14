import { ChannelModel } from '../db/models';
import logger from '../utils/logger';
import type { AnyBulkWriteOperation } from 'mongodb';
import type { FilterQuery, UpdateQuery } from 'mongoose';
import type { BulkWriteResults } from '../@types/global';
import type { Channel, ChannelDocType } from '../db/models/ChannelModel';

type ChannelData = {
  channelId?: string;
  isMember?: boolean;
  isPrivate?: boolean;
  numMembers?: number;
  members?: string[];
};

const bulkWrite = async (ops: AnyBulkWriteOperation<ChannelDocType>[]): Promise<BulkWriteResults | undefined> => {
  if (ops.length === 0) {
    return undefined;
  }

  return ChannelModel.bulkWrite(ops)
    .then((result) => {
      const { ok, nInserted, nUpserted, nMatched, nModified, nRemoved } = result;

      return { ok, nInserted, nUpserted, nMatched, nModified, nRemoved };
    })
    .catch((error) => {
      logger.warn('channelService: bulkWrite failed', { error });

      return undefined;
    });
};

const create = async (data: ChannelData): Promise<Channel> => {
  const channel = new ChannelModel(data);

  return channel
    .save()
    .then((result) => {
      return result;
    })
    .catch((error) => {
      logger.warn('channelService: create failed', { error });

      return null;
    });
};

const findOne = (filter: FilterQuery<ChannelData>): Promise<Channel> => {
  return ChannelModel.findOne(filter)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      logger.warn('channelService: findOne failed', { error });

      return null;
    });
};

const findOneAndUpdateByChannelId = async (channelId: string, data: UpdateQuery<ChannelData>): Promise<Channel> => {
  const filter = { channelId };
  const options = { new: true, setDefaultsOnInsert: true, upsert: true };

  return ChannelModel.findOneAndUpdate(filter, data, options)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      logger.warn('channelService: findOneAndUpdateByChannelId failed', { error });

      return null;
    });
};

const findOneOrCreateByChannelId = async (channelId: string): Promise<Channel> => {
  let channel = await findOne({ channelId });
  if (!channel) {
    channel = await create({ channelId });
  }

  return channel;
};

export default { bulkWrite, create, findOne, findOneAndUpdateByChannelId, findOneOrCreateByChannelId };
