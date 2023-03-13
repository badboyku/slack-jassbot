import config from '../utils/config';
import channelService from './channelService';
import userService from './userService';
import type { Channel } from '../db/models/ChannelModel';
import type { User } from '../db/models/UserModel';

type AppHomeOpenedResult = { user: User };
const appHomeOpened = async (userId: string): Promise<AppHomeOpenedResult> => {
  const user = await userService.findOneOrCreateByUserId(userId);

  return { user };
};

type MemberJoinedChannelResult = { channel: Channel };
const memberJoinedChannel = async (
  userId: string,
  channelId: string,
  channelType: string,
): Promise<MemberJoinedChannelResult> => {
  const {
    slack: { botUserId },
  } = config;

  const data = { isMember: userId === botUserId, isPrivate: channelType === 'G' };
  const channel = await channelService.findOneAndUpdateByChannelId(channelId, data);

  return { channel };
};

export default { appHomeOpened, memberJoinedChannel };
