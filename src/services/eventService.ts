import { channelService, userService } from '@services';
import { config } from '@utils';
import type { AppHomeOpenedResult, MemberJoinedChannelResult } from '@types';

const appHomeOpened = async (userId: string): Promise<AppHomeOpenedResult> => {
  const user = await userService.findOneOrCreateByUserId(userId);

  return { user };
};

const memberJoinedChannel = async (
  userId: string,
  channelId: string,
  channelType: string,
): Promise<MemberJoinedChannelResult> => {
  const data = { isMember: userId === config.slack.botUserId, isPrivate: channelType === 'G' };
  const channel = await channelService.findOneAndUpdateByChannelId(channelId, data);

  return { channel };
};

export default { appHomeOpened, memberJoinedChannel };
