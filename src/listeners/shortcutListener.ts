/* istanbul ignore file */
import type {AllMiddlewareArgs, App, SlackShortcutMiddlewareArgs} from '@slack/bolt';

const register = (app: App) => {
  app.shortcut(/w*/, async (args: SlackShortcutMiddlewareArgs & AllMiddlewareArgs) => {
    const { payload, shortcut, body, /* say, respond, */ ack, logger /* , client */ } = args;
    logger.debug('shortcut:', { payload, shortcut, body });

    await ack();
  });
};

export default { register };
