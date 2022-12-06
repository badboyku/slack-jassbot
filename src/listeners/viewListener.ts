/* istanbul ignore file */
import { viewController } from '../controllers';
import logger from '../utils/logger';
import type { AllMiddlewareArgs, App, SlackViewMiddlewareArgs } from '@slack/bolt';

const register = (app: App) => {
  app.view(/w*/, async (args: SlackViewMiddlewareArgs & AllMiddlewareArgs) => {
    const { ack, payload, view, body } = args;
    const { callback_id: callbackId } = view;

    await ack();

    switch (callbackId) {
      case 'saveUserDates':
        await viewController.saveUserDates(args);
        break;
      default:
        logger.error('Unknown app view', { payload, view, body });
    }
  });
};

export default { register };
