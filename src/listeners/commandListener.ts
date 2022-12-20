import logger from '../utils/logger';
import type { AllMiddlewareArgs, App, SlackCommandMiddlewareArgs } from '@slack/bolt';

const register = (app: App) => {
  app.command(/w*/, async (args: SlackCommandMiddlewareArgs & AllMiddlewareArgs) => {
    const { ack, payload, command, body } = args;

    await ack();

    switch (true) {
      default:
        logger.error('Unknown app command', { payload, command, body });
    }
  });
};

export default { register };
