import { slackClient } from '@clients';
import { slackService } from '@services';
import { SLACK_GET_LIMIT_DEFAULT } from '@utils/constants';
import type {
  GetChannelMembersResult,
  GetChannelsResult,
  SlackClientGetConversationListResult,
  SlackClientGetConversationsMembersResult,
} from '@types';

jest.mock('@clients/slackClient');

describe('services slack', () => {
  const channelId = 'channelId';
  const channel1 = { id: 'foo' };
  const channel2 = { id: 'bar' };
  const member1 = 'member1';
  const member2 = 'member2';
  const cursor = '';
  const limit = SLACK_GET_LIMIT_DEFAULT;
  const error = 'error';

  describe('calling function getChannelMembers', () => {
    let result: GetChannelMembersResult;

    describe('successfully', () => {
      const response = { members: [member1] };

      beforeEach(async () => {
        jest
          .spyOn(slackClient, 'getConversationsMembers')
          .mockResolvedValueOnce({ response } as unknown as SlackClientGetConversationsMembersResult);

        result = await slackService.getChannelMembers(channelId);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls slackClient.getConversationsMembers', () => {
        expect(slackClient.getConversationsMembers).toHaveBeenCalledWith({ channel: channelId, cursor, limit });
      });

      it('returns result', () => {
        expect(result).toEqual({ channelId, members: [member1], error: undefined });
      });
    });

    describe('with next_cursor in responseMetadata', () => {
      const response1 = { members: [member1], response_metadata: { next_cursor: member1 } };
      const response2 = { members: [member2] };

      beforeEach(async () => {
        jest
          .spyOn(slackClient, 'getConversationsMembers')
          .mockResolvedValueOnce({ response: response1 } as unknown as SlackClientGetConversationsMembersResult)
          .mockResolvedValueOnce({ response: response2 } as unknown as SlackClientGetConversationsMembersResult);

        result = await slackService.getChannelMembers(channelId);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls slackClient.getConversationsMembers for first call with no cursor option', () => {
        expect(slackClient.getConversationsMembers).toHaveBeenNthCalledWith(1, { channel: channelId, cursor, limit });
      });

      it('calls slackClient.getConversationsMembers for second call with cursor option', () => {
        expect(slackClient.getConversationsMembers).toHaveBeenNthCalledWith(2, {
          channel: channelId,
          cursor: member1,
          limit,
        });
      });

      it('returns result with multiple members', () => {
        expect(result).toEqual({ channelId, members: [member1, member2], error: undefined });
      });
    });

    describe('with error', () => {
      beforeEach(async () => {
        jest
          .spyOn(slackClient, 'getConversationsMembers')
          .mockResolvedValueOnce({ error } as unknown as SlackClientGetConversationsMembersResult);

        result = await slackService.getChannelMembers(channelId);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('returns result with error', () => {
        expect(result).toEqual({ channelId, members: [], error });
      });
    });
  });

  describe('calling function getChannels', () => {
    let result: GetChannelsResult;

    describe('successfully', () => {
      const response = { channels: [channel1] };

      beforeEach(async () => {
        jest
          .spyOn(slackClient, 'getConversationsList')
          .mockResolvedValueOnce({ response } as unknown as SlackClientGetConversationListResult);

        result = await slackService.getChannels();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls slackClient.getConversationsList', () => {
        expect(slackClient.getConversationsList).toHaveBeenCalledWith({ cursor, limit });
      });

      it('returns result', () => {
        expect(result).toEqual({ channels: [channel1], error: undefined });
      });
    });

    describe('with args in params', () => {
      const args = { types: 'foo' };

      beforeEach(async () => {
        jest
          .spyOn(slackClient, 'getConversationsList')
          .mockResolvedValueOnce({} as unknown as SlackClientGetConversationListResult);

        result = await slackService.getChannels(args);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls slackClient.getConversationsList with args', () => {
        expect(slackClient.getConversationsList).toHaveBeenCalledWith({ ...args, cursor, limit });
      });
    });

    describe('with next_cursor in responseMetadata', () => {
      const response1 = { channels: [channel1], response_metadata: { next_cursor: channel1.id } };
      const response2 = { channels: [channel2] };

      beforeEach(async () => {
        jest
          .spyOn(slackClient, 'getConversationsList')
          .mockResolvedValueOnce({ response: response1 } as unknown as SlackClientGetConversationListResult)
          .mockResolvedValueOnce({ response: response2 } as unknown as SlackClientGetConversationListResult);

        result = await slackService.getChannels();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls slackClient.getConversationsList for first call with no cursor option', () => {
        expect(slackClient.getConversationsList).toHaveBeenNthCalledWith(1, { cursor, limit });
      });

      it('calls slackClient.getConversationsList for second call with cursor option', () => {
        expect(slackClient.getConversationsList).toHaveBeenNthCalledWith(2, { cursor: channel1.id, limit });
      });

      it('returns result with multiple members', () => {
        expect(result).toEqual({ channels: [channel1, channel2], error: undefined });
      });
    });

    describe('with error', () => {
      beforeEach(async () => {
        jest
          .spyOn(slackClient, 'getConversationsList')
          .mockResolvedValueOnce({ error } as unknown as SlackClientGetConversationListResult);

        result = await slackService.getChannels();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('returns result with error', () => {
        expect(result).toEqual({ channels: [], error });
      });
    });
  });
});
