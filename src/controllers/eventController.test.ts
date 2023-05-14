import { eventController } from '@controllers';
import { eventService } from '@services';
import { logger } from '@utils';
import { appHome, channelWelcomeMessage } from '@views';
import type {
  AppHomeOpenedArgs,
  AppHomeOpenedResult,
  MemberJoinedChannelArgs,
  MemberJoinedChannelResult,
} from '@types';
import type { ChatPostMessageArguments, HomeView } from '@slack/web-api';

jest.mock('@services/eventService');
jest.mock('@utils/logger');
jest.mock('@views/appHome');
jest.mock('@views/channelWelcomeMessage');

describe('controllers event', () => {
  const channel = 'channel';
  const channelId = 'channelId';
  const channelType = 'channelType';
  const userId = 'userId';
  const user = { userId };
  const homeView = { type: 'home' };
  const error = 'error';

  describe('calling function appHomeOpened', () => {
    describe('with tab=home', () => {
      describe('successfully', () => {
        let client: { views: { publish: jest.Mock } };

        beforeEach(async () => {
          client = { views: { publish: jest.fn() } };
          const args = { client, event: { channel, tab: 'home', user: userId } };
          jest.spyOn(eventService, 'appHomeOpened').mockResolvedValueOnce({ user } as AppHomeOpenedResult);
          jest.spyOn(appHome, 'getView').mockReturnValueOnce(homeView as HomeView);

          await eventController.appHomeOpened(args as unknown as AppHomeOpenedArgs);
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('calls eventService.appHomeOpened', () => {
          expect(eventService.appHomeOpened).toHaveBeenCalledWith(userId);
        });

        it('calls client.views.publish', () => {
          expect(client.views.publish).toHaveBeenCalledWith({ user_id: userId, view: homeView });
        });
      });

      describe('with error on client.views.publish', () => {
        beforeEach(async () => {
          const args = {
            client: {
              views: {
                publish: jest.fn().mockImplementationOnce(() => {
                  throw error;
                }),
              },
            },
            event: { channel, tab: 'home', user: userId },
          };
          jest.spyOn(eventService, 'appHomeOpened').mockResolvedValueOnce({ user } as AppHomeOpenedResult);
          jest.spyOn(appHome, 'getView').mockReturnValueOnce(homeView as HomeView);

          await eventController.appHomeOpened(args as unknown as AppHomeOpenedArgs);
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('calls logger.warn', () => {
          expect(logger.warn).toHaveBeenCalledWith('eventController: appHomeOpened views.publish error', { error });
        });
      });
    });
  });

  describe('calling function memberJoinedChannel', () => {
    describe('successfully', () => {
      const options = { channel };
      let client: { chat: { postMessage: jest.Mock } };

      beforeEach(async () => {
        client = { chat: { postMessage: jest.fn() } };
        const args = { client, event: { channel: channelId, channel_type: channelType, user: userId } };
        jest
          .spyOn(eventService, 'memberJoinedChannel')
          .mockResolvedValueOnce({ channel: { isMember: true } } as MemberJoinedChannelResult);
        jest.spyOn(channelWelcomeMessage, 'getOptions').mockReturnValueOnce(options as ChatPostMessageArguments);

        await eventController.memberJoinedChannel(args as unknown as MemberJoinedChannelArgs);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls eventService.memberJoinedChannel', () => {
        expect(eventService.memberJoinedChannel).toHaveBeenCalledWith(userId, channelId, channelType);
      });

      it('calls channelWelcomeMessage.getOptions', () => {
        expect(channelWelcomeMessage.getOptions).toHaveBeenCalledWith(channelId);
      });

      it('calls client.chat.postMessage', () => {
        expect(client.chat.postMessage).toHaveBeenCalledWith(options);
      });
    });

    describe('with channel no returning from eventService.memberJoinedChannel', () => {
      let client: { chat: { postMessage: jest.Mock } };

      beforeEach(async () => {
        client = { chat: { postMessage: jest.fn() } };
        const args = { client, event: { channel: channelId, channel_type: channelType, user: userId } };
        jest
          .spyOn(eventService, 'memberJoinedChannel')
          .mockResolvedValueOnce({ channel: null } as MemberJoinedChannelResult);
        jest.spyOn(channelWelcomeMessage, 'getOptions');

        await eventController.memberJoinedChannel(args as unknown as MemberJoinedChannelArgs);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('does not call channelWelcomeMessage.getOptions', () => {
        expect(channelWelcomeMessage.getOptions).not.toHaveBeenCalled();
      });

      it('does not call client.chat.postMessage', () => {
        expect(client.chat.postMessage).not.toHaveBeenCalled();
      });
    });

    describe('with error on client.chat.postMessage', () => {
      const options = { channel };

      beforeEach(async () => {
        const args = {
          client: {
            chat: {
              postMessage: jest.fn().mockImplementationOnce(() => {
                throw error;
              }),
            },
          },
          event: { channel: channelId, channel_type: channelType, user: userId },
        };
        jest
          .spyOn(eventService, 'memberJoinedChannel')
          .mockResolvedValueOnce({ channel: { isMember: true } } as MemberJoinedChannelResult);
        jest.spyOn(channelWelcomeMessage, 'getOptions').mockReturnValueOnce(options as ChatPostMessageArguments);

        await eventController.memberJoinedChannel(args as unknown as MemberJoinedChannelArgs);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('eventController: memberJoinedChannel chat.postMessage error', {
          error,
        });
      });
    });
  });
});
