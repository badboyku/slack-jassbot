import { channelService, eventService, userService } from '@services';
import { config } from '@utils';
import type { AppHomeOpenedResult, Channel, MemberJoinedChannelResult, User } from '@types';

jest.mock('@services/channelService');
jest.mock('@services/userService');
jest.mock('@utils/config');

describe('services event', () => {
  const configSlackDefault = { apiHost: '', appToken: '', botToken: '', botUserId: '', logLevel: 'INFO' };
  const channelId = 'channelId';
  const channelType = 'channelType';
  const channel = { channelId };
  const userId = 'userId';
  const user = { userId };

  describe('calling function appHomeOpened', () => {
    let result: AppHomeOpenedResult;

    describe('successfully', () => {
      beforeEach(async () => {
        jest.spyOn(userService, 'findOneOrCreateByUserId').mockResolvedValueOnce(user as User);

        result = await eventService.appHomeOpened(userId);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls userService.findOneOrCreateByUserId', () => {
        expect(userService.findOneOrCreateByUserId).toHaveBeenCalledWith(userId);
      });

      it('returns result', () => {
        expect(result).toEqual({ user });
      });
    });
  });

  describe('calling function memberJoinedChannel', () => {
    let result: MemberJoinedChannelResult;

    describe('successfully', () => {
      const data = { isMember: false, isPrivate: false };

      beforeEach(async () => {
        config.slack = configSlackDefault;
        jest.spyOn(channelService, 'findOneAndUpdateByChannelId').mockResolvedValueOnce(channel as Channel);

        result = await eventService.memberJoinedChannel(userId, channelId, channelType);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls channelService.findOneAndUpdateByChannelId', () => {
        expect(channelService.findOneAndUpdateByChannelId).toHaveBeenCalledWith(channelId, data);
      });

      it('returns result', () => {
        expect(result).toEqual({ channel });
      });
    });

    describe('with userId=slack.botUserId', () => {
      const data = { isMember: true, isPrivate: false };

      beforeEach(async () => {
        config.slack = { ...configSlackDefault, botUserId: userId };
        jest.spyOn(channelService, 'findOneAndUpdateByChannelId').mockResolvedValueOnce(channel as Channel);

        result = await eventService.memberJoinedChannel(userId, channelId, channelType);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls channelService.findOneAndUpdateByChannelId with isMember=true', () => {
        expect(channelService.findOneAndUpdateByChannelId).toHaveBeenCalledWith(channelId, data);
      });
    });

    describe("with channelType='G'", () => {
      const channelTypeG = 'G';
      const data = { isMember: false, isPrivate: true };

      beforeEach(async () => {
        config.slack = configSlackDefault;
        jest.spyOn(channelService, 'findOneAndUpdateByChannelId').mockResolvedValueOnce(channel as Channel);

        result = await eventService.memberJoinedChannel(userId, channelId, channelTypeG);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls channelService.findOneAndUpdateByChannelId with isPrivate=true', () => {
        expect(channelService.findOneAndUpdateByChannelId).toHaveBeenCalledWith(channelId, data);
      });
    });
  });
});
