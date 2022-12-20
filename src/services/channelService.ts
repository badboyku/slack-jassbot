import { ChannelModel } from '../db/models';
import logger from '../utils/logger';
import type { AnyBulkWriteOperation, BulkWriteResult } from 'mongodb';
import type { FilterQuery, UpdateQuery } from 'mongoose';
import type { Channel, ChannelDocType } from '../db/models/ChannelModel';

type ChannelData = {
  channelId?: string;
  inviterId?: string;
  isPrivate?: boolean;
  isMember?: boolean;
};

const bulkWriteChannels = async (
  ops: AnyBulkWriteOperation<ChannelDocType>[],
): Promise<BulkWriteResult | undefined> => {
  logger.debug('channelService: bulkWriteChannels called', { numOps: ops.length });

  if (!ops.length) {
    return undefined;
  }

  let result: BulkWriteResult | undefined;
  try {
    result = await ChannelModel.bulkWrite(ops);
  } catch (error) {
    logger.error('channelService: bulkWriteChannels failed', { error });
  }

  if (result) {
    logger.debug('channelService: bulkWriteChannels success', { result });
  }

  return result;
};

const createChannel = async (data: ChannelData): Promise<Channel> => {
  logger.debug('channelService: createChannel called', { data });

  const channel = new ChannelModel(data);
  try {
    await channel.save();

    logger.debug('channelService: createChannel success', { channel });
  } catch (error) {
    logger.error('channelService: createChannel failed', { error });
  }

  return channel;
};

const findChannel = async (filter: FilterQuery<ChannelData>): Promise<Channel> => {
  logger.debug('channelService: findChannel called', { filter });

  let channel: Channel = null;
  try {
    channel = await ChannelModel.findOne(filter).exec();
  } catch (error) {
    logger.error('channelService: findChannel failed', { error });
  }

  if (channel) {
    logger.debug('channelService: findChannel success', { channel });
  }

  return channel;
};

const findAndUpdateChannel = async (filter: FilterQuery<ChannelData>, update?: UpdateQuery<ChannelData>) => {
  logger.debug('channelService: findAndUpdateChannel called', { filter, update });

  let channel: Channel = null;
  try {
    channel = await ChannelModel.findOneAndUpdate(filter, update, { new: true, upsert: true }).exec();
  } catch (error) {
    logger.error('channelService: findAndUpdateChannel failed', { error });
  }

  if (channel) {
    logger.debug('channelService: findAndUpdateChannel success', { channel });
  }

  return channel;
};

const findOrCreateChannel = async (channelId: string, data?: ChannelData): Promise<Channel> => {
  logger.debug('channelService: findOrCreateChannel called', { channelId, data });

  let channel = await findChannel({ channelId });
  if (!channel) {
    channel = await createChannel({ ...data, channelId });
  }

  return channel;
};

export default { bulkWriteChannels, createChannel, findChannel, findAndUpdateChannel, findOrCreateChannel };
