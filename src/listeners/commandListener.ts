/* istanbul ignore file */
import type {AllMiddlewareArgs, App, SlackCommandMiddlewareArgs} from '@slack/bolt';

const register = (app: App) => {
  app.command(/w*/, async (args: SlackCommandMiddlewareArgs & AllMiddlewareArgs) => {
    const { payload, command, body, /* say, respond, */ ack, logger /* , client */ } = args;
    logger.debug('command:', { payload, command, body });

    await ack();
  });
};

export default { register };
