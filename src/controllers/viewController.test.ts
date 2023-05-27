import { viewController } from '@controllers';
import { viewService } from '@services';
import { logger } from '@utils';
import { appHome, manageUserDates } from '@views';
import type { AllMiddlewareArgs, SlackViewMiddlewareArgs } from '@slack/bolt';
import type { HomeView } from '@slack/web-api';
import type { SaveUserDatesResult } from '@types';

jest.mock('@services/viewService');
jest.mock('@utils/logger/logger');
jest.mock('@views/appHome');
jest.mock('@views/manageUserDates');

describe('controllers view', () => {
  const userId = 'userId';
  const slackUser = { id: userId };
  const user = { userId };
  const values = { foo: 'values' };
  const hasSaveError = false;
  const saveResultOptions = { channel: userId };
  const homeView = { type: 'home' };
  const error = 'error';

  describe('calling function saveUserDates', () => {
    describe('successfully', () => {
      let client: { chat: { postMessage: jest.Mock } };

      beforeEach(async () => {
        client = { chat: { postMessage: jest.fn() } };
        const args = { view: { state: { values } }, body: { user: slackUser }, client };
        jest.spyOn(viewService, 'saveUserDates').mockResolvedValueOnce({ user, hasSaveError } as SaveUserDatesResult);
        jest.spyOn(manageUserDates, 'getSaveResult').mockReturnValueOnce(saveResultOptions);

        await viewController.saveUserDates(args as unknown as SlackViewMiddlewareArgs & AllMiddlewareArgs);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls viewService.saveUserDates', () => {
        expect(viewService.saveUserDates).toHaveBeenCalledWith(userId, values);
      });

      it('calls manageUserDates.getSaveResult', () => {
        expect(manageUserDates.getSaveResult).toHaveBeenCalledWith(userId, hasSaveError);
      });

      it('calls client.chat.postMessage', () => {
        expect(client.chat.postMessage).toHaveBeenCalledWith(saveResultOptions);
      });
    });

    describe('with error on client.chat.postMessage', () => {
      beforeEach(async () => {
        const args = {
          view: { state: { values } },
          body: { user: slackUser },
          client: {
            chat: {
              postMessage: jest.fn().mockImplementationOnce(() => {
                throw error;
              }),
            },
          },
        };
        jest.spyOn(viewService, 'saveUserDates').mockResolvedValueOnce({ user, hasSaveError } as SaveUserDatesResult);
        jest.spyOn(manageUserDates, 'getSaveResult').mockReturnValueOnce(saveResultOptions);

        await viewController.saveUserDates(args as unknown as SlackViewMiddlewareArgs & AllMiddlewareArgs);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('viewController: saveUserDates chat.postMessage error', { error });
      });
    });

    describe('with refreshAppHome=true', () => {
      const refreshAppHome = true;

      describe('successfully', () => {
        let client: { chat: { postMessage: jest.Mock }; views: { publish: jest.Mock } };

        beforeEach(async () => {
          client = { chat: { postMessage: jest.fn() }, views: { publish: jest.fn() } };
          const args = { view: { state: { values } }, body: { user: slackUser }, client };
          jest.spyOn(viewService, 'saveUserDates').mockResolvedValueOnce({ user, hasSaveError } as SaveUserDatesResult);
          jest.spyOn(manageUserDates, 'getSaveResult').mockReturnValueOnce(saveResultOptions);
          jest.spyOn(appHome, 'getView').mockReturnValueOnce(homeView as HomeView);

          await viewController.saveUserDates(
            args as unknown as SlackViewMiddlewareArgs & AllMiddlewareArgs,
            refreshAppHome,
          );
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('calls appHome.getView', () => {
          expect(appHome.getView).toHaveBeenCalledWith(user);
        });

        it('calls client.views.publish', () => {
          expect(client.views.publish).toHaveBeenCalledWith({ user_id: userId, view: homeView });
        });
      });

      describe('with error on client.views.publish', () => {
        beforeEach(async () => {
          const args = {
            view: { state: { values } },
            body: { user: slackUser },
            client: {
              chat: { postMessage: jest.fn() },
              views: {
                publish: jest.fn().mockImplementationOnce(() => {
                  throw error;
                }),
              },
            },
          };
          jest.spyOn(viewService, 'saveUserDates').mockResolvedValueOnce({ user, hasSaveError } as SaveUserDatesResult);
          jest.spyOn(manageUserDates, 'getSaveResult').mockReturnValueOnce(saveResultOptions);
          jest.spyOn(appHome, 'getView').mockReturnValueOnce(homeView as HomeView);

          await viewController.saveUserDates(
            args as unknown as SlackViewMiddlewareArgs & AllMiddlewareArgs,
            refreshAppHome,
          );
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('calls logger.warn', () => {
          expect(logger.warn).toHaveBeenCalledWith('viewController: saveUserDates views.publish error', { error });
        });
      });
    });
  });
});
