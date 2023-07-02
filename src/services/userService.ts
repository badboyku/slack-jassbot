import { UserModel } from '@db/models';
import { dbJassbot } from '@db/sources';
import { logger, mongodb } from '@utils';
import type { Filter, FindOneAndUpdateOptions } from 'mongodb';
import type { UserData, UserModel as UserModelType } from '@types';

const findAll = async (filter: Filter<UserData>): Promise<UserModelType[]> => {
  logger.debug('userService: findAll called', { filter });

  const collection = dbJassbot.getUserCollection();
  const options = { limit: 1000 };
  let all: UserModelType[] = [];
  let after: string | undefined;
  let hasMore = false;

  do {
    const findParams = { ...(after ? { after } : {}) };
    // eslint-disable-next-line no-await-in-loop
    const { result, pageInfo } = await mongodb.find(collection, filter, options, findParams, UserModel);

    if (result.length > 0) {
      all = [...all, ...(result as UserModelType[])];
    }

    after = pageInfo?.endCursor;
    hasMore = pageInfo?.hasNextPage ?? false;
  } while (hasMore);

  return all;
};

const findOneAndUpdateByUserId = (
  userId: string,
  data?: UserData,
  options?: FindOneAndUpdateOptions,
): Promise<UserModelType | undefined> => {
  logger.debug('userService: findOneAndUpdateByUserId called', { userId, data, options });

  const filter = { userId };
  const update = { $set: data };

  return mongodb
    .findOneAndUpdate(dbJassbot.getUserCollection(), filter, update, options, UserModel)
    .then(({ doc, error }) => (!error && doc ? doc : undefined));
};

export default { findAll, findOneAndUpdateByUserId };
