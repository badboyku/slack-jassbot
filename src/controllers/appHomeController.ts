import {appHomeService} from '../services';
import type {AllMiddlewareArgs, SlackActionMiddlewareArgs, SlackEventMiddlewareArgs} from '@slack/bolt';

const appHomeOpened = (args: SlackEventMiddlewareArgs<'app_home_opened'> & AllMiddlewareArgs) => {
  const {
    client,
    event: { channel, tab, type, user: userId },
    logger,
  } = args;
  logger.debug('appHomeController: appHomeOpened called', { event: { channel, tab, type, userId } });

  if (tab === 'messages') {
    // TODO: Do something when user opens message tab?
    // await say(`Hello world, and welcome <@${event.user}>!`);
    return Promise<void>;
  }

  return appHomeService.appHomeOpened({ id: userId }, client, logger);
};

const goBackAppHome = async (args: SlackActionMiddlewareArgs & AllMiddlewareArgs) => {
  const {
    ack,
    action,
    body: { user },
    client,
    logger,
  } = args;
  logger.debug('appHomeController: goBackAppHome called', { action, user });

  await ack();

  return appHomeService.appHomeOpened(user, client, logger);
};

const manageUserDates = async (args: SlackActionMiddlewareArgs & AllMiddlewareArgs) => {
  const {
    ack,
    action,
    body: { user },
    client,
    logger,
  } = args;
  logger.debug('appHomeController: manageUserDates called', { action, user });

  await ack();

  return appHomeService.manageUserDates(user, client, logger);
};

export default { appHomeOpened, goBackAppHome, manageUserDates };
