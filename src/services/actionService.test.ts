import { actionService, userService } from '@services';
import type { ManageUserDatesResult } from '@types';

jest.mock('@services/userService');

describe('services action', () => {
  const userId = 'userId';
  const user = { userId };

  describe('calling function manageUserDates', () => {
    let result: ManageUserDatesResult;

    describe('successfully', () => {
      beforeEach(async () => {
        jest.spyOn(userService, 'findOneAndUpdateByUserId').mockResolvedValueOnce(user as never);

        result = await actionService.manageUserDates(userId);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls userService.findOneAndUpdateByUserId', () => {
        expect(userService.findOneAndUpdateByUserId).toHaveBeenCalledWith(userId);
      });

      it('returns result', () => {
        expect(result).toEqual({ user });
      });
    });
  });
});
