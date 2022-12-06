/* istanbul ignore file */
import logger from '../utils/logger';
import type { AllMiddlewareArgs, App, SlackEventMiddlewareArgs } from '@slack/bolt';

const register = (app: App) => {
  app.message(/w*/, async (args: SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs) => {
    const { payload, event, message, body } = args;

    switch (true) {
      default:
        logger.error('Unknown app message', { payload, event, message, body });
    }
  });
};

export default { register };
