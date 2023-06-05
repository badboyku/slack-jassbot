import { userService } from '@services';
import { crypto, dateTime } from '@utils';
import type { SaveUserDatesResult, ViewStateValues } from '@types';

const saveUserDates = async (userId: string, values: ViewStateValues): Promise<SaveUserDatesResult> => {
  const birthdayDate = dateTime.getDateTimeFromIso(values?.birthday?.datepicker?.selected_date?.toString() || '');
  const workAnniversaryDate = dateTime.getDateTimeFromIso(
    values?.workAnniversary?.datepicker?.selected_date?.toString() || '',
  );

  const data = {
    birthday: crypto.encrypt(birthdayDate?.toISODate() || ''),
    birthdayLookup: crypto.createHmac(birthdayDate?.toFormat('LL-dd') || ''),
    workAnniversary: crypto.encrypt(workAnniversaryDate?.toISODate() || ''),
    workAnniversaryLookup: crypto.createHmac(workAnniversaryDate?.toFormat('LL-dd') || ''),
  };
  const user = await userService.findOneAndUpdateByUserId(userId, data);

  return { user, hasSaveError: !user };
};

export default { saveUserDates };
