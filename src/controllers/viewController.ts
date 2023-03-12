import { viewService } from '../services';
import logger from '../utils/logger';
import { appHome, manageUserDates } from '../views';
import type { AllMiddlewareArgs, SlackViewMiddlewareArgs } from '@slack/bolt';

const saveUserDates = async (args: SlackViewMiddlewareArgs & AllMiddlewareArgs, refreshAppHome = false) => {
  const { view, body, client } = args;
  const { user: slackUser } = body;
  const { id: userId } = slackUser;
  const {
    state: { values },
  } = view;
  logger.debug('viewController: saveUserDates called', { slackUser, refreshAppHome });

  const { user, hasSaveError } = await viewService.saveUserDates(userId, values);

  try {
    const options = manageUserDates.getSaveResult(userId, user, hasSaveError);
    await client.chat.postMessage(options);
  } catch (error) {
    logger.warn('viewController: saveUserDates chat.postMessage error', { error });
  }

  if (refreshAppHome) {
    try {
      const options = { user_id: userId, view: appHome.getView(user) };
      await client.views.publish(options);
    } catch (error) {
      logger.warn('viewController: saveUserDates views.publish error', { error });
    }
  }
};

export default { saveUserDates };
