import { appHomeService } from '../services';
import type {
  AllMiddlewareArgs,
  BlockAction,
  SlackActionMiddlewareArgs,
  SlackEventMiddlewareArgs,
  SlackViewMiddlewareArgs,
} from '@slack/bolt';
import type { SaveUserDatesValues } from '../@types/global';

const appHomeOpened = async (args: SlackEventMiddlewareArgs<'app_home_opened'> & AllMiddlewareArgs) => {
  const { client, event, logger } = args;
  const { channel, tab, type, user: userId } = event;
  logger.debug('appHomeController: appHomeOpened called', { event: { channel, tab, type, userId } });

  if (tab === 'messages') {
    // TODO: Do something when user opens message tab?
    // await say(`Hello world, and welcome <@${event.user}>!`);
  }
  if (tab === 'home') {
    await appHomeService.appHomeOpened({ id: userId }, client, logger);
  }

  logger.debug('appHomeController: appHomeOpened completed');
};

const manageUserDates = async (args: SlackActionMiddlewareArgs & AllMiddlewareArgs) => {
  const { ack, action, body, client, logger } = args;
  const { trigger_id: triggerId, user } = body as BlockAction;
  logger.debug('appHomeController: manageUserDates called', { action, triggerId, user });

  await ack();
  await appHomeService.manageUserDates(triggerId, user, client, logger);

  logger.debug('appHomeController: manageUserDates completed');
};

const saveUserDates = async (args: SlackViewMiddlewareArgs & AllMiddlewareArgs) => {
  const { ack, body, client, logger } = args;
  const { user, view } = body;
  const {
    state: { values },
  } = view;
  logger.debug('appHomeController: saveUserDates called', { user, values });

  await ack();
  await appHomeService.saveUserDates(user, values as SaveUserDatesValues, client, logger);

  logger.debug('appHomeController: saveUserDates completed');
};

export default {
  appHomeOpened,
  manageUserDates,
  saveUserDates,
};
