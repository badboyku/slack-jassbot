import { slackClient } from '@clients';
import { SlackClientError } from '@errors';
import { appHelper, logger } from '@utils';
import type { App, CodedError } from '@slack/bolt';
import type { SlackClientGetConversationListResult, SlackClientGetConversationsMembersResult } from '@types';

jest.mock('@utils/app/appHelper');
jest.mock('@utils/logger/logger');

describe('clients slack', () => {
  const responseSuccess = { ok: true };
  const someError = new Error('some error');
  const errorWithCallback = (callback: (_error: CodedError) => void) => {
    callback(someError as CodedError);
  };
  const code = 'code';
  const error = 'error';
  const messages = ['message'];
  const err = { code, data: { ok: false, error, response_metadata: { messages } } };
  const clientError = new SlackClientError(`${code}: ${error}`, err.data);

  describe('calling function getConversationsList', () => {
    const options = {};
    let result: SlackClientGetConversationListResult;

    describe('successfully', () => {
      const appMock = { error: errorWithCallback, client: { conversations: { list: jest.fn() } } };

      beforeEach(async () => {
        appMock.client.conversations.list.mockResolvedValue(responseSuccess);
        jest.spyOn(appHelper, 'getApp').mockReturnValueOnce(appMock as unknown as App);
        jest.spyOn(logger, 'warn').mockImplementation(() => {
          // Do nothing.
        });

        result = await slackClient.getConversationsList(options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls appHelper.getApp', () => {
        expect(appHelper.getApp).toHaveBeenCalled();
      });

      it('calls logger.warn with ErrorHandler', () => {
        expect(logger.warn).toHaveBeenCalledWith('app: error has occurred', { error: someError });
      });

      it('calls app.client.conversations.list', () => {
        expect(appMock.client.conversations.list).toHaveBeenCalledWith(options);
      });

      it('returns response', () => {
        expect(result).toEqual({ response: responseSuccess });
      });
    });

    describe('with error', () => {
      const appMock = { error: jest.fn(), client: { conversations: { list: jest.fn() } } };

      beforeEach(async () => {
        appMock.client.conversations.list.mockRejectedValueOnce(err);
        jest.spyOn(appHelper, 'getApp').mockReturnValueOnce(appMock as unknown as App);
        jest.spyOn(logger, 'warn').mockImplementation(() => {
          // Do nothing.
        });

        result = await slackClient.getConversationsList(options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('slackClient: getConversationsList error', { code, error, messages });
      });

      it('returns error', () => {
        expect(result).toEqual({ error: clientError });
      });
    });
  });

  describe('calling function getConversationsMembers', () => {
    const options = { channel: 'channel' };
    let result: SlackClientGetConversationsMembersResult;

    describe('successfully', () => {
      const appMock = { error: errorWithCallback, client: { conversations: { members: jest.fn() } } };

      beforeEach(async () => {
        appMock.client.conversations.members.mockResolvedValue(responseSuccess);
        jest.spyOn(appHelper, 'getApp').mockReturnValueOnce(appMock as unknown as App);
        jest.spyOn(logger, 'warn').mockImplementation(() => {
          // Do nothing.
        });

        result = await slackClient.getConversationsMembers(options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls appHelper.getApp', () => {
        expect(appHelper.getApp).toHaveBeenCalled();
      });

      it('calls logger.warn with ErrorHandler', () => {
        expect(logger.warn).toHaveBeenCalledWith('app: error has occurred', { error: someError });
      });

      it('calls app.client.conversations.members', () => {
        expect(appMock.client.conversations.members).toHaveBeenCalledWith(options);
      });

      it('returns response', () => {
        expect(result).toEqual({ response: responseSuccess });
      });
    });

    describe('with error', () => {
      const appMock = { error: jest.fn(), client: { conversations: { members: jest.fn() } } };

      beforeEach(async () => {
        appMock.client.conversations.members.mockRejectedValueOnce(err);
        jest.spyOn(appHelper, 'getApp').mockReturnValueOnce(appMock as unknown as App);
        jest.spyOn(logger, 'warn').mockImplementation(() => {
          // Do nothing.
        });

        result = await slackClient.getConversationsMembers(options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('slackClient: getConversationsMembers error', {
          code,
          error,
          messages,
        });
      });

      it('returns error', () => {
        expect(result).toEqual({ error: clientError });
      });
    });
  });
});
