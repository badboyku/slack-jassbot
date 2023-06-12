import { channelService, slackService, userService } from '@services';
import { crypto, dateTime, logger } from '@utils';
import type { AnyBulkWriteOperation } from 'mongodb';
import type { ChannelData, UpdateChannelsResult, UpdateUsersResult, User, UserData } from '@types';

/* istanbul ignore next TODO: add unit tests */
const findTomorrowsBirthdays = async () => {
  const tomorrowsBirthday = dateTime.getDateTime().plus({ days: 1 }).toFormat('LL-dd');
  const users = await userService.findAll({ birthdayLookup: crypto.createHmac(tomorrowsBirthday), isDeleted: false });

  const bdayUserIds: string[] = [];
  const userLookup: { [userId: string]: User } = {};
  users.forEach((user) => {
    const { userId } = user;
    bdayUserIds.push(userId);
    userLookup[userId] = user;
  });

  const channels = await channelService.findAll({ isArchived: false, isMember: true, members: { $in: bdayUserIds } });

  const bdayChannels: { [channelId: string]: User[] } = {};
  channels.forEach((channel) => {
    const { channelId, memberIds = [] } = channel;

    const bdayUsers: User[] = [];
    memberIds.forEach((memberId) => {
      if (bdayUserIds.includes(memberId)) {
        bdayUsers.push(userLookup[memberId]);
      }
    });

    if (bdayUsers.length > 0) {
      bdayChannels[channelId] = bdayUsers;
    }
  });

  logger.debug('findTomorrowsBirthdays', {
    tomorrowsBirthday,
    numUsers: users.length,
    numChannels: channels.length,
    numBdayChannels: Object.keys(bdayChannels).length,
  });

  // TODO: For each channel, write bday message scheduled at midnight PST
};

const updateChannels = async (): Promise<UpdateChannelsResult> => {
  const args = { exclude_archived: false, types: 'public_channel,private_channel' };
  const { channels } = await slackService.getChannels(args);

  const channelsMemberIds: { [channelId: string]: string[] } = {};
  for (const channel of channels) {
    const { id: channelId, num_members: numMembers = 0 } = channel;

    if (channelId?.length) {
      channelsMemberIds[channelId] = [];

      if (numMembers > 0) {
        // eslint-disable-next-line no-await-in-loop
        const { memberIds } = await slackService.getChannelMembers(channelId);
        channelsMemberIds[channelId] = memberIds;
      }
    }
  }

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
  for (const user of users) {
    const { id: userId, deleted: isDeleted } = user;

    if (userId?.length) {
      usersChannelIds[userId] = [];

      if (!isDeleted) {
        const args = { exclude_archived: true, types: 'public_channel,private_channel', user: userId };
        // eslint-disable-next-line no-await-in-loop
        const { channels } = await slackService.getUsersConversations(args);

        const channelIds: string[] = [];
        channels.forEach((channel) => {
          const { id } = channel;
          if (id?.length) {
            channelIds.push(id);
          }
        });

        usersChannelIds[userId] = channelIds;
      }
    }
  }

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
