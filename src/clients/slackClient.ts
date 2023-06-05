import { SlackClientError } from '@errors';
import { appHelper, logger } from '@utils';
import type { CodedError } from '@slack/bolt';
import type { ErrorHandler } from '@slack/bolt/dist/App';
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

const getApp = () => {
  const handleError = (error: CodedError) => {
    logger.warn('app: error has occurred', { error });
  };

  const app = appHelper.getApp();
  app.error(handleError as ErrorHandler);

  return app;
};

const handleResponse = (response: WebAPICallResult) => {
  return { response };
};

const handleError = (method: string) => (err: { code: string; data: WebAPICallResult }) => {
  const { code, data: response } = err;
  const { error, response_metadata: responseMetadata } = response || /* istanbul ignore next */ {};
  const { messages } = responseMetadata || /* istanbul ignore next */ {};
  logger.warn(`slackClient: ${method} error`, { code, error, messages });

  return { error: new SlackClientError(`${code}: ${error}`, response) };
};

const getConversationsList = (options?: ConversationsListArguments): Promise<SlackClientGetConversationsListResult> => {
  return getApp().client.conversations.list(options).then(handleResponse).catch(handleError('getConversationsList'));
};

const getConversationsMembers = (
  options?: ConversationsMembersArguments,
): Promise<SlackClientGetConversationsMembersResult> => {
  return getApp()
    .client.conversations.members(options)
    .then(handleResponse)
    .catch(handleError('getConversationsMembers'));
};

const getUsersConversations = (
  options?: UsersConversationsArguments,
): Promise<SlackClientGetUsersConversationsResult> => {
  return getApp().client.users.conversations(options).then(handleResponse).catch(handleError('getUserConversations'));
};

const getUsersList = (options?: UsersListArguments): Promise<SlackClientGetUsersListResult> => {
  return getApp().client.users.list(options).then(handleResponse).catch(handleError('getUsersList'));
};

export default { getConversationsList, getConversationsMembers, getUsersConversations, getUsersList };
