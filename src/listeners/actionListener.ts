/* istanbul ignore file */
import { appHomeController } from '../controllers';
import type { App } from '@slack/bolt';
// import { AllMiddlewareArgs, SlackActionMiddlewareArgs } from '@slack/bolt';

const register = (app: App) => {
  app.action('manageUserDates', appHomeController.manageUserDates);
  app.action('cancelManageUserDates', appHomeController.cancelManageUserDates);
  app.action('doneManageUserDates', appHomeController.doneManageUserDates);
  app.action('setUserBirthday', appHomeController.setUserBirthday);
  app.action('setUserWorkAnniversary', appHomeController.setUserWorkAnniversary);

  // app.action(/w*/, async (args: SlackActionMiddlewareArgs & AllMiddlewareArgs) => {
  //   const { payload, action, body, /* say, respond, */ ack, logger /* , client */ } = args;
  //   logger.debug('action:', { payload, action, body });
  //
  //   await ack();
  // });
};

export default { register };
