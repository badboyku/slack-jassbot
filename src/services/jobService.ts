import { channelService, slackService, userService } from '@services';
import { crypto, dateTime, logger } from '@utils';
import type { AnyBulkWriteOperation } from 'mongodb';
import type { ChannelData, GetChannelMembersResult, UpdateChannelsResult, UserData } from '@types';

/* istanbul ignore next TODO: add unit tests */
const findTomorrowsBirthdays = async () => {
  const tomorrowsBirthday = dateTime.getDateTime().plus({ days: 1 }).toFormat('LL-dd');
  const birthdayUserIds: string[] = [];
  const birthdayChannels: { [channelId: string]: string[] } = {};

  const users = await userService.findAll({ birthdayLookup: crypto.createHmac(tomorrowsBirthday) });
  users.forEach((user) => {
    const { userId = '' } = user as UserData;

    if (userId.length) {
      birthdayUserIds.push(userId);
    }
  });

  const channels = await channelService.findAll({ isMember: true, members: { $in: birthdayUserIds } });
  channels.forEach((channel) => {
    const { channelId = '', members = [] } = channel as ChannelData;

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
  });

  // TODO: For each channel, write bday message scheduled at midnight PST
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

  const ops: AnyBulkWriteOperation<ChannelData>[] = [];
  channels.forEach((channel) => {
    const {
      id: channelId = '',
      is_member: isMember = false,
      is_private: isPrivate = false,
      name = '',
      num_members: numMembers = 0,
    } = channel;

    if (channelId.length) {
      const filter = { channelId };
      const update = { $set: { isMember, isPrivate, members: channelsMembers[channelId as string], name, numMembers } };
      ops.push({ updateOne: { filter, update, upsert: true } });
    }
  });

  const results = await channelService.bulkWrite(ops);

  return { results };
};

export default { findTomorrowsBirthdays, updateChannels };
