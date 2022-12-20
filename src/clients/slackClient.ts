import { getApp } from '../app';
import { SlackClientError } from '../errors';
import logger from '../utils/logger';
import { getSlackLogger } from '../utils/slackLogger';
import type { ConversationsListArguments, ConversationsListResponse, WebAPICallResult } from '@slack/web-api';

type WebAPICallError = {
  code: string;
  data: WebAPICallResult;
};

export type SlackClientResult = {
  response?: ConversationsListResponse;
  error?: SlackClientError;
};

const getSlackApp = () => {
  const skipLog = true;
  const slackLogger = getSlackLogger(skipLog);

  return getApp(slackLogger);
};

const handleResponse =
  (method: string) =>
  (response: WebAPICallResult): SlackClientResult => {
    logger.debug(`slackClient: ${method} success`);

    return { response };
  };

const handleError =
  (method: string) =>
  (err: WebAPICallError): SlackClientResult => {
    const { code, data: response } = err;
    const { error, response_metadata: responseMetadata } = response || {};
    const { messages } = responseMetadata || {};
    logger.error(`slackClient: ${method} error`, { code, error, messages });

    return { error: new SlackClientError(`${code}: ${error}`, response) };
  };

const getConversationsList = (options?: ConversationsListArguments): Promise<SlackClientResult> => {
  const method = 'getConversationsList';
  logger.debug(`slackClient: ${method} called`, { options });

  const app = getSlackApp();

  return app.client.conversations.list(options).then(handleResponse(method)).catch(handleError(method));
};

export default { getConversationsList };
