import { App } from '@slack/bolt';
import {
  actionListener,
  commandListener,
  eventListener,
  messageListener,
  optionsListener,
  shortcutListener,
  viewListener,
} from '@listeners';
import { config, logger, slackLogger } from '@utils';
import type { CodedError } from '@slack/bolt';
import type { ErrorHandler } from '@slack/bolt/dist/App';

export const getApp = () => {
  const handleError = (error: CodedError) => {
    logger.warn('app: error has occurred', { error });
  };

  const app = new App({
    appToken: config.slack.appToken,
    token: config.slack.botToken,
    socketMode: true,
    logger: slackLogger,
  });
  app.error(handleError as ErrorHandler);

  return app;
};

const start = async () => {
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
    await app.start(config.app.port);
    logger.info(`app: start success on port ${config.app.port}`);
    isStarted = true;
  } catch (error) {
    logger.warn('app: start failed', { error });
  }

  return { isStarted };
};

export default { start };
