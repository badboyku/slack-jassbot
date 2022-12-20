/* istanbul ignore file */
import { App } from '@slack/bolt';
import config from './utils/config';
import logger from './utils/logger';
import slackLogger from './utils/slackLogger';
import type { CodedError, Logger } from '@slack/bolt';
import type { ErrorHandler } from '@slack/bolt/dist/App';

export const getApp = (customLogger?: Logger) => {
  const {
    slack: { appToken, botToken: token },
  } = config;

  const handleError = (error: CodedError) => {
    logger.error('app: error', { error });
  };

  const app = new App({ appToken, token, socketMode: true, logger: customLogger || slackLogger });
  app.error(handleError as ErrorHandler);

  return app;
};

export default getApp();
