import { viewController } from '@controllers';
import { logger } from '@utils';
import type { AllMiddlewareArgs, SlackViewMiddlewareArgs } from '@slack/bolt';

const viewListener = async (args: SlackViewMiddlewareArgs & AllMiddlewareArgs) => {
  const { ack, payload, view, body } = args;
  const { callback_id: callbackId } = view;

  await ack();

  switch (callbackId) {
    case 'saveUserDates':
      await viewController.saveUserDates(args);
      break;
    case 'saveUserDatesRefreshAppHome':
      await viewController.saveUserDates(args, true);
      break;
    default:
      logger.info('viewListener: unknown view', { payload, view, body });
  }
};

export default viewListener;
