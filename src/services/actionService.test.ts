import { actionService, userService } from '@services';
import type { ManageUserDatesResult, User } from '@types';

jest.mock('@services/userService');

describe('services action', () => {
  const userId = 'userId';
  const user = { userId };

  describe('calling function manageUserDates', () => {
    let result: ManageUserDatesResult;

    describe('successfully', () => {
      beforeEach(async () => {
        jest.spyOn(userService, 'findOneOrCreateByUserId').mockResolvedValueOnce(user as unknown as User);

        result = await actionService.manageUserDates(userId);
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
});
