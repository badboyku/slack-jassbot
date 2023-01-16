import { viewController } from '../controllers';
import logger from '../utils/logger';
import type { AllMiddlewareArgs, SlackViewMiddlewareArgs } from '@slack/bolt';

const viewListener = async (args: SlackViewMiddlewareArgs & AllMiddlewareArgs) => {
  const { ack, payload, view, body } = args;
  const { callback_id: callbackId } = view;

  await ack();

  switch (callbackId) {
    case 'saveUserDatesRefreshAppHome':
      await viewController.saveUserDates(args, true);
      break;
    case 'saveUserDates':
      await viewController.saveUserDates(args);
      break;
    default:
      logger.warn('Unknown app view', { payload, view, body });
  }
};

export default viewListener;
