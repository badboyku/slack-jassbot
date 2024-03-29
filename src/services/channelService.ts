import { ChannelModel } from '@db/models';
import { dbJassbot } from '@db/sources';
import { logger, mongodb } from '@utils';
import type { Filter, FindOneAndUpdateOptions } from 'mongodb';
import type { Channel } from '@types';

const findAll = async (filter: Filter<Channel>): Promise<Channel[]> => {
  logger.debug('channelService: findAll called', { filter });

  const collection = dbJassbot.getChannelCollection();
  const options = { limit: 1000 };
  let all: Channel[] = [];
  let after: string | undefined;
  let hasMore = false;

  do {
    const findParams = { ...(after ? { after } : {}) };
    // eslint-disable-next-line no-await-in-loop
    const { result, pageInfo } = await mongodb.find(collection, filter, options, findParams, ChannelModel);

    if (result.length > 0) {
      all = [...all, ...result];
    }

    after = pageInfo?.endCursor;
    hasMore = pageInfo?.hasNextPage ?? false;
  } while (hasMore);

  return all;
};

const findOneAndUpdateByChannelId = (
  channelId: string,
  data?: Partial<Channel>,
  options?: FindOneAndUpdateOptions,
): Promise<Channel | undefined> => {
  logger.debug('channelService: findOneAndUpdateByChannelId called', { channelId, data, options });

  const collection = dbJassbot.getChannelCollection();
  const filter = { channelId };
  const update = { $set: data };

  return mongodb
    .findOneAndUpdate(collection, filter, update, options, ChannelModel)
    .then(({ doc, error }) => (!error && doc ? doc : undefined));
};

export default { findAll, findOneAndUpdateByChannelId };
