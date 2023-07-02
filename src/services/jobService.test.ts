import { dbJassbot } from '@db/sources';
import { jobService, slackService } from '@services';
import { mongodb } from '@utils';
import type { UpdateChannelsResult, UpdateUsersResult } from '@types';

jest.mock('@db/sources/jassbotSource');
jest.mock('@services/channelService');
jest.mock('@services/slackService');
jest.mock('@services/userService');
jest.mock('@utils/crypto');
jest.mock('@utils/dateTime');
jest.mock('@utils/logger/logger');
jest.mock('@utils/mongodb');

describe('services job', () => {
  const channelId = 'channelId';
  const member = 'member';
  const name = 'name';
  const collection = {};
  const results = 'foo';
  const nowDate = new Date('2023-06-02T00:00:00');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(nowDate);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('calling function updateChannels', () => {
    let result: UpdateChannelsResult;

    describe('successfully', () => {
      const channel = { id: channelId, name, is_archived: false, is_member: false, is_private: true, num_members: 1 };

      beforeEach(async () => {
        jest.spyOn(slackService, 'getChannels').mockResolvedValueOnce({ channels: [channel] });
        jest.spyOn(slackService, 'getChannelMembers').mockResolvedValueOnce({ channelId, memberIds: [member] });
        jest.spyOn(dbJassbot, 'getChannelCollection').mockReturnValueOnce(collection as never);
        jest.spyOn(mongodb, 'bulkWrite').mockResolvedValueOnce(results as never);

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

      it('calls dbJassbot.getChannelCollection', () => {
        expect(dbJassbot.getChannelCollection).toHaveBeenCalled();
      });

      it('calls mongodb.bulkWrite', () => {
        expect(mongodb.bulkWrite).toHaveBeenCalledWith(
          collection,
          [
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
                    updatedAt: nowDate,
                  },
                  $setOnInsert: { createdAt: nowDate },
                },
                upsert: true,
              },
            },
          ],
          { ordered: false },
        );
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
          jest.spyOn(dbJassbot, 'getChannelCollection');
          jest.spyOn(mongodb, 'bulkWrite');

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
    const channel = { id: channelId };
    let result: UpdateUsersResult;

    describe('successfully', () => {
      beforeEach(async () => {
        jest.spyOn(slackService, 'getUsers').mockResolvedValueOnce({ users: [user] });
        jest.spyOn(slackService, 'getUsersConversations').mockResolvedValueOnce({ userId, channels: [channel] });
        jest.spyOn(dbJassbot, 'getUserCollection').mockReturnValueOnce(collection as never);
        jest.spyOn(mongodb, 'bulkWrite').mockResolvedValueOnce(results as never);

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

      it('calls dbJassbot.getUserCollection', () => {
        expect(dbJassbot.getUserCollection).toHaveBeenCalled();
      });

      it('calls mongodb.bulkWrite', () => {
        expect(mongodb.bulkWrite).toHaveBeenCalledWith(
          collection,
          [
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
                    updatedAt: nowDate,
                  },
                  $setOnInsert: { createdAt: nowDate },
                },
                upsert: true,
              },
            },
          ],
          { ordered: false },
        );
      });

      it('returns result', () => {
        expect(result).toEqual({ results });
      });
    });

    describe('with user id is missing', () => {
      beforeEach(async () => {
        jest.spyOn(slackService, 'getUsers').mockResolvedValueOnce({ users: [{ name: 'name' }] });
        jest.spyOn(slackService, 'getUsersConversations');
        jest.spyOn(dbJassbot, 'getUserCollection');
        jest.spyOn(mongodb, 'bulkWrite');

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
