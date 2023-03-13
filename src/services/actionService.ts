import userService from './userService';
import type { User } from '../db/models/UserModel';

type ManageUserDatesResult = { user: User };
const manageUserDates = async (userId: string): Promise<ManageUserDatesResult> => {
  const user = await userService.findOneOrCreateByUserId(userId);

  return { user };
};

export default { manageUserDates };
