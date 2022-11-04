/* istanbul ignore file */
import { appHomeController } from '../controllers';
import type { App } from '@slack/bolt';
// import type { AllMiddlewareArgs, SlackViewMiddlewareArgs } from '@slack/bolt';

const register = (app: App) => {
  app.view('saveUserDates', appHomeController.saveUserDates);

  // app.view(/w*/, async (args: SlackViewMiddlewareArgs & AllMiddlewareArgs) => {
  //   const { payload, view, body, ack, /* respond, */ logger /* , client */ } = args;
  //   logger.debug('view:', { payload, view, body });
  //
  //   await ack();
  // });
};

export default { register };
