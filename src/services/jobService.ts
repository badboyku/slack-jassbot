import { channelService, slackService, userService } from '@services';
import { crypto, dateTime, logger } from '@utils';
import type { AnyBulkWriteOperation } from 'mongodb';
import type { ChannelDocType, GetChannelMembersResult, UpdateChannelsResult } from '@types';

/* istanbul ignore next TODO: add unit tests */
const findTomorrowsBirthdays = async () => {
  const tomorrowsBirthday = dateTime.getDateTime().plus({ days: 1 }).toFormat('LL-dd');
  const birthdayUserIds: string[] = [];
  const birthdayChannels: { [channelId: string]: string[] } = {};

  const users = await userService.findAll({ birthdayLookup: crypto.createHmac(tomorrowsBirthday) });
  users.forEach((user) => {
    const { userId = '' } = user || {};

    if (userId.length) {
      birthdayUserIds.push(userId);
    }
  });

  const channels = await channelService.findAll({ isMember: true, members: { $in: birthdayUserIds } });
  channels.forEach((channel) => {
    const { channelId = '', members = [] } = channel || {};

    if (channelId.length) {
      const userIds: string[] = [];
      members.forEach((member) => {
        if (birthdayUserIds.includes(member)) {
          userIds.push(member);
        }
      });

      if (userIds.length > 0) {
        birthdayChannels[channelId] = userIds;
      }
    }
  });

  logger.debug('findTomorrowsBirthdays', {
    tomorrowsBirthday,
    numUsers: users.length,
    numChannels: channels.length,
    birthdayChannels,
  });
};

const updateChannels = async (): Promise<UpdateChannelsResult> => {
  const args = { exclude_archived: false, types: 'public_channel,private_channel' };
  const { channels } = await slackService.getChannels(args);

  const channelsMembers: { [channelId: string]: string[] } = {};
  const channelMembersPromises: Promise<GetChannelMembersResult>[] = [];
  channels.forEach((channel) => {
    const { id: channelId = '', num_members: numMembers = 0 } = channel;

    if (channelId.length) {
      channelsMembers[channelId] = [];

      if (numMembers > 0) {
        channelMembersPromises.push(slackService.getChannelMembers(channelId));
      }
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

    if (channelId.length) {
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
