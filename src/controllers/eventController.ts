import { appHomeService } from '../services';
import logger from '../utils/logger';
import { appHomeView } from '../views';
import type { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';

const appHomeOpened = async (args: SlackEventMiddlewareArgs<'app_home_opened'> & AllMiddlewareArgs) => {
  const { client, event } = args;
  const { channel, tab, type, user: userId } = event;
  logger.debug('eventController: appHomeOpened called', { event: { channel, tab, type, userId } });

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
      logger.error('eventController: appHomeOpened error', { error });
    }
  }

  logger.debug('eventController: appHomeOpened completed');
};

const appMention = async (args: SlackEventMiddlewareArgs<'app_mention'> & AllMiddlewareArgs) => {
  const { event } = args;
  const { channel, type, user: userId } = event;
  logger.debug('eventController: appMention called', { event: { channel, type, userId } });

  logger.debug('eventController: appMention completed');
};

const memberJoinedChannel = async (args: SlackEventMiddlewareArgs<'member_joined_channel'> & AllMiddlewareArgs) => {
  const { event } = args;
  const { channel, type, user: userId } = event;
  logger.debug('eventController: memberJoinedChannel called', { event: { channel, type, userId } });

  logger.debug('eventController: memberJoinedChannel completed');
};

const memberLeftChannel = async (args: SlackEventMiddlewareArgs<'member_left_channel'> & AllMiddlewareArgs) => {
  const { event } = args;
  const { channel, type, user: userId } = event;
  logger.debug('eventController: memberLeftChannel called', { event: { channel, type, userId } });

  logger.debug('eventController: memberLeftChannel completed');
};

export default { appHomeOpened, appMention, memberJoinedChannel, memberLeftChannel };
