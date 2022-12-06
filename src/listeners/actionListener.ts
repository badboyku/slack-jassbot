/* istanbul ignore file */
import { actionController } from '../controllers';
import logger from '../utils/logger';
import type { AllMiddlewareArgs, App, BasicElementAction, SlackActionMiddlewareArgs } from '@slack/bolt';

const register = (app: App) => {
  app.action(/w*/, async (args: SlackActionMiddlewareArgs & AllMiddlewareArgs) => {
    const { ack, payload, action, body } = args;
    const { action_id: actionId } = action as BasicElementAction;

    await ack();

    switch (actionId) {
      case 'manageUserDates':
        await actionController.manageUserDates(args);
        break;
      default:
        logger.error('Unknown app action', { payload, action, body });
    }
  });
};

export default { register };
