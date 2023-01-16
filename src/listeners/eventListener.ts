import { eventController } from '../controllers';
import logger from '../utils/logger';
import type { AllMiddlewareArgs, SlackEventMiddlewareArgs } from '@slack/bolt';
import type {
  AppHomeOpenedArgs,
  AppMentionArgs,
  MemberJoinedChannelArgs,
  MemberLeftChannelArgs,
} from '../controllers/eventController';

const eventListener = async (args: SlackEventMiddlewareArgs & AllMiddlewareArgs) => {
  const { payload, event, message, body } = args;
  const { type } = event;

  switch (type) {
    case 'app_home_opened':
      await eventController.appHomeOpened(args as AppHomeOpenedArgs);
      break;
    case 'app_mention':
      await eventController.appMention(args as AppMentionArgs);
      break;
    case 'member_joined_channel':
      await eventController.memberJoinedChannel(args as MemberJoinedChannelArgs);
      break;
    case 'member_left_channel': // TODO: This event is not working!!!!
      await eventController.memberLeftChannel(args as MemberLeftChannelArgs);
      break;
    default:
      logger.warn('Unknown app event', { payload, event, message, body });
  }
};

export default eventListener;
