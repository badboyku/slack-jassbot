import { eventService } from '../services';
import logger from '../utils/logger';
import { appHome, channelWelcomeMessage } from '../views';
import type { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';

export type AppHomeOpenedArgs = SlackEventMiddlewareArgs<'app_home_opened'> & AllMiddlewareArgs;
const appHomeOpened = async (args: AppHomeOpenedArgs) => {
  const { client, event } = args;
  const { channel, tab, user: userId } = event;
  logger.debug('eventController: appHomeOpened called', { event: { channel, tab, userId } });

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
      logger.warn('eventController: appHomeOpened views.publish error', { error });
    }
  }
};

export type AppMentionArgs = SlackEventMiddlewareArgs<'app_mention'> & AllMiddlewareArgs;
const appMention = async (args: AppMentionArgs) => {
  const { payload, event, message, body } = args;
  // const { channel, type, user: userId } = event;
  logger.debug('eventController: appMention called', { payload, event, message, body });

  // TODO: Need to send msg when someone calls JassBot and act on action/command they send.
  // TODO: when receiving an app mention, check if user has a bday and/or work anniversary set,
  //  and send msg to remind them to set it if missing
};

export type MemberJoinedChannelArgs = SlackEventMiddlewareArgs<'member_joined_channel'> & AllMiddlewareArgs;
const memberJoinedChannel = async (args: MemberJoinedChannelArgs) => {
  const { client, event } = args;
  const { channel: channelId, channel_type: channelType, user: userId } = event;
  logger.debug('eventController: memberJoinedChannel called', { event: { channelId, channelType, userId } });

  const { channel } = await eventService.memberJoinedChannel(userId, channelId, channelType);

  if (!channel) {
    return;
  }

  if (channel.isMember) {
    try {
      const options = channelWelcomeMessage.getOptions(channelId);
      await client.chat.postMessage(options);
    } catch (error) {
      logger.warn('eventController: memberJoinedChannel chat.postMessage error', { error });
    }
  }
};

export type MemberLeftChannelArgs = SlackEventMiddlewareArgs<'member_left_channel'> & AllMiddlewareArgs;
const memberLeftChannel = async (args: MemberLeftChannelArgs) => {
  const { payload, event, message, body } = args;
  // const { channel, type, user: userId } = event;
  logger.debug('eventController: memberLeftChannel called', { payload, event, message, body });

  // TODO: Need to keep track when JassBot leaves channel.
};

export default { appHomeOpened, appMention, memberJoinedChannel, memberLeftChannel };
