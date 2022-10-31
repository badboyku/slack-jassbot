/* istanbul ignore file */
import type {AllMiddlewareArgs, App, SlackEventMiddlewareArgs} from '@slack/bolt';

const register = (app: App) => {
  app.message(/w*/, async (args: SlackEventMiddlewareArgs<'message'> & AllMiddlewareArgs) => {
    const { payload, event, message, body, /* say, ack, */ logger /* , client */ } = args;
    logger.debug('message:', { payload, event, message, body });
  });
};

export default { register };
