import { actionController } from '../controllers';
import logger from '../utils/logger';
import type { AllMiddlewareArgs, BasicElementAction, SlackActionMiddlewareArgs } from '@slack/bolt';

const actionListener = async (args: SlackActionMiddlewareArgs & AllMiddlewareArgs) => {
  const { ack, payload, action, body } = args;
  const { action_id: actionId } = action as BasicElementAction;

  await ack();

  switch (actionId) {
    case 'manageUserDates':
      await actionController.manageUserDates(args);
      break;
    default:
      logger.warn('Unknown app action', { payload, action, body });
  }
};

export default actionListener;
