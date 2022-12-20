import logger from '../utils/logger';
import type { AllMiddlewareArgs, App, SlackShortcutMiddlewareArgs } from '@slack/bolt';

const register = (app: App) => {
  app.shortcut(/w*/, async (args: SlackShortcutMiddlewareArgs & AllMiddlewareArgs) => {
    const { ack, payload, shortcut, body } = args;

    await ack();

    switch (true) {
      default:
        logger.error('Unknown app shortcut', { payload, shortcut, body });
    }
  });
};

export default { register };
