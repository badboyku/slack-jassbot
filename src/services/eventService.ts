import config from '../utils/config';
import logger from '../utils/logger';
import channelService from './channelService';
import userService from './userService';
import type { Channel } from '../db/models/ChannelModel';
import type { User } from '../db/models/UserModel';

type AppHomeOpenedResult = { user: User };
const appHomeOpened = async (userId: string): Promise<AppHomeOpenedResult> => {
  logger.debug('eventService: appHomeOpened called', { userId });

  const user = await userService.findOrCreateUser(userId);

  return { user };
};

type MemberJoinedChannelResult = { channel: Channel };
const memberJoinedChannel = async (
  userId: string,
  channelArg: { channelId: string; channelType: string; inviterId?: string },
): Promise<MemberJoinedChannelResult> => {
  logger.debug('appHomeService: memberJoinedChannel called', { userId, channel: channelArg });

  const { channelId, channelType, inviterId } = channelArg;
  const {
    slack: { botUserId },
  } = config;

  if (!channelId || !userId || userId !== botUserId) {
    return { channel: null };
  }

  const filter = { channelId };
  const update = { inviterId, isMember: true, isPrivate: channelType === 'G' };
  const channel = await channelService.findAndUpdateChannel(filter, update);

  return { channel };
};

export default { appHomeOpened, memberJoinedChannel };
