import {
  actionListener,
  commandListener,
  eventListener,
  messageListener,
  optionsListener,
  shortcutListener,
  viewListener,
} from '@listeners';
import { appHelper, config, logger } from '@utils';
import type { AppStartResult } from '@types';

const start = async (): Promise<AppStartResult> => {
  const app = appHelper.getApp();

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
