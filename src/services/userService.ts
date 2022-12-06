import { UserModel } from '../db/models';
import { FindOneError, SaveError } from '../errors';
import logger from '../utils/logger';
import type { User } from '../db/models/UserModel';

const findUser = async (filter: { userId: string }, throwError = false): Promise<User> => {
  logger.debug('userService: findUser called', { filter });

  let user: User = null;
  try {
    user = await UserModel.findOne(filter).exec();
  } catch (error) {
    logger.error('userService: findUser failed', { error });

    if (throwError) {
      const { message: msg } = (error as Error) || {};

      throw new FindOneError(`userService: findUser error${msg ? `: ${msg}` : ''}`);
    }
  }

  if (user) {
    logger.debug('userService: findUser success', { user });
  }

  return user;
};

const createUser = async (data: { userId: string }, throwError = false): Promise<User> => {
  logger.debug('userService: createUser called', data);

  const user = new UserModel({ ...data });
  try {
    await user.save();

    logger.debug('userService: createUser success', { user });
  } catch (error) {
    logger.error('userService: createUser failed', { error });

    if (throwError) {
      const { message: msg } = (error as Error) || {};

      throw new SaveError(`userService: createUser error${msg ? `: ${msg}` : ''}`);
    }
  }

  return user;
};

const findOrCreateUser = async (userId: string): Promise<User> => {
  logger.debug('userService: findOrCreateUser called', { userId });

  let user = await findUser({ userId });
  if (!user) {
    user = await createUser({ userId });
  }

  return user;
};

type UpdateUserData = {
  birthMonth?: number;
  birthDay?: number;
  workAnniversaryMonth?: number;
  workAnniversaryDay?: number;
  workAnniversaryYear?: number;
};
const updateUser = async (userId: string, data: UpdateUserData, throwError = false): Promise<User> => {
  logger.debug('userService: updateUser called', { userId, data });

  const user = await findOrCreateUser(userId);
  if (user) {
    const { birthMonth, birthDay, workAnniversaryMonth, workAnniversaryDay, workAnniversaryYear } = data;

    user.birthMonth = birthMonth || null;
    user.birthDay = birthDay || null;
    user.workAnniversaryMonth = workAnniversaryMonth || null;
    user.workAnniversaryDay = workAnniversaryDay || null;
    user.workAnniversaryYear = workAnniversaryYear || null;

    try {
      await user.save();

      logger.debug('userService: updateUser success', { user });
    } catch (error) {
      logger.error('userService: updateUser failed', { error });

      if (throwError) {
        const { message: msg } = (error as Error) || {};

        throw new SaveError(`userService: updateUser error${msg ? `: ${msg}` : ''}`);
      }
    }
  }

  return user;
};

export default { findOrCreateUser, updateUser };
