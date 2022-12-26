import { DateTime } from 'luxon';
import logger from '../utils/logger';
import userService from './userService';
import type { ViewStateValues } from '../@types/global';
import type { User } from '../db/models/UserModel';

type SaveUserDatesResult = { user: User; hasSaveError: boolean };
const saveUserDates = async (userId: string, values: ViewStateValues): Promise<SaveUserDatesResult> => {
  logger.debug('viewService: saveUserDates called', { userId, values });

  const {
    birthday: {
      datepicker: { selected_date: birthdayValue },
    },
    workAnniversary: {
      datepicker: { selected_date: workAnniversaryValue },
    },
  } = values;

  // TODO: sanitize values

  const birthdayDate = birthdayValue ? DateTime.fromISO(birthdayValue.toString()) : undefined;
  const workAnniversaryDate = workAnniversaryValue ? DateTime.fromISO(workAnniversaryValue.toString()) : undefined;

  const birthdayData = birthdayDate ? { birthMonth: birthdayDate.month, birthDay: birthdayDate.day } : undefined;
  const workAnniversaryData = workAnniversaryDate
    ? {
        workAnniversaryMonth: workAnniversaryDate.month,
        workAnniversaryDay: workAnniversaryDate.day,
        workAnniversaryYear: workAnniversaryDate.year,
      }
    : undefined;

  const user = await userService.updateUser(userId, { ...birthdayData, ...workAnniversaryData });

  return { user, hasSaveError: !user };
};

export default { saveUserDates };
