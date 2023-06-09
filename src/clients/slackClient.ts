import { SlackClientError } from '@errors';
import { appHelper, logger } from '@utils';
import type {
  ConversationsListArguments,
  ConversationsMembersArguments,
  UsersConversationsArguments,
  UsersListArguments,
  WebAPICallResult,
} from '@slack/web-api';
import type {
  SlackClientGetConversationsListResult,
  SlackClientGetConversationsMembersResult,
  SlackClientGetUsersConversationsResult,
  SlackClientGetUsersListResult,
} from '@types';

const delay = (ms?: number) => {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, ms || 1000);
  });
};

const handleResponse = (_method: string) => (response: WebAPICallResult) => {
  return { response };
};

const handleError = (method: string) => (err: { code: string; data: WebAPICallResult }) => {
  const { code, data: response } = err;
  const { error, response_metadata: responseMetadata } = response || /* istanbul ignore next */ {};
  const { messages } = responseMetadata || /* istanbul ignore next */ {};
  logger.warn(`slackClient: ${method} error`, { code, error, messages });

  return { error: new SlackClientError(`${code}: ${error}`, response) };
};

/**
 * Tier 2 (20 per minute)
 * @param options
 */
const getConversationsList = (options?: ConversationsListArguments): Promise<SlackClientGetConversationsListResult> => {
  logger.debug('slackClient: getConversationsList called', { options });

  return delay().then(() =>
    appHelper
      .getApp()
      .client.conversations.list(options)
      .then(handleResponse('getConversationsList'))
      .catch(handleError('getConversationsList')),
  );
};

/**
 * Tier 4 (100 per minute)
 * @param options
 */
const getConversationsMembers = (
  options?: ConversationsMembersArguments,
): Promise<SlackClientGetConversationsMembersResult> => {
  logger.debug('slackClient: getConversationsMembers called', { options });

  return delay().then(() =>
    appHelper
      .getApp()
      .client.conversations.members(options)
      .then(handleResponse('getConversationsMembers'))
      .catch(handleError('getConversationsMembers')),
  );
};

/**
 * Tier 3 (50 per minute)
 * @param options
 */
const getUsersConversations = (
  options?: UsersConversationsArguments,
): Promise<SlackClientGetUsersConversationsResult> => {
  logger.debug('slackClient: getUsersConversations called', { options });

  return delay().then(() =>
    appHelper
      .getApp()
      .client.users.conversations(options)
      .then(handleResponse('getUserConversations'))
      .catch(handleError('getUserConversations')),
  );
};

/**
 * Tier 2 (20 per minute)
 * @param options
 */
const getUsersList = (options?: UsersListArguments): Promise<SlackClientGetUsersListResult> => {
  logger.debug('slackClient: getUsersList called', { options });

  return delay().then(() =>
    appHelper
      .getApp()
      .client.users.list(options)
      .then(handleResponse('getUsersList'))
      .catch(handleError('getUsersList')),
  );
};

export default { getConversationsList, getConversationsMembers, getUsersConversations, getUsersList };
