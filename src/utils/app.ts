import {
  actionListener,
  commandListener,
  eventListener,
  messageListener,
  optionsListener,
  shortcutListener,
  viewListener,
} from '@listeners';
import { config, logger } from '@utils';
import { appHelper } from '@utils/helpers';
import type { CodedError } from '@slack/bolt';
import type { ErrorHandler } from '@slack/bolt/dist/App';

export type AppStartResult = { isStarted: boolean };
const start = async (): Promise<AppStartResult> => {
  const handleError = (error: CodedError) => {
    logger.warn('app: error has occurred', { error });
  };

  const app = appHelper.getApp();
  app.error(handleError as ErrorHandler);

  // Add listeners.
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
