import { userService } from '@services';
import type { ManageUserDatesResult } from '@types';

const manageUserDates = async (userId: string): Promise<ManageUserDatesResult> => {
  const user = await userService.findOneAndUpdateByUserId(userId);

  return { user };
};

export default { manageUserDates };
