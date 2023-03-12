import { ChannelModel } from '../db/models';
import logger from '../utils/logger';
import type { AnyBulkWriteOperation, BulkWriteResult } from 'mongodb';
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
  logger.debug('channelService: bulkWrite called', { numOps: ops.length });

  if (!ops.length) {
    return undefined;
  }

  let result: BulkWriteResult | undefined;
  try {
    result = await ChannelModel.bulkWrite(ops);
  } catch (error) {
    logger.warn('channelService: bulkWrite failed', { error });
  }

  let results: BulkWriteResults | undefined;
  if (result) {
    const { ok, nInserted, nUpserted, nMatched, nModified, nRemoved } = result;
    results = { ok, nInserted, nUpserted, nMatched, nModified, nRemoved };
    logger.debug('channelService: bulkWrite success', { results });
  }

  return results;
};

const create = async (data: ChannelData): Promise<Channel> => {
  logger.debug('channelService: create called', { data });

  const channel = new ChannelModel(data);
  try {
    await channel.save();
    logger.debug('channelService: create success', { channel });
  } catch (error) {
    logger.error('channelService: create failed', { error });
  }

  return channel;
};

const findOne = async (filter: FilterQuery<ChannelData>): Promise<Channel> => {
  logger.debug('channelService: findOne called', { filter });

  let channel: Channel = null;
  try {
    channel = await ChannelModel.findOne(filter);
  } catch (error) {
    logger.warn('channelService: findOne failed', { error });
  }

  if (channel) {
    logger.debug('channelService: findOne success', { channel });
  }

  return channel;
};

const findOneAndUpdateByChannelId = async (channelId: string, data: UpdateQuery<ChannelData>): Promise<Channel> => {
  logger.debug('channelService: findOneAndUpdateByChannelId called', { channelId, data });
  const filter = { channelId };
  const options = { new: true, setDefaultsOnInsert: true, upsert: true };

  let channel: Channel = null;
  try {
    channel = await ChannelModel.findOneAndUpdate(filter, data, options);
  } catch (error) {
    logger.warn('channelService: findOneAndUpdateByChannelId failed', { error });
  }

  if (channel) {
    logger.debug('channelService: findOneAndUpdateByChannelId success', { channel });
  }

  return channel;
};

const findOneOrCreateByChannelId = async (channelId: string): Promise<Channel> => {
  logger.debug('channelService: findOneOrCreateByChannelId called', { channelId });

  let channel = await findOne({ channelId });
  if (!channel) {
    channel = await create({ channelId });
  }

  return channel;
};

export default { bulkWrite, create, findOne, findOneAndUpdateByChannelId, findOneOrCreateByChannelId };
