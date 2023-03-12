/* istanbul ignore file */
import { App } from '@slack/bolt';
import {
  actionListener,
  commandListener,
  eventListener,
  messageListener,
  optionsListener,
  shortcutListener,
  viewListener,
} from '../listeners';
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
    logger.warn('app: error has occurred', { error });
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
  app.action(/w*/, actionListener);
  app.command(/w*/, commandListener);
  app.event(/w*/, eventListener);
  app.message(/w*/, messageListener);
  app.options(/w*/, optionsListener);
  app.shortcut(/w*/, shortcutListener);
  app.view(/w*/, viewListener);

  let isStarted = false;
  try {
    await app.start(port);
    logger.info(`app: start success on port ${port}`);
    isStarted = true;
  } catch (error) {
    logger.warn('app: start failed', { error });
  }

  return { isStarted };
};

export default { start };
