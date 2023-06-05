import { channelService, slackService, userService } from '@services';
import { crypto, dateTime, logger } from '@utils';
import type { AnyBulkWriteOperation } from 'mongodb';
import type { Channel as SlackChannel } from '@slack/web-api/dist/response/ConversationsListResponse';
import type {
  ChannelData,
  GetChannelMemberIdsResult,
  GetUsersConversationsResult,
  UpdateChannelsResult,
  UpdateUsersResult,
  UserData,
} from '@types';

/* istanbul ignore next TODO: add unit tests */
const findTomorrowsBirthdays = async () => {
  const tomorrowsBirthday = dateTime.getDateTime().plus({ days: 1 }).toFormat('LL-dd');
  const birthdayUserIds: string[] = [];
  const birthdayChannels: { [channelId: string]: string[] } = {};

  const users = await userService.findAll({ birthdayLookup: crypto.createHmac(tomorrowsBirthday) });
  users.forEach((user) => {
    const { userId } = user;

    if (userId?.length) {
      birthdayUserIds.push(userId);
    }
  });

  const channels = await channelService.findAll({
    isArchived: false,
    isMember: true,
    members: { $in: birthdayUserIds },
  });
  channels.forEach((channel) => {
    const { channelId, memberIds = [] } = channel;

    if (channelId?.length) {
      const ids: string[] = [];
      memberIds.forEach((memberId) => {
        if (birthdayUserIds.includes(memberId)) {
          ids.push(memberId);
        }
      });

      if (ids.length > 0) {
        birthdayChannels[channelId] = ids;
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

  const channelsMemberIds: { [channelId: string]: string[] } = {};
  const channelMembersPromises: Promise<GetChannelMemberIdsResult>[] = [];
  channels.forEach((channel) => {
    const { id: channelId, num_members: numMembers = 0 } = channel;

    if (channelId?.length) {
      channelsMemberIds[channelId] = [];

      if (numMembers > 0) {
        channelMembersPromises.push(slackService.getChannelMembers(channelId));
      }
    }
  });

  const processChannelMembersResult = (result: PromiseSettledResult<GetChannelMemberIdsResult>) => {
    let channelId = '';
    let memberIds: string[] = [];

    const { status } = result;
    if (status === 'fulfilled') {
      const { value } = result;
      const { channelId: channelIdValue, memberIds: memberIdsValue } = value;

      channelId = channelIdValue;
      memberIds = memberIdsValue;
    }

    return { channelId, memberIds };
  };

  const channelMembersResult = await Promise.allSettled(channelMembersPromises);
  channelMembersResult.forEach((result) => {
    const { channelId, memberIds } = processChannelMembersResult(result);

    if (channelId?.length) {
      channelsMemberIds[channelId] = memberIds;
    }
  });

  const ops: AnyBulkWriteOperation<ChannelData>[] = [];
  channels.forEach((channel) => {
    const {
      id: channelId,
      name,
      is_archived: isArchived,
      is_member: isMember,
      is_private: isPrivate,
      num_members: numMembers,
    } = channel;

    if (channelId?.length) {
      ops.push({
        updateOne: {
          filter: { channelId },
          update: {
            $set: {
              name,
              isArchived,
              isMember,
              isPrivate,
              numMembers,
              memberIds: channelsMemberIds[channelId],
            },
          },
          upsert: true,
        },
      });
    }
  });

  return { results: await channelService.bulkWrite(ops) };
};

const updateUsers = async (): Promise<UpdateUsersResult> => {
  const { users } = await slackService.getUsers({ include_locale: true });

  const usersChannelIds: { [userId: string]: string[] } = {};
  const userChannelsPromises: Promise<GetUsersConversationsResult>[] = [];
  users.forEach((user) => {
    const { id: userId } = user;

    if (userId?.length) {
      usersChannelIds[userId] = [];

      const args = { exclude_archived: true, types: 'public_channel,private_channel', user: userId };
      userChannelsPromises.push(slackService.getUsersConversations(args));
    }
  });

  const processUserChannelsResult = (result: PromiseSettledResult<GetUsersConversationsResult>) => {
    let userId = '';
    let channels: SlackChannel[] = [];

    const { status } = result;
    if (status === 'fulfilled') {
      const { value } = result;
      const { userId: userIdValue, channels: channelsValue } = value;

      userId = userIdValue;
      channels = channelsValue;
    }

    return { userId, channels };
  };

  const userChannelsResult = await Promise.allSettled(userChannelsPromises);
  userChannelsResult.forEach((result) => {
    const { userId, channels } = processUserChannelsResult(result);
    const channelIds: string[] = [];

    if (userId?.length) {
      channels.forEach((channel) => {
        const { id } = channel;

        if (id?.length) {
          channelIds.push(id);
        }
      });

      usersChannelIds[userId] = channelIds;
    }
  });

  const ops: AnyBulkWriteOperation<UserData>[] = [];
  users.forEach((user) => {
    const {
      id: userId,
      team_id: teamId,
      name,
      deleted: isDeleted,
      real_name: realName,
      tz,
      profile = {},
      is_admin: isAdmin,
      is_owner: isOwner,
      is_primary_owner: isPrimaryOwner,
      is_restricted: isRestricted,
      is_ultra_restricted: isUltraRestricted,
      is_bot: isBot,
      is_app_user: isAppUser,
      is_email_confirmed: isEmailConfirmed,
    } = user;
    const { display_name: displayName, email, first_name: firstName, last_name: lastName } = profile;

    if (userId?.length) {
      ops.push({
        updateOne: {
          filter: { userId },
          update: {
            $set: {
              teamId,
              name,
              realName,
              displayName,
              firstName,
              lastName,
              email,
              tz,
              isAdmin,
              isAppUser,
              isBot,
              isDeleted,
              isEmailConfirmed,
              isOwner,
              isPrimaryOwner,
              isRestricted,
              isUltraRestricted,
              channelIds: usersChannelIds[userId],
            },
          },
          upsert: true,
        },
      });
    }
  });

  return { results: await userService.bulkWrite(ops) };
};

export default { findTomorrowsBirthdays, updateChannels, updateUsers };
