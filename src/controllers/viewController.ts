import { viewService } from '../services';
import logger from '../utils/logger';
import { appHome } from '../views';
import type { AllMiddlewareArgs, SlackViewMiddlewareArgs } from '@slack/bolt';

const saveUserDates = async (args: SlackViewMiddlewareArgs & AllMiddlewareArgs) => {
  const { view, body, client } = args;
  const { user: slackUser } = body;
  const { id: userId } = slackUser;
  const {
    state: { values },
  } = view;
  logger.debug('viewController: saveUserDates called', { slackUser, values });

  const { user, hasSaveError } = await viewService.saveUserDates(userId, values);
  const options = { user_id: userId, view: appHome.getView(user, hasSaveError) };

  try {
    await client.views.publish(options);
  } catch (error) {
    logger.error('viewController: saveUserDates views.publish error', { error });
  }
};

export default { saveUserDates };
