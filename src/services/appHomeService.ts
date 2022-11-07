import logger from '../utils/logger';
import userService from './userService';
import type { ViewStateValues } from '../@types/global';
import type { User } from '../db/models/UserModel';

const appHomeOpened = async (userId: string): Promise<{ user: User }> => {
  logger.debug('appHomeService: appHomeOpened called', { userId });

  const user = await userService.getOrCreateUser(userId);

  logger.debug('appHomeService: appHomeOpened completed');

  return { user };
};

const manageUserDates = async (userId: string): Promise<{ user: User }> => {
  logger.debug('appHomeService: manageUserDates called', { userId });

  const user = await userService.getOrCreateUser(userId);

  logger.debug('appHomeService: manageUserDates completed');

  return { user };
};

const saveUserDates = async (userId: string, values: ViewStateValues): Promise<{ user: User }> => {
  logger.debug('appHomeService: saveUserDates called', { userId, values });

  const {
    birthday: {
      datepicker: { selected_date: birthdayNew },
    },
    workAnniversary: {
      datepicker: { selected_date: workAnniversaryNew },
    },
  } = values;

  const user = await userService.updateUserDates(userId, birthdayNew, workAnniversaryNew);

  logger.debug('appHomeService: saveUserDates completed');

  return { user };
};

export default { appHomeOpened, manageUserDates, saveUserDates };
