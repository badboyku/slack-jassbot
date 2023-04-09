import { channelService, slackService, userService } from '@services';
import { crypto, dateTime, logger } from '@utils';
import type { AnyBulkWriteOperation } from 'mongodb';
import type { ChannelDocType, GetChannelMembersResult, UpdateChannelsResult } from '@types';

const findTomorrowsBirthdays = async () => {
  logger.debug('jobService: findTomorrowsBirthdays called');

  const tomorrow = dateTime.getDateTime().plus({ days: 1 });
  const birthdayLookup = tomorrow.toFormat('LL-dd');

  const filter = { birthdayLookup: crypto.createHmac(birthdayLookup) };
  const options = { batchSize: 1000, limit: 1000 };
  const users = await userService.findAll(filter, options);
  logger.debug('users', { numUsers: users.length, user1: users[0], user2: users[1] });
};

const updateChannels = async (): Promise<UpdateChannelsResult> => {
  const { channels } = await slackService.getChannels({ types: 'public_channel,private_channel' });

  const channelsMembers: { [channelId: string]: string[] } = {};
  const channelMembersPromises: Promise<GetChannelMembersResult>[] = [];
  channels.forEach((channel) => {
    const { id: channelId = '', num_members: numMembers = 0 } = channel;
    channelsMembers[channelId] = [];

    if (numMembers > 0) {
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
    const { id: channelId, is_member: isMember, is_private: isPrivate, num_members: numMembers } = channel;
    const filter = { channelId };
    const update = { $set: { isMember, isPrivate, numMembers, members: channelsMembers[channelId as string] } };
    ops.push({ updateOne: { filter, update, upsert: true } });
  });

  const results = await channelService.bulkWrite(ops);

  return { results };
};

export default { findTomorrowsBirthdays, updateChannels };
