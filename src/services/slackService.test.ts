import { slackClient } from '@clients';
import { slackService } from '@services';
import { SLACK_GET_LIMIT_DEFAULT } from '@utils/constants';
import type { GetChannelMemberIdsResult, GetChannelsResult, GetUsersConversationsResult, GetUsersResult } from '@types';

jest.mock('@clients/slackClient');

describe('services slack', () => {
  const channelId = 'channelId';
  const channel1 = { id: 'foo' };
  const channel2 = { id: 'bar' };
  const member1 = 'member1';
  const member2 = 'member2';
  const user1 = { id: 'yin' };
  const user2 = { id: 'yang' };
  const cursor = '';
  const limit = SLACK_GET_LIMIT_DEFAULT;
  const error = 'error';

  describe('calling function getChannelMembers', () => {
    let result: GetChannelMemberIdsResult;

    describe('successfully', () => {
      const response = { members: [member1] };

      beforeEach(async () => {
        jest.spyOn(slackClient, 'getConversationsMembers').mockResolvedValueOnce({ response } as never);

        result = await slackService.getChannelMembers(channelId);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls slackClient.getConversationsMembers', () => {
        expect(slackClient.getConversationsMembers).toHaveBeenCalledWith({ channel: channelId, cursor, limit });
      });

      it('returns result', () => {
        expect(result).toEqual({ channelId, memberIds: [member1], error: undefined });
      });
    });

    describe('with next_cursor in responseMetadata', () => {
      const response1 = { members: [member1], response_metadata: { next_cursor: member1 } };
      const response2 = { members: [member2] };

      beforeEach(async () => {
        jest
          .spyOn(slackClient, 'getConversationsMembers')
          .mockResolvedValueOnce({ response: response1 } as never)
          .mockResolvedValueOnce({ response: response2 } as never);

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
        expect(result).toEqual({ channelId, memberIds: [member1, member2], error: undefined });
      });
    });

    describe('with error', () => {
      beforeEach(async () => {
        jest.spyOn(slackClient, 'getConversationsMembers').mockResolvedValueOnce({ error } as never);

        result = await slackService.getChannelMembers(channelId);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('returns result with error', () => {
        expect(result).toEqual({ channelId, memberIds: [], error });
      });
    });
  });

  describe('calling function getChannels', () => {
    let result: GetChannelsResult;

    describe('successfully', () => {
      const response = { channels: [channel1] };

      beforeEach(async () => {
        jest.spyOn(slackClient, 'getConversationsList').mockResolvedValueOnce({ response } as never);

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
        jest.spyOn(slackClient, 'getConversationsList').mockResolvedValueOnce({} as never);

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
          .mockResolvedValueOnce({ response: response1 } as never)
          .mockResolvedValueOnce({ response: response2 } as never);

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
        jest.spyOn(slackClient, 'getConversationsList').mockResolvedValueOnce({ error } as never);

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

  describe('calling function getUsers', () => {
    let result: GetUsersResult;

    describe('successfully', () => {
      const response = { members: [user1] };

      beforeEach(async () => {
        jest.spyOn(slackClient, 'getUsersList').mockResolvedValueOnce({ response } as never);

        result = await slackService.getUsers();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls slackClient.getUsersList', () => {
        expect(slackClient.getUsersList).toHaveBeenCalledWith({ cursor, limit });
      });

      it('returns result', () => {
        expect(result).toEqual({ users: [user1], error: undefined });
      });
    });

    describe('with args in params', () => {
      const args = { types: 'foo' };

      beforeEach(async () => {
        jest.spyOn(slackClient, 'getUsersList').mockResolvedValueOnce({} as never);

        result = await slackService.getUsers(args);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls slackClient.getUsersList with args', () => {
        expect(slackClient.getUsersList).toHaveBeenCalledWith({ ...args, cursor, limit });
      });
    });

    describe('with next_cursor in responseMetadata', () => {
      const response1 = { members: [user1], response_metadata: { next_cursor: user1.id } };
      const response2 = { members: [user2] };

      beforeEach(async () => {
        jest
          .spyOn(slackClient, 'getUsersList')
          .mockResolvedValueOnce({ response: response1 } as never)
          .mockResolvedValueOnce({ response: response2 } as never);

        result = await slackService.getUsers();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls slackClient.getUsersList for first call with no cursor option', () => {
        expect(slackClient.getUsersList).toHaveBeenNthCalledWith(1, { cursor, limit });
      });

      it('calls slackClient.getUsersList for second call with cursor option', () => {
        expect(slackClient.getUsersList).toHaveBeenNthCalledWith(2, { cursor: user1.id, limit });
      });

      it('returns result with multiple users', () => {
        expect(result).toEqual({ users: [user1, user2], error: undefined });
      });
    });

    describe('with error', () => {
      beforeEach(async () => {
        jest.spyOn(slackClient, 'getUsersList').mockResolvedValueOnce({ error } as never);

        result = await slackService.getUsers();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('returns result with error', () => {
        expect(result).toEqual({ users: [], error });
      });
    });
  });

  describe('calling function getUsersConversations', () => {
    let result: GetUsersConversationsResult;

    describe('successfully', () => {
      const response = { channels: [channel1] };

      beforeEach(async () => {
        jest.spyOn(slackClient, 'getUsersConversations').mockResolvedValueOnce({ response } as never);

        result = await slackService.getUsersConversations();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls slackClient.getUsersConversations', () => {
        expect(slackClient.getUsersConversations).toHaveBeenCalledWith({ cursor, limit });
      });

      it('returns result', () => {
        expect(result).toEqual({ userId: '', channels: [channel1], error: undefined });
      });
    });

    describe('with user arg in params', () => {
      const args = { user: user1.id };
      const response = { channels: [channel1] };

      beforeEach(async () => {
        jest.spyOn(slackClient, 'getUsersConversations').mockResolvedValueOnce({ response } as never);

        result = await slackService.getUsersConversations(args);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls slackClient.getUsersConversations with user in args', () => {
        expect(slackClient.getUsersConversations).toHaveBeenCalledWith({ ...args, cursor, limit });
      });

      it('returns result with userId and channels', () => {
        expect(result).toEqual({ userId: user1.id, channels: [channel1], error: undefined });
      });
    });

    describe('with next_cursor in responseMetadata', () => {
      const response1 = { channels: [channel1], response_metadata: { next_cursor: channel1.id } };
      const response2 = { channels: [channel2] };

      beforeEach(async () => {
        jest
          .spyOn(slackClient, 'getUsersConversations')
          .mockResolvedValueOnce({ response: response1 } as never)
          .mockResolvedValueOnce({ response: response2 } as never);

        result = await slackService.getUsersConversations();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls slackClient.getUsersConversations for first call with no cursor option', () => {
        expect(slackClient.getUsersConversations).toHaveBeenNthCalledWith(1, { cursor, limit });
      });

      it('calls slackClient.getUsersConversations for second call with cursor option', () => {
        expect(slackClient.getUsersConversations).toHaveBeenNthCalledWith(2, { cursor: channel1.id, limit });
      });

      it('returns result with multiple channels', () => {
        expect(result).toEqual({ userId: '', channels: [channel1, channel2], error: undefined });
      });
    });

    describe('with error', () => {
      beforeEach(async () => {
        jest.spyOn(slackClient, 'getUsersConversations').mockResolvedValueOnce({ error } as never);

        result = await slackService.getUsersConversations();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('returns result with error', () => {
        expect(result).toEqual({ userId: '', channels: [], error });
      });
    });
  });
});
