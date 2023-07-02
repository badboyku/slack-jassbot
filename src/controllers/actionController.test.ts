import { actionController } from '@controllers';
import { actionService } from '@services';
import { logger } from '@utils';
import { manageUserDates } from '@views';

jest.mock('@services/actionService');
jest.mock('@utils/logger/logger');
jest.mock('@views/manageUserDates');

describe('controllers action', () => {
  const blockId = 'blockId';
  const triggerId = 'triggerId';
  const userId = 'userId';
  const slackUser = { id: userId };
  const user = { userId };
  const modal = { type: 'modal' };
  const error = 'error';

  describe('calling function manageUserDates', () => {
    describe('successfully', () => {
      let client: { views: { open: jest.Mock } };

      beforeEach(async () => {
        client = { views: { open: jest.fn() } };
        const args = { action: { block_id: blockId }, body: { trigger_id: triggerId, user: slackUser }, client };
        jest.spyOn(actionService, 'manageUserDates').mockResolvedValueOnce({ user } as never);
        jest.spyOn(manageUserDates, 'getModal').mockReturnValueOnce(modal as never);

        await actionController.manageUserDates(args as never);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls actionService.manageUserDates', () => {
        expect(actionService.manageUserDates).toHaveBeenCalledWith(userId);
      });

      it('calls manageUserDates.getModal with callbackId=saveUserDates', () => {
        expect(manageUserDates.getModal).toHaveBeenCalledWith(user, 'saveUserDates');
      });

      it('calls client.views.open', () => {
        expect(client.views.open).toHaveBeenCalledWith({ trigger_id: triggerId, view: modal });
      });
    });

    describe('with blockId includes appHome', () => {
      beforeEach(async () => {
        const args = {
          action: { block_id: 'appHome' },
          body: { trigger_id: triggerId, user: slackUser },
          client: { views: { open: jest.fn() } },
        };
        jest.spyOn(actionService, 'manageUserDates').mockResolvedValueOnce({ user } as never);
        jest.spyOn(manageUserDates, 'getModal').mockReturnValueOnce(modal as never);

        await actionController.manageUserDates(args as never);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls manageUserDates.getModal with callbackId=saveUserDatesRefreshAppHome', () => {
        expect(manageUserDates.getModal).toHaveBeenCalledWith(user, 'saveUserDatesRefreshAppHome');
      });
    });

    describe('with error on client.views.open', () => {
      beforeEach(async () => {
        const args = {
          action: { block_id: 'appHome' },
          body: { trigger_id: triggerId, user: slackUser },
          client: {
            views: {
              open: jest.fn().mockImplementationOnce(() => {
                throw error;
              }),
            },
          },
        };
        jest.spyOn(actionService, 'manageUserDates').mockResolvedValueOnce({ user } as never);
        jest.spyOn(manageUserDates, 'getModal').mockReturnValueOnce(modal as never);

        await actionController.manageUserDates(args as never);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('actionController: manageUserDates views.open error', { error });
      });
    });
  });
});
