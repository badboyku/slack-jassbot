import { SlackClientError } from '../errors';
import { getAppNoLogging } from '../utils/app';
import logger from '../utils/logger';
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

const handleResponse = (response: WebAPICallResult): SlackClientResult => {
  return { response };
};

const handleError =
  (method: string) =>
  (err: { code: string; data: WebAPICallResult }): SlackClientResult => {
    const { code, data: response } = err;
    const { error, response_metadata: responseMetadata } = response || {};
    const { messages } = responseMetadata || {};
    logger.warn(`slackClient: ${method} error`, { code, error, messages });

    return { error: new SlackClientError(`${code}: ${error}`, response) };
  };

const getConversationsList = (options?: ConversationsListArguments): Promise<SlackClientResult> => {
  const method = 'getConversationsList';
  logger.debug(`slackClient: ${method} called`, { options });

  return getAppNoLogging().client.conversations.list(options).then(handleResponse).catch(handleError(method));
};

const getConversationsMembers = (options?: ConversationsMembersArguments): Promise<SlackClientResult> => {
  const method = 'getConversationsMembers';
  logger.debug(`slackClient: ${method} called`, { options });

  return getAppNoLogging().client.conversations.members(options).then(handleResponse).catch(handleError(method));
};

export default { getConversationsList, getConversationsMembers };
