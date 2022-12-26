/* istanbul ignore file */
import { App } from '@slack/bolt';
import listeners from '../listeners';
import config from './config';
import logger from './logger';
import slackLogger, { getSlackLogger } from './slackLogger';
import type { CodedError, Logger } from '@slack/bolt';
import type { ErrorHandler } from '@slack/bolt/dist/App';

const getApp = (customLogger?: Logger) => {
  const {
    slack: { appToken, botToken },
  } = config;

  const handleError = (error: CodedError) => {
    logger.error('app: error', { error });
  };

  const app = new App({ appToken, token: botToken, socketMode: true, logger: customLogger || slackLogger });
  app.error(handleError as ErrorHandler);

  return app;
};

export const getAppNoLogging = () => {
  const skipLog = true;
  const customLogger = getSlackLogger(skipLog);

  return getApp(customLogger);
};

const start = async () => {
  const {
    app: { port },
  } = config;

  const app = getApp();
  listeners.register(app);

  let isStarted = false;
  try {
    await app.start(port);

    isStarted = true;
  } catch (error) {
    logger.error('App failed to start', { error });
  }

  if (isStarted) {
    logger.info(`App started on port ${port}`);
  }

  return { isStarted };
};

export default { start };
