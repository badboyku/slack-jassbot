import { appHomeService } from '../services';
import logger from '../utils/logger';
import { appHomeView } from '../views';
import type { AllMiddlewareArgs, BlockAction, SlackActionMiddlewareArgs } from '@slack/bolt';
import type { ViewsOpenArguments, ViewsPublishArguments } from '@slack/web-api';

const manageUserDates = async (args: SlackActionMiddlewareArgs & AllMiddlewareArgs) => {
  const { ack, action, body, client } = args;
  const { trigger_id: triggerId, user: slackUser } = body as BlockAction;
  const { id: userId } = slackUser;
  logger.debug('actionController: manageUserDates called', { action, triggerId, slackUser });

  try {
    await ack();

    const { user } = await appHomeService.manageUserDates(userId);
    const options = user
      ? appHomeView.getManageUserDatesModalArgs(triggerId, user)
      : appHomeView.getAppHomeArgs(userId, user);

    if (user) {
      await client.views.open(options as ViewsOpenArguments);
    } else {
      await client.views.publish(options as ViewsPublishArguments);
    }
  } catch (error) {
    logger.error('actionController: manageUserDates error', { error });
  }

  logger.debug('actionController: manageUserDates completed');
};

export default { manageUserDates };
