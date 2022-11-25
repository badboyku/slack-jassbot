import { appHomeService } from '../services';
import logger from '../utils/logger';
import { appHomeView } from '../views';
import type { AllMiddlewareArgs, SlackViewMiddlewareArgs } from '@slack/bolt';

const saveUserDates = async (args: SlackViewMiddlewareArgs & AllMiddlewareArgs) => {
  const { ack, body, client } = args;
  const { user: slackUser, view } = body;
  const { id: userId } = slackUser;
  const {
    state: { values },
  } = view;
  logger.debug('viewController: saveUserDates called', { slackUser, values });

  try {
    await ack();

    const { user } = await appHomeService.saveUserDates(userId, values);
    const header = !user
      ? '*Oh no!* :scream:\nWe seem to be having issues saving your data, cross your fingers and please try again.'
      : '';
    const options = appHomeView.getAppHomeArgs(userId, user, header);

    await client.views.publish(options);
  } catch (error) {
    logger.error('viewController: saveUserDates error', { error });
  }

  logger.debug('viewController: saveUserDates completed');
};

export default { saveUserDates };
