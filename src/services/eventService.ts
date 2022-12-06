import logger from '../utils/logger';
import userService from './userService';
import type { User } from '../db/models/UserModel';

type AppHomeOpenedResult = { user: User };
const appHomeOpened = async (userId: string): Promise<AppHomeOpenedResult> => {
  logger.debug('appHomeService: appHomeOpened called', { userId });

  const user = await userService.findOrCreateUser(userId);

  return { user };
};

export default { appHomeOpened };
