import logger from '../utils/logger';
import type { AllMiddlewareArgs, SlackShortcutMiddlewareArgs } from '@slack/bolt';

const shortcutListener = async (args: SlackShortcutMiddlewareArgs & AllMiddlewareArgs) => {
  const { ack, payload, shortcut, body } = args;

  await ack();

  switch (true) {
    default:
      logger.warn('Unknown app shortcut', { payload, shortcut, body });
  }
};

export default shortcutListener;
