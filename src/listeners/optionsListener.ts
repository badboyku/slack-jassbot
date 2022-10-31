/* istanbul ignore file */
import type { AllMiddlewareArgs, App, SlackOptionsMiddlewareArgs } from '@slack/bolt';

const register = (app: App) => {
  app.options(/w*/, async (args: SlackOptionsMiddlewareArgs & AllMiddlewareArgs) => {
    const { payload, body, options, ack, logger /* , client */ } = args;
    logger.debug('options:', { payload, body, options });

    await ack();
  });
};

export default { register };
