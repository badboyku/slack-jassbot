import { channelService, jobService, slackService, userService } from '@services';
import type { UpdateChannelsResult, UpdateUsersResult } from '@types';

describe('services job', () => {
  describe('calling function updateChannels', () => {
    const channelId = 'channelId';
    const member = 'member';
    const name = 'name';
    const results = { ok: 1, insertedCount: 1, upsertedCount: 0, matchedCount: 1, modifiedCount: 0, deletedCount: 0 };
    let result: UpdateChannelsResult;

    describe('successfully', () => {
      const channel = { id: channelId, name, is_archived: false, is_member: false, is_private: true, num_members: 1 };

      beforeEach(async () => {
        jest.spyOn(slackService, 'getChannels').mockResolvedValueOnce({ channels: [channel] });
        jest.spyOn(slackService, 'getChannelMembers').mockResolvedValueOnce({ channelId, memberIds: [member] });
        jest.spyOn(channelService, 'bulkWrite').mockResolvedValueOnce(results);

        result = await jobService.updateChannels();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls slackService.getChannels', () => {
        expect(slackService.getChannels).toHaveBeenCalledWith({
          exclude_archived: false,
          types: 'public_channel,private_channel',
        });
      });

      it('calls slackService.getChannelMembers', () => {
        expect(slackService.getChannelMembers).toHaveBeenCalledWith(channelId);
      });

      it('calls channelService.bulkWrite', () => {
        expect(channelService.bulkWrite).toHaveBeenCalledWith([
          {
            updateOne: {
              filter: { channelId },
              update: {
                $set: {
                  name: channel.name,
                  isArchived: channel.is_archived,
                  isMember: channel.is_member,
                  isPrivate: channel.is_private,
                  numMembers: channel.num_members,
                  memberIds: [member],
                },
              },
              upsert: true,
            },
          },
        ]);
      });

      it('returns result', () => {
        expect(result).toEqual({ results });
      });
    });

    const testCases = [
      { test: 'channel id is missing', channel: { num_members: 1 } },
      { test: 'channel num_members is missing', channel: { id: channelId } },
      { test: 'channel num_members=0', channel: { id: channelId, num_members: 0 } },
    ];
    testCases.forEach(({ test, channel }) => {
      describe(`with ${test}`, () => {
        beforeEach(async () => {
          jest.spyOn(slackService, 'getChannels').mockResolvedValueOnce({ channels: [channel] });
          jest.spyOn(slackService, 'getChannelMembers');
          jest.spyOn(channelService, 'bulkWrite').mockResolvedValueOnce(results);

          result = await jobService.updateChannels();
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('does not call call slackService.getChannelMembers', () => {
          expect(slackService.getChannelMembers).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('calling function updateUsers', () => {
    const userId = 'userId';
    const user = {
      id: userId,
      team_id: 'teamId',
      name: 'name',
      deleted: false,
      real_name: 'realName',
      tz: 'tz',
      profile: { display_name: 'displayName', email: 'email', first_name: 'firstName', last_name: 'lastName' },
      is_admin: false,
      is_owner: false,
      is_primary_owner: false,
      is_restricted: false,
      is_ultra_restricted: false,
      is_bot: false,
      is_app_user: false,
      is_email_confirmed: false,
    };
    const channelId = 'channelId';
    const channel = { id: channelId };
    const results = { ok: 1, insertedCount: 1, upsertedCount: 0, matchedCount: 1, modifiedCount: 0, deletedCount: 0 };
    let result: UpdateUsersResult;

    describe('successfully', () => {
      beforeEach(async () => {
        jest.spyOn(slackService, 'getUsers').mockResolvedValueOnce({ users: [user] });
        jest.spyOn(slackService, 'getUsersConversations').mockResolvedValueOnce({ userId, channels: [channel] });
        jest.spyOn(userService, 'bulkWrite').mockResolvedValueOnce(results);

        result = await jobService.updateUsers();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls slackService.getUsers', () => {
        expect(slackService.getUsers).toHaveBeenCalledWith({ include_locale: true });
      });

      it('calls slackService.getUsersConversations', () => {
        expect(slackService.getUsersConversations).toHaveBeenCalledWith({
          exclude_archived: true,
          types: 'public_channel,private_channel',
          user: userId,
        });
      });

      it('calls userService.bulkWrite', () => {
        expect(userService.bulkWrite).toHaveBeenCalledWith([
          {
            updateOne: {
              filter: { userId },
              update: {
                $set: {
                  teamId: user.team_id,
                  name: user.name,
                  realName: user.real_name,
                  displayName: user.profile.display_name,
                  firstName: user.profile.first_name,
                  lastName: user.profile.last_name,
                  email: user.profile.email,
                  tz: user.tz,
                  isAdmin: user.is_admin,
                  isAppUser: user.is_app_user,
                  isBot: user.is_bot,
                  isDeleted: user.deleted,
                  isEmailConfirmed: user.is_email_confirmed,
                  isOwner: user.is_owner,
                  isPrimaryOwner: user.is_primary_owner,
                  isRestricted: user.is_restricted,
                  isUltraRestricted: user.is_ultra_restricted,
                  channelIds: [channelId],
                },
              },
              upsert: true,
            },
          },
        ]);
      });

      it('returns result', () => {
        expect(result).toEqual({ results });
      });
    });

    describe('with user id is missing', () => {
      beforeEach(async () => {
        jest.spyOn(slackService, 'getUsers').mockResolvedValueOnce({ users: [{ name: 'name' }] });
        jest.spyOn(slackService, 'getUsersConversations');
        jest.spyOn(userService, 'bulkWrite').mockResolvedValueOnce(results);

        result = await jobService.updateUsers();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('does not call call slackService.getUsersConversations', () => {
        expect(slackService.getUsersConversations).not.toHaveBeenCalled();
      });
    });
  });
});
