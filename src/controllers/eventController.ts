import { eventService } from '@services';
import { logger } from '@utils';
import { appHome, channelWelcomeMessage } from '@views';
import type { AppHomeOpenedArgs, AppMentionArgs, MemberJoinedChannelArgs, MemberLeftChannelArgs } from '@types';

const appHomeOpened = async (args: AppHomeOpenedArgs) => {
  const { client, event } = args;
  const { channel, tab, user: userId } = event;

  if (tab === 'messages') {
    logger.debug('eventController: appHomeOpened called', { event: { channel, tab, userId } });
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

const appMention = async (args: AppMentionArgs) => {
  const { payload, event, message, body } = args;
  // const { channel, type, user: userId } = event;
  logger.debug('eventController: appMention called', { payload, event, message, body });

  // TODO: Need to send msg when someone calls JassBot and act on action/command they send.
  // TODO: when receiving an app mention, check if user has a bday and/or work anniversary set,
  //  and send msg to remind them to set it if missing
};

const memberJoinedChannel = async (args: MemberJoinedChannelArgs) => {
  const { client, event } = args;
  const { channel: channelId, channel_type: channelType, user: userId } = event;

  const { channel } = await eventService.memberJoinedChannel(userId, channelId, channelType);

  if (!channel) {
    return;
  }

  const { isMember } = channel;

  if (isMember) {
    const options = channelWelcomeMessage.getOptions(channelId);

    try {
      await client.chat.postMessage(options);
    } catch (error) {
      logger.warn('eventController: memberJoinedChannel chat.postMessage error', { error });
    }
  }
};

const memberLeftChannel = async (args: MemberLeftChannelArgs) => {
  const { payload, event, message, body } = args;
  // const { channel, type, user: userId } = event;
  logger.debug('eventController: memberLeftChannel called', { payload, event, message, body });

  // TODO: Need to keep track when JassBot leaves channel.
};

export default { appHomeOpened, appMention, memberJoinedChannel, memberLeftChannel };
