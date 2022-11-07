import { appHomeService } from '../services';
import { appHomeView } from '../views';
import logger from '../utils/logger';
import type {
  AllMiddlewareArgs,
  BlockAction,
  SlackActionMiddlewareArgs,
  SlackEventMiddlewareArgs,
  SlackViewMiddlewareArgs,
} from '@slack/bolt';
import type { ViewsOpenArguments, ViewsPublishArguments } from '@slack/web-api';

const appHomeOpened = async (args: SlackEventMiddlewareArgs<'app_home_opened'> & AllMiddlewareArgs) => {
  const { client, event } = args;
  const { channel, tab, type, user: userId } = event;
  logger.debug('appHomeController: appHomeOpened called', { event: { channel, tab, type, userId } });

  if (tab === 'messages') {
    // TODO: Do something when user opens message tab?
    // await say(`Hello world, and welcome <@${event.user}>!`);
  }

  if (tab === 'home') {
    try {
      const { user } = await appHomeService.appHomeOpened(userId);
      const options = appHomeView.getAppHomeArgs(userId, user);

      await client.views.publish(options);
    } catch (error) {
      logger.error('appHomeController: appHomeOpened error', { error });
    }
  }

  logger.debug('appHomeController: appHomeOpened completed');
};

const manageUserDates = async (args: SlackActionMiddlewareArgs & AllMiddlewareArgs) => {
  const { ack, action, body, client } = args;
  const { trigger_id: triggerId, user: slackUser } = body as BlockAction;
  const { id: userId } = slackUser;
  logger.debug('appHomeController: manageUserDates called', { action, triggerId, slackUser });

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
    logger.error('appHomeController: manageUserDates error', { error });
  }

  logger.debug('appHomeController: manageUserDates completed');
};

const saveUserDates = async (args: SlackViewMiddlewareArgs & AllMiddlewareArgs) => {
  const { ack, body, client } = args;
  const { user: slackUser, view } = body;
  const { id: userId } = slackUser;
  const {
    state: { values },
  } = view;
  logger.debug('appHomeController: saveUserDates called', { slackUser, values });

  try {
    await ack();

    const { user } = await appHomeService.saveUserDates(userId, values);
    const header = !user
      ? '*Oh no!* :scream:\nWe seem to be having issues saving your data, cross your fingers and please try again.'
      : '';
    const options = appHomeView.getAppHomeArgs(userId, user, header);

    await client.views.publish(options);
  } catch (error) {
    logger.error('appHomeController: saveUserDates error', { error });
  }

  logger.debug('appHomeController: saveUserDates completed');
};

export default { appHomeOpened, manageUserDates, saveUserDates };
