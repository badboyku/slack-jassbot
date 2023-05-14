import { userService } from '@services';
import { crypto, dateTime } from '@utils';
import type { SaveUserDatesResult, ViewStateValues } from '@types';

const saveUserDates = async (userId: string, values: ViewStateValues): Promise<SaveUserDatesResult> => {
  const birthdayValue = values?.birthday?.datepicker?.selected_date?.toString() || '';
  const birthdayDate = dateTime.getDateTimeFromIso(birthdayValue);
  const birthday = birthdayDate?.toISODate() || '';
  const birthdayLookup = birthdayDate?.toFormat('LL-dd') || '';

  const workAnniversaryValue = values?.workAnniversary?.datepicker?.selected_date?.toString() || '';
  const workAnniversaryDate = dateTime.getDateTimeFromIso(workAnniversaryValue);
  const workAnniversary = workAnniversaryDate?.toISODate() || '';
  const workAnniversaryLookup = workAnniversaryDate?.toFormat('LL-dd') || '';

  const data = {
    birthday: crypto.encrypt(birthday),
    birthdayLookup: crypto.createHmac(birthdayLookup),
    birthdayRaw: birthday, // TODO: Remove this!!!
    birthdayRawLookup: birthdayLookup, // TODO: Remove this!!!
    workAnniversary: crypto.encrypt(workAnniversary),
    workAnniversaryLookup: crypto.createHmac(workAnniversaryLookup),
    workAnniversaryRaw: workAnniversary, // TODO: Remove this!!!
    workAnniversaryRawLookup: workAnniversaryLookup, // TODO: Remove this!!!
  };
  const user = await userService.findOneAndUpdateByUserId(userId, data);

  return { user, hasSaveError: !user };
};

export default { saveUserDates };
