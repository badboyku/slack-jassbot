import { actionService } from '@services';
import { logger } from '@utils';
import { manageUserDates as manageUserDatesView } from '@views';
import type { AllMiddlewareArgs, BlockAction, ButtonAction, SlackActionMiddlewareArgs } from '@slack/bolt';

const manageUserDates = async (args: SlackActionMiddlewareArgs & AllMiddlewareArgs) => {
  const { action, body, client } = args;
  const { block_id: blockId } = action as ButtonAction;
  const { trigger_id: triggerId, user: slackUser } = body as BlockAction;
  const { id: userId } = slackUser;

  const { user } = await actionService.manageUserDates(userId);

  if (user) {
    const refreshAppHome = blockId.includes('appHome');
    const callbackId = refreshAppHome ? 'saveUserDatesRefreshAppHome' : 'saveUserDates';
    const options = { trigger_id: triggerId, view: manageUserDatesView.getModal(user, callbackId) };

    try {
      await client.views.open(options);
    } catch (error) {
      logger.warn('actionController: manageUserDates views.open error', { error });
    }
  }
};

export default { manageUserDates };
