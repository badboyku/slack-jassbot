import logger from '../utils/logger';
import type { AllMiddlewareArgs, App, SlackOptionsMiddlewareArgs } from '@slack/bolt';

const register = (app: App) => {
  app.options(/w*/, async (args: SlackOptionsMiddlewareArgs & AllMiddlewareArgs) => {
    const { ack, payload, options, body } = args;

    await ack();

    switch (true) {
      default:
        logger.warn('Unknown app options', { payload, options, body });
    }
  });
};

export default { register };
