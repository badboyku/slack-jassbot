import { actionService } from '../services';
import logger from '../utils/logger';
import { manageUserDates as manageUserDatesView } from '../views';
import type { AllMiddlewareArgs, BlockAction, ButtonAction, SlackActionMiddlewareArgs } from '@slack/bolt';

const manageUserDates = async (args: SlackActionMiddlewareArgs & AllMiddlewareArgs) => {
  const { action, body, client } = args;
  const { block_id: blockId } = action as ButtonAction;
  const { trigger_id: triggerId, user: slackUser } = body as BlockAction;
  const { id: userId } = slackUser;
  logger.debug('actionController: manageUserDates called', { action, triggerId, slackUser });

  const { user } = await actionService.manageUserDates(userId);

  if (user) {
    try {
      const refreshAppHome = blockId.includes('appHome');
      const callbackId = refreshAppHome ? 'saveUserDatesRefreshAppHome' : 'saveUserDates';
      const options = { trigger_id: triggerId, view: manageUserDatesView.getModal(user, callbackId) };

      await client.views.open(options);
    } catch (error) {
      logger.error('actionController: manageUserDates views.open error', { error });
    }
  }
};

export default { manageUserDates };
