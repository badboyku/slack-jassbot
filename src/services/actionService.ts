import logger from '../utils/logger';
import userService from './userService';
import type { User } from '../db/models/UserModel';

type ManageUserDatesResult = { user: User };
const manageUserDates = async (userId: string): Promise<ManageUserDatesResult> => {
  logger.debug('appHomeService: manageUserDates called', { userId });

  const user = await userService.findOrCreateUser(userId);

  return { user };
};

export default { manageUserDates };
