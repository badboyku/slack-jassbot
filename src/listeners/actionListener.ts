/* istanbul ignore file */
import { appHomeController } from '../controllers';
import type { App } from '@slack/bolt';
// import type { AllMiddlewareArgs, SlackActionMiddlewareArgs } from '@slack/bolt';

const register = (app: App) => {
  app.action('manageUserDates', appHomeController.manageUserDates);

  // app.action(/w*/, async (args: SlackActionMiddlewareArgs & AllMiddlewareArgs) => {
  //   const { payload, action, body, /* say, respond, */ ack, logger /* , client */ } = args;
  //   logger.debug('action:', { payload, body, action });
  //
  //   await ack();
  // });
};

export default { register };
