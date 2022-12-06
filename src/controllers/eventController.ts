import { eventService } from '../services';
import logger from '../utils/logger';
import { appHome } from '../views';
import type { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';

export type AppHomeOpenedArgs = SlackEventMiddlewareArgs<'app_home_opened'> & AllMiddlewareArgs;
const appHomeOpened = async (args: AppHomeOpenedArgs) => {
  const { event, client } = args;
  const { channel, tab, type, user: userId } = event;
  logger.debug('eventController: appHomeOpened called', { event: { channel, tab, type, userId } });

  if (tab === 'messages') {
    // TODO: Do something when user opens message tab?
    // await say(`Hello world, and welcome <@${event.user}>!`);
  }

  if (tab === 'home') {
    const { user } = await eventService.appHomeOpened(userId);
    const options = { user_id: userId, view: appHome.getView(user) };

    try {
      await client.views.publish(options);
    } catch (error) {
      logger.error('eventController: appHomeOpened views.publish error', { error });
    }
  }
};

export type AppMentionArgs = SlackEventMiddlewareArgs<'app_mention'> & AllMiddlewareArgs;
const appMention = async (args: AppMentionArgs) => {
  const { event } = args;
  const { channel, type, user: userId } = event;
  logger.debug('eventController: appMention called', { event: { channel, type, userId } });

  // TODO: Need to send msg when someone calls JassBot and act on action/command they send.
};

export type MemberJoinedChannelArgs = SlackEventMiddlewareArgs<'member_joined_channel'> & AllMiddlewareArgs;
const memberJoinedChannel = async (args: MemberJoinedChannelArgs) => {
  const { event } = args;
  const { channel, type, user: userId } = event;
  logger.debug('eventController: memberJoinedChannel called', { event: { channel, type, userId } });

  // TODO: Need to keep track when JassBot joins channel.
  // TODO: Need to send msg if user does not have birthday or work anniversary set.
};

export type MemberLeftChannelArgs = SlackEventMiddlewareArgs<'member_left_channel'> & AllMiddlewareArgs;
const memberLeftChannel = async (args: MemberLeftChannelArgs) => {
  const { event } = args;
  const { channel, type, user: userId } = event;
  logger.debug('eventController: memberLeftChannel called', { event: { channel, type, userId } });

  // TODO: Need to keep track when JassBot leaves channel.
};

export default { appHomeOpened, appMention, memberJoinedChannel, memberLeftChannel };
