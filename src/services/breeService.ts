import logger from '../utils/logger';
import channelService from './channelService';
import slackService from './slackService';
import type { AnyBulkWriteOperation, BulkWriteResult } from 'mongodb';
import type { ChannelDocType } from '../db/models/ChannelModel';

const findTomorrowsBirthdays = () => {
  logger.debug('breeService: findTomorrowsBirthdays called');
};

type UpdateMemberChannelsResult = { result?: BulkWriteResult };
const updateMemberChannels = async (): Promise<UpdateMemberChannelsResult> => {
  logger.debug('breeService: updateMemberChannels called');

  const { publicChannels, privateChannels } = await slackService.getAllChannels();

  const ops: AnyBulkWriteOperation<ChannelDocType>[] = [];
  [publicChannels, privateChannels].forEach((channels) => {
    channels.forEach((channel) => {
      const { id, is_member: isMember, is_private: isPrivate } = channel;

      const filter = { channelId: id };
      const update = { $set: { isMember, isPrivate } };
      ops.push({ updateOne: { filter, update, upsert: true } });
    });
  });

  const result = await channelService.bulkWriteChannels(ops);

  return { result };
};

export default { findTomorrowsBirthdays, updateMemberChannels };
