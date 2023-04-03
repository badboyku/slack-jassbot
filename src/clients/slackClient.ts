import { SlackClientError } from '@errors';
import { logger } from '@utils';
import { getApp } from '@utils/app';
import type {
  ConversationsListArguments,
  ConversationsListResponse,
  ConversationsMembersArguments,
  ConversationsMembersResponse,
  WebAPICallResult,
} from '@slack/web-api';

export type SlackClientResult = {
  response?: ConversationsListResponse | ConversationsMembersResponse;
  error?: SlackClientError;
};

const handleResponse = (response: WebAPICallResult) => {
  return { response };
};

const handleError = (method: string) => (err: { code: string; data: WebAPICallResult }) => {
  const { code, data: response } = err;
  const { error, response_metadata: responseMetadata } = response || {};
  const { messages } = responseMetadata || {};
  logger.warn(`slackClient: ${method} error`, { code, error, messages });

  return { error: new SlackClientError(`${code}: ${error}`, response) };
};

const getConversationsList = (options?: ConversationsListArguments): Promise<SlackClientResult> => {
  return getApp().client.conversations.list(options).then(handleResponse).catch(handleError('getConversationsList'));
};

const getConversationsMembers = (options?: ConversationsMembersArguments): Promise<SlackClientResult> => {
  return getApp()
    .client.conversations.members(options)
    .then(handleResponse)
    .catch(handleError('getConversationsMembers'));
};

export default { getConversationsList, getConversationsMembers };
