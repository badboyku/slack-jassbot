import logger from '../utils/logger';
import channelService from './channelService';
import slackService from './slackService';
import type { AnyBulkWriteOperation, BulkWriteResult } from 'mongodb';
import type { ChannelDocType } from '../db/models/ChannelModel';
import type { SlackClientError } from '../errors';

const findTomorrowsBirthdays = () => {
  logger.debug('breeService: findTomorrowsBirthdays called');
};

type UpdateChannelsResult = { result?: BulkWriteResult; errors?: SlackClientError[] };
const updateChannels = async (): Promise<UpdateChannelsResult> => {
  logger.debug('breeService: updateChannels called');
  const ops: AnyBulkWriteOperation<ChannelDocType>[] = [];

  const { channels, channelsMembers, errors } = await slackService.getAllChannelsMembers();

  channels.forEach((channel) => {
    const { id, is_member: isMember, is_private: isPrivate, num_members: numMembers } = channel;
    const filter = { channelId: id };
    const update = { $set: { isMember, isPrivate, numMembers, members: channelsMembers[id as string] } };
    ops.push({ updateOne: { filter, update, upsert: true } });
  });

  const result = await channelService.bulkWriteChannels(ops);

  return { result, errors };
};

export default { findTomorrowsBirthdays, updateChannels };
