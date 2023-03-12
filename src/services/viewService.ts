import crypto from '../utils/crypto';
import datetime from '../utils/datetime';
import logger from '../utils/logger';
import userService from './userService';
import type { ViewStateValues } from '../@types/global';
import type { User } from '../db/models/UserModel';

type SaveUserDatesResult = { user: User; hasSaveError: boolean };
const saveUserDates = async (userId: string, values: ViewStateValues): Promise<SaveUserDatesResult> => {
  logger.debug('viewService: saveUserDates called', { userId });
  const {
    birthday: {
      datepicker: { selected_date: birthdayValue },
    },
    workAnniversary: {
      datepicker: { selected_date: workAnniversaryValue },
    },
  } = values;

  const birthdayDate = datetime.getDateTimeFromIso(birthdayValue?.toString() || '');
  const workAnniversaryDate = datetime.getDateTimeFromIso(workAnniversaryValue?.toString() || '');
  const birthday = birthdayDate?.toISODate() || '';
  const birthdayLookup = birthdayDate?.toFormat('LL-dd') || '';
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
