import { SlackClientError } from '../errors';
import { getAppNoLogging } from '../utils/app';
import logger from '../utils/logger';
import type { ConversationsListArguments, ConversationsListResponse, WebAPICallResult } from '@slack/web-api';

export type SlackClientResult = {
  response?: ConversationsListResponse;
  error?: SlackClientError;
};

const handleResponse =
  (method: string) =>
  (response: WebAPICallResult): SlackClientResult => {
    logger.debug(`slackClient: ${method} success`);

    return { response };
  };

const handleError =
  (method: string) =>
  (err: { code: string; data: WebAPICallResult }): SlackClientResult => {
    const { code, data: response } = err;
    const { error, response_metadata: responseMetadata } = response || {};
    const { messages } = responseMetadata || {};
    logger.error(`slackClient: ${method} error`, { code, error, messages });

    return { error: new SlackClientError(`${code}: ${error}`, response) };
  };

const getConversationsList = (options?: ConversationsListArguments): Promise<SlackClientResult> => {
  const method = 'getConversationsList';
  logger.debug(`slackClient: ${method} called`, { options });

  return getAppNoLogging().client.conversations.list(options).then(handleResponse(method)).catch(handleError(method));
};

export default { getConversationsList };
