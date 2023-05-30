import { channelService, jobService, slackService } from '@services';
import type { UpdateChannelsResult } from '@types';

describe('services job', () => {
  describe('calling function updateChannels', () => {
    const channelId = 'channelId';
    const member = 'member';
    const name = 'name';
    const results = { ok: 1, insertedCount: 1, upsertedCount: 0, matchedCount: 1, modifiedCount: 0, deletedCount: 0 };
    let result: UpdateChannelsResult;

    describe('successfully', () => {
      const channel = { id: channelId, is_member: false, is_private: true, name, num_members: 1 };

      beforeEach(async () => {
        jest.spyOn(slackService, 'getChannels').mockResolvedValueOnce({ channels: [channel] });
        jest.spyOn(slackService, 'getChannelMembers').mockResolvedValueOnce({ channelId, members: [member] });
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
                  isMember: channel.is_member,
                  isPrivate: channel.is_private,
                  members: [member],
                  name: channel.name,
                  numMembers: channel.num_members,
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
});
