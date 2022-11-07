import { DateTime } from 'luxon';
import { UserModel } from '../db/models';
import logger from '../utils/logger';
import type { User } from '../db/models/UserModel';

const getUser = async (userId: string): Promise<User> => {
  logger.debug('userService: getUser called', { userId });

  const user = await UserModel.findOne({ userId }).exec();
  if (user) {
    logger.debug('Found user', { user });
  }

  return user;
};

const createUser = async (userId: string): Promise<User> => {
  logger.debug('userService: createUser called', { userId });

  const user = new UserModel({ userId });
  await user.save();
  logger.debug('Created user', { user });

  return user;
};

const getOrCreateUser = async (userId: string): Promise<User> => {
  logger.debug('userService: getOrCreateUser called', { userId });

  let user = await getUser(userId);
  if (!user) {
    user = await createUser(userId);
  }

  return user;
};

const updateUserDates = async (
  userId: string,
  birthday: string | null | undefined,
  workAnniversary: string | null | undefined,
): Promise<User> => {
  logger.debug('userService: updateUserDates called', { userId, birthday, workAnniversary });

  const user = await getUser(userId);
  if (user) {
    const birthDate = birthday ? DateTime.fromISO(birthday) : null;
    user.birthMonth = birthDate ? birthDate.month : null;
    user.birthDay = birthDate ? birthDate.day : null;
    user.workAnniversaryDate = workAnniversary ? DateTime.fromISO(workAnniversary).toJSDate() : null;

    await user.save();
    logger.debug('Updated user', { user });
  }

  return user;
};

export default { getUser, createUser, getOrCreateUser, updateUserDates };
