import { userService } from '@services';
import type { ManageUserDatesResult } from '@types';

const manageUserDates = async (userId: string): Promise<ManageUserDatesResult> => {
  const user = await userService.findOneOrCreateByUserId(userId);

  return { user };
};

export default { manageUserDates };
