import { appHomeService } from '../services';
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
    const options = await appHomeService.appHomeOpened(userId);

    try {
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
  logger.debug('appHomeController: manageUserDates called', { action, triggerId, slackUser });

  await ack();
  const { options, goHome } = await appHomeService.manageUserDates(triggerId, slackUser);

  try {
    if (goHome) {
      await client.views.publish(options as ViewsPublishArguments);
    } else {
      await client.views.open(options as ViewsOpenArguments);
    }
  } catch (error) {
    logger.error('appHomeController: manageUserDates error', { error });
  }

  logger.debug('appHomeController: manageUserDates completed');
};

const saveUserDates = async (args: SlackViewMiddlewareArgs & AllMiddlewareArgs) => {
  const { ack, body, client } = args;
  const { user: slackUser, view } = body;
  const {
    state: { values },
  } = view;
  logger.debug('appHomeController: saveUserDates called', { slackUser, values });

  await ack();
  const options = await appHomeService.saveUserDates(slackUser, values);

  try {
    await client.views.publish(options);
  } catch (error) {
    logger.error('appHomeController: saveUserDates error', { error });
  }

  logger.debug('appHomeController: saveUserDates completed');
};

export default { appHomeOpened, manageUserDates, saveUserDates };
