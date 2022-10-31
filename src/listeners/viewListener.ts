/* istanbul ignore file */
import type {AllMiddlewareArgs, App, SlackViewMiddlewareArgs} from '@slack/bolt';

const register = (app: App) => {
  app.view(/w*/, async (args: SlackViewMiddlewareArgs & AllMiddlewareArgs) => {
    const { payload, view, body, ack, /* respond, */ logger /* , client */ } = args;
    logger.debug('view:', { payload, view, body });

    await ack();
  });
};

export default { register };
