import { actionService } from '../services';
import logger from '../utils/logger';
import { appHome, manageUserDatesModal } from '../views';
import type { AllMiddlewareArgs, BlockAction, SlackActionMiddlewareArgs } from '@slack/bolt';

const manageUserDates = async (args: SlackActionMiddlewareArgs & AllMiddlewareArgs) => {
  const { action, body, client } = args;
  const { trigger_id: triggerId, user: slackUser } = body as BlockAction;
  const { id: userId } = slackUser;
  logger.debug('actionController: manageUserDates called', { action, triggerId, slackUser });

  const { user } = await actionService.manageUserDates(userId);

  if (user) {
    const view = manageUserDatesModal.getView(user);
    const options = { trigger_id: triggerId, view };

    try {
      await client.views.open(options);
    } catch (error) {
      logger.error('actionController: manageUserDates views.open error', { error });
    }
  } else {
    const view = appHome.getView(user);
    const options = { user_id: userId, view };

    try {
      await client.views.publish(options);
    } catch (error) {
      logger.error('actionController: manageUserDates views.publish error', { error });
    }
  }
};

export default { manageUserDates };
