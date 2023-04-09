import { viewService } from '@services';
import { logger } from '@utils';
import { appHome, manageUserDates } from '@views';
import type { AllMiddlewareArgs, SlackViewMiddlewareArgs } from '@slack/bolt';

const saveUserDates = async (args: SlackViewMiddlewareArgs & AllMiddlewareArgs, refreshAppHome = false) => {
  const { view, body, client } = args;
  const { user: slackUser } = body;
  const { id: userId } = slackUser;
  const {
    state: { values },
  } = view;

  const { user, hasSaveError } = await viewService.saveUserDates(userId, values);
  const saveResultOptions = manageUserDates.getSaveResult(userId, hasSaveError);

  try {
    await client.chat.postMessage(saveResultOptions);
  } catch (error) {
    logger.warn('viewController: saveUserDates chat.postMessage error', { error });
  }

  if (refreshAppHome) {
    const options = { user_id: userId, view: appHome.getView(user) };

    try {
      await client.views.publish(options);
    } catch (error) {
      logger.warn('viewController: saveUserDates views.publish error', { error });
    }
  }
};

export default { saveUserDates };
