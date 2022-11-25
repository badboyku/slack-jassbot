/* istanbul ignore file */
import { eventController } from '../controllers';
import type { App } from '@slack/bolt';
// import type { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';

const register = (app: App) => {
  app.event('app_home_opened', eventController.appHomeOpened);
  app.event('app_mention', eventController.appMention);
  app.event('member_joined_channel', eventController.memberJoinedChannel);
  app.event('member_left_channel', eventController.memberLeftChannel);

  // app.event(/w*/, async (args: SlackEventMiddlewareArgs & AllMiddlewareArgs) => {
  //   const { payload, event, message, body, logger } = args;
  //   logger.debug('event:', { payload, event, message });
  // });
};

export default { register };
