import { channelService, slackService, userService } from '@services';
import { crypto, dateTime, logger } from '@utils';
import type { AnyBulkWriteOperation } from 'mongodb';
import type { ChannelDocType, GetChannelMembersResult, UpdateChannelsResult } from '@types';

/* istanbul ignore next TODO: add unit tests */
const findTomorrowsBirthdays = async () => {
  // const options = { batchSize: 5000, limit: 10000 };

  // Get all users
  const birthdayLookup = dateTime.getDateTime().plus({ days: 1 }).toFormat('LL-dd');
  const birthdayFilter = { birthdayLookup: crypto.createHmac(birthdayLookup) };
  const users = await userService.findAll(birthdayFilter);
  logger.info('users', { numUsers: users.length });

  // Get all users userIds
  const members: string[] = [];
  users.forEach((user) => {
    const { userId = '' } = user || {};

    if (userId.length) {
      members.push(userId);
    }
  });
  logger.info('members', { numMembers: members.length });

  // Get all channels for userIds
  const channelFilter = { members: { $in: members } };
  const channels = await channelService.findAll(channelFilter);
  logger.info('channels', { numChannels: channels.length });
};

const updateChannels = async (): Promise<UpdateChannelsResult> => {
  const { channels } = await slackService.getChannels({ types: 'public_channel,private_channel' });

  const channelsMembers: { [channelId: string]: string[] } = {};
  const channelMembersPromises: Promise<GetChannelMembersResult>[] = [];
  channels.forEach((channel) => {
    const { id: channelId = '', num_members: numMembers = 0 } = channel;
    channelsMembers[channelId] = [];

    if (channelId.length && numMembers > 0) {
      channelMembersPromises.push(slackService.getChannelMembers(channelId));
    }
  });

  const processChannelMembersResult = (result: PromiseSettledResult<GetChannelMembersResult>) => {
    let channelId = '';
    let members: string[] = [];

    const { status } = result;
    if (status === 'fulfilled') {
      const { value } = result;
      const { channelId: channelIdValue, members: membersValue } = value;

      channelId = channelIdValue;
      members = membersValue;
    }

    return { channelId, members };
  };

  const channelMembersResult = await Promise.allSettled(channelMembersPromises);
  channelMembersResult.forEach((result) => {
    const { channelId, members } = processChannelMembersResult(result);

    if (channelId) {
      channelsMembers[channelId] = members;
    }
  });

  const ops: AnyBulkWriteOperation<ChannelDocType>[] = [];
  channels.forEach((channel) => {
    const { id: channelId, name, is_member: isMember, is_private: isPrivate, num_members: numMembers } = channel;
    const filter = { channelId };
    const update = { $set: { name, isMember, isPrivate, numMembers, members: channelsMembers[channelId as string] } };
    ops.push({ updateOne: { filter, update, upsert: true } });
  });

  const results = await channelService.bulkWrite(ops);

  return { results };
};

export default { findTomorrowsBirthdays, updateChannels };
