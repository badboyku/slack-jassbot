/* istanbul ignore file */
import { appHomeController } from '../controllers';
import type { App } from '@slack/bolt';
// import type { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';

const register = (app: App) => {
  app.event('app_home_opened', appHomeController.appHomeOpened);

  // app.event(/w*/, async (args: SlackEventMiddlewareArgs & AllMiddlewareArgs) => {
  //   const { payload, event, message, body, logger } = args;
  //   logger.debug('event:', { payload, event, message });
  // });
};

export default { register };
