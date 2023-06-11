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
      .then((response) => {
        logger.debug('slackClient: getConversationsList success', {
          numChannels: response.channels?.length,
          responseMetadata: { nextCursor: response.response_metadata?.next_cursor },
        });

        return { response };
      })
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
      .then((response) => {
        logger.debug('slackClient: getConversationsMembers success', {
          numMembers: response.members?.length,
          responseMetadata: { nextCursor: response.response_metadata?.next_cursor },
        });

        return { response };
      })
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
      .then((response) => {
        logger.debug('slackClient: getUsersConversations success', {
          numChannels: response.channels?.length,
          responseMetadata: { nextCursor: response.response_metadata?.next_cursor },
        });

        return { response };
      })
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
      .then((response) => {
        logger.debug('slackClient: getUsersList success', {
          numMembers: response.members?.length,
          responseMetadata: { nextCursor: response.response_metadata?.next_cursor },
        });

        return { response };
      })
      .catch(handleError('getUsersList')),
  );
};

export default { getConversationsList, getConversationsMembers, getUsersConversations, getUsersList };
