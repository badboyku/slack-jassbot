import { userService, viewService } from '@services';
import { crypto, dateTime } from '@utils';
import type { DateTime } from 'luxon';
import type { SaveUserDatesResult, UserOld, ViewStateValues } from '@types';

jest.mock('@services/userService');
jest.mock('@utils/crypto');
jest.mock('@utils/dateTime');

describe('services view', () => {
  const userId = 'userId';
  const birthday = 'birthday';
  const birthdayValue = 'birthdayValue';
  const birthdayEncrypted = 'birthdayEncrypted';
  const birthdayLookup = 'birthdayLookup';
  const workAnniversary = 'workAnniversary';
  const workAnniversaryValue = 'workAnniversaryValue';
  const workAnniversaryEncrypted = 'workAnniversaryEncrypted';
  const workAnniversaryLookup = 'workAnniversaryLookup';
  const user = { userId };

  describe('calling function saveUserDates', () => {
    let birthdayDate: { toFormat: jest.Mock; toISODate: jest.Mock };
    let workAnniversaryDate: { toFormat: jest.Mock; toISODate: jest.Mock };
    let result: SaveUserDatesResult;

    describe('successfully', () => {
      const values = {
        birthday: {
          datepicker: { selected_date: birthdayValue },
        },
        workAnniversary: {
          datepicker: { selected_date: workAnniversaryValue },
        },
      };
      const data = {
        birthday: birthdayEncrypted,
        birthdayLookup,
        workAnniversary: workAnniversaryEncrypted,
        workAnniversaryLookup,
      };

      beforeEach(async () => {
        birthdayDate = { toISODate: jest.fn(() => birthday), toFormat: jest.fn(() => birthdayLookup) };
        workAnniversaryDate = {
          toISODate: jest.fn(() => workAnniversary),
          toFormat: jest.fn(() => workAnniversaryLookup),
        };
        jest
          .spyOn(dateTime, 'getDateTimeFromIso')
          .mockReturnValueOnce(birthdayDate as unknown as DateTime)
          .mockReturnValueOnce(workAnniversaryDate as unknown as DateTime);
        jest
          .spyOn(crypto, 'encrypt')
          .mockReturnValueOnce(birthdayEncrypted)
          .mockReturnValueOnce(workAnniversaryEncrypted);
        jest.spyOn(crypto, 'createHmac').mockReturnValueOnce(birthdayLookup).mockReturnValueOnce(workAnniversaryLookup);
        jest.spyOn(userService, 'findOneAndUpdateByUserId').mockResolvedValueOnce(user as UserOld);

        result = await viewService.saveUserDates(userId, values as unknown as ViewStateValues);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls dateTime.getDateTimeFromIso with birthday', () => {
        expect(dateTime.getDateTimeFromIso).toHaveBeenNthCalledWith(1, birthdayValue);
      });

      it('calls birthdayDate.toISODate', () => {
        expect(birthdayDate.toISODate).toHaveBeenCalled();
      });

      it('calls birthdayDate.toFormat', () => {
        expect(birthdayDate.toFormat).toHaveBeenCalledWith('LL-dd');
      });

      it('calls dateTime.getDateTimeFromIso with workAnniversary', () => {
        expect(dateTime.getDateTimeFromIso).toHaveBeenNthCalledWith(2, workAnniversaryValue);
      });

      it('calls workAnniversaryDate.toISODate', () => {
        expect(workAnniversaryDate.toISODate).toHaveBeenCalled();
      });

      it('calls workAnniversaryDate.toFormat', () => {
        expect(workAnniversaryDate.toFormat).toHaveBeenCalledWith('LL-dd');
      });

      it('calls crypto.encrypt with birthday', () => {
        expect(crypto.encrypt).toHaveBeenNthCalledWith(1, birthday);
      });

      it('calls crypto.createHmac with birthdayLookup', () => {
        expect(crypto.createHmac).toHaveBeenNthCalledWith(1, birthdayLookup);
      });

      it('calls crypto.encrypt with workAnniversary', () => {
        expect(crypto.encrypt).toHaveBeenNthCalledWith(2, workAnniversary);
      });

      it('calls crypto.createHmac with workAnniversaryLookup', () => {
        expect(crypto.createHmac).toHaveBeenNthCalledWith(2, workAnniversaryLookup);
      });

      it('calls userService.findOneAndUpdateByUserId', () => {
        expect(userService.findOneAndUpdateByUserId).toHaveBeenCalledWith(userId, data);
      });

      it('returns result', () => {
        expect(result).toEqual({ user, hasSaveError: false });
      });
    });

    describe('with values empty', () => {
      const values = {
        birthday: {
          datepicker: { selected_date: '' },
        },
        workAnniversary: {
          datepicker: { selected_date: '' },
        },
      };
      const data = {
        birthday: birthdayEncrypted,
        birthdayLookup,
        workAnniversary: workAnniversaryEncrypted,
        workAnniversaryLookup,
      };

      beforeEach(async () => {
        birthdayDate = { toISODate: jest.fn(), toFormat: jest.fn() };
        workAnniversaryDate = { toISODate: jest.fn(), toFormat: jest.fn() };
        jest.spyOn(dateTime, 'getDateTimeFromIso').mockReturnValueOnce(undefined).mockReturnValueOnce(undefined);
        jest
          .spyOn(crypto, 'encrypt')
          .mockReturnValueOnce(birthdayEncrypted)
          .mockReturnValueOnce(workAnniversaryEncrypted);
        jest.spyOn(crypto, 'createHmac').mockReturnValueOnce(birthdayLookup).mockReturnValueOnce(workAnniversaryLookup);
        jest.spyOn(userService, 'findOneAndUpdateByUserId').mockResolvedValueOnce(user as UserOld);

        result = await viewService.saveUserDates(userId, values as unknown as ViewStateValues);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls dateTime.getDateTimeFromIso with birthday as empty string', () => {
        expect(dateTime.getDateTimeFromIso).toHaveBeenNthCalledWith(1, '');
      });

      it('does not call birthdayDate.toISODate', () => {
        expect(birthdayDate.toISODate).not.toHaveBeenCalled();
      });

      it('does not call birthdayDate.toFormat', () => {
        expect(birthdayDate.toFormat).not.toHaveBeenCalled();
      });

      it('calls dateTime.getDateTimeFromIso with workAnniversary as empty string', () => {
        expect(dateTime.getDateTimeFromIso).toHaveBeenNthCalledWith(2, '');
      });

      it('does not call workAnniversaryDate.toISODate', () => {
        expect(workAnniversaryDate.toISODate).not.toHaveBeenCalled();
      });

      it('does not call workAnniversaryDate.toFormat', () => {
        expect(workAnniversaryDate.toFormat).not.toHaveBeenCalled();
      });

      it('calls crypto.encrypt with birthday as empty string', () => {
        expect(crypto.encrypt).toHaveBeenNthCalledWith(1, '');
      });

      it('calls crypto.createHmac with birthdayLookup as empty string', () => {
        expect(crypto.createHmac).toHaveBeenNthCalledWith(1, '');
      });

      it('calls crypto.encrypt with workAnniversary as empty string', () => {
        expect(crypto.encrypt).toHaveBeenNthCalledWith(2, '');
      });

      it('calls crypto.createHmac with workAnniversaryLookup as empty string', () => {
        expect(crypto.createHmac).toHaveBeenNthCalledWith(2, '');
      });

      it('calls userService.findOneAndUpdateByUserId', () => {
        expect(userService.findOneAndUpdateByUserId).toHaveBeenCalledWith(userId, data);
      });

      it('returns result', () => {
        expect(result).toEqual({ user, hasSaveError: false });
      });
    });
  });
});
