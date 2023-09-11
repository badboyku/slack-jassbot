import { ObjectId, ReturnDocument } from 'mongodb';
import { config, logger } from '@utils';
import {
  DB_LIMIT_DEFAULT,
  DB_LIMIT_MAX,
  DB_SKIP_DEFAULT,
  DB_SKIP_MAX,
  DB_SORT_BY_DEFAULT,
  DB_SORT_DIRECTION_DEFAULT,
  DB_SORT_DIRECTIONS,
} from '@utils/constants';
import type {
  AnyBulkWriteOperation,
  BulkWriteOptions,
  Collection,
  DeleteOptions,
  Document,
  Filter,
  FindOneAndUpdateOptions,
  FindOptions,
  InsertOneOptions,
  MatchKeysAndValues,
  MongoBulkWriteError,
  MongoError,
  MongoServerError,
  OptionalUnlessRequiredId,
  UpdateFilter,
} from 'mongodb';
import type {
  BulkWrite,
  DeleteMany,
  Find,
  FindOne,
  FindOneAndUpdate,
  FindParams,
  InsertOne,
  MongoModel,
  MongoTimestamps,
} from '@types';

/** private functions */
const getDocWithTimestamps = <T extends Document>(doc: T): T => {
  const nowDate = new Date();
  const { createdAt, updatedAt, deletedAt, ...rest } = doc;

  return {
    ...rest,
    createdAt: createdAt || nowDate,
    updatedAt: updatedAt || nowDate,
    deletedAt: deletedAt || null,
  } as unknown as T;
};

const getUpdateWithTimestamps = <T extends Document>(update: UpdateFilter<T>) => {
  const nowDate = new Date();

  const getSet = (set?: MatchKeysAndValues<T>) => {
    const { updatedAt, ...rest } = (set as MatchKeysAndValues<T> & MongoTimestamps) || {};

    return { ...rest, updatedAt: updatedAt || nowDate };
  };

  const getSetOnInsert = (setOnInsert?: MatchKeysAndValues<T>) => {
    const { createdAt, ...rest } = (setOnInsert as MatchKeysAndValues<T> & MongoTimestamps) || {};

    return { ...rest, createdAt: createdAt || nowDate };
  };

  return {
    ...update,
    $set: getSet(update?.$set),
    $setOnInsert: getSetOnInsert(update?.$setOnInsert),
  } as UpdateFilter<T>;
};

/** public functions */
const bulkWrite = async <T extends Document>(
  collection: Collection<T>,
  operations: AnyBulkWriteOperation<T>[],
  options?: BulkWriteOptions,
): Promise<BulkWrite> => {
  logger.debug('mongodb: bulkWrite called', {
    collectionName: collection.collectionName,
    numOps: operations.length,
    options,
  });
  if (!operations.length) {
    return {};
  }

  return collection
    .bulkWrite(operations, options)
    .then((result) => ({ result }))
    .catch((error: MongoBulkWriteError) => {
      const { code, writeErrors, result } = error;
      const { insertedCount, matchedCount, modifiedCount, deletedCount, upsertedCount } = result;
      logger.warn('mongodb: bulkWrite failed', {
        result: { insertedCount, matchedCount, modifiedCount, deletedCount, upsertedCount },
        error: { code, writeErrors },
      });

      return { error };
    });
};

const deleteMany = <T extends Document>(
  collection: Collection<T>,
  filter?: Filter<T>,
  options?: DeleteOptions,
): Promise<DeleteMany> => {
  logger.debug('mongodb: deleteMany called', { collectionName: collection.collectionName, filter, options });

  return collection
    .deleteMany(filter, options)
    .then((result) => ({ result }))
    .catch((error: MongoError) => {
      logger.warn('mongodb: deleteMany failed', { error });

      return { error };
    });
};

const find = async <T extends Document>(
  collection: Collection<T>,
  filter: Filter<T>,
  options?: FindOptions<T>,
  params?: FindParams,
  Model?: MongoModel<T>,
): Promise<Find<T>> => {
  logger.debug('mongodb: find called', {
    collectionName: collection.collectionName,
    filter,
    options,
    params,
    withModel: !!Model,
  });

  // Get limit option.
  const limit = Math.min(options?.limit || params?.limit || DB_LIMIT_DEFAULT, DB_LIMIT_MAX);

  // Get sort option.
  const sortDirection = params?.sortDirection || DB_SORT_DIRECTION_DEFAULT;
  const isSortDirectionAsc = sortDirection === DB_SORT_DIRECTIONS.ASC;
  const sort = options?.sort || { [DB_SORT_BY_DEFAULT]: isSortDirectionAsc ? 1 : -1 };

  // Get skip option.
  const skipMin = Math.min(options?.skip || params?.skip || DB_SKIP_DEFAULT, DB_SKIP_MAX);
  let skip = skipMin === 0 ? undefined : skipMin;

  // Get _id filter.
  let idFilter;
  if (params?.after) {
    idFilter = { _id: { [isSortDirectionAsc ? '$gt' : '$lt']: ObjectId.createFromHexString(params.after) } };
    skip = undefined; // If we have after param, then let's abandon the skip option.
  }

  const findFilter = { ...filter, ...idFilter };
  const findOptions = { ...options, limit: limit + 1, sort, skip };
  logger.debug('mongodb: find', { findFilter, findOptions });
  const cursor = collection.find(findFilter, findOptions);

  const docs: T[] = [];
  let hasMore = false;
  // eslint-disable-next-line no-restricted-syntax
  for await (const doc of cursor) {
    if (docs.length < limit) {
      docs.push((Model?.getModel ? Model.getModel(doc as T) : doc) as T);
    } else {
      hasMore = true;
    }
  }

  // Get total count and page info.
  let totalCount = 0;
  let pageInfo;
  if (docs.length) {
    // There is a limit here, so we don't count too many docs.
    // TODO: Need to test this with large data set.
    totalCount = await collection.countDocuments(filter, { limit: config.db.mongo.countDocsLimit });
    pageInfo = { pageInfo: { endCursor: docs.at(-1)?._id.toString(), hasNextPage: hasMore } };
  }

  return { result: docs, totalCount, ...pageInfo };
};

const findOne = <T extends Document>(
  collection: Collection<T>,
  filter: Filter<T>,
  options?: FindOptions,
  Model?: MongoModel<T>,
): Promise<FindOne<T>> => {
  logger.debug('mongodb: findOne called', {
    collectionName: collection.collectionName,
    filter,
    options,
    withModel: !!Model,
  });

  return collection
    .findOne(filter, options)
    .then((result) => ({ result: result && Model?.getModel ? Model.getModel(result) : result }))
    .catch((error: MongoError) => {
      logger.warn('mongodb: findOne failed', { error });

      return { error };
    });
};

const findOneAndUpdate = <T extends Document>(
  collection: Collection<T>,
  filter: Filter<T>,
  update: UpdateFilter<T>,
  options?: FindOneAndUpdateOptions,
  Model?: MongoModel<T>,
): Promise<FindOneAndUpdate<T>> => {
  logger.debug('mongodb: findOneAndUpdate called', {
    collectionName: collection.collectionName,
    filter,
    update,
    options,
    withModel: !!Model,
  });

  const updateFilter = Model?.addTimestamps() ? getUpdateWithTimestamps<T>(update) : update;
  const updateOptions = { returnDocument: ReturnDocument.AFTER, upsert: true, ...options };
  logger.debug('mongodb: findOneAndUpdate', { updateFilter, updateOptions });

  return collection
    .findOneAndUpdate(filter, updateFilter, updateOptions)
    .then((result) => {
      if (!result.ok || !result.value) {
        return { result };
      }

      return { doc: Model?.getModel ? Model.getModel(result.value as T) : (result.value as T), result };
    })
    .catch((error: MongoServerError) => {
      logger.warn('mongodb: findOneAndUpdate failed', { error });

      return { error };
    });
};

const insertOne = <T extends Document>(
  collection: Collection<T>,
  doc: OptionalUnlessRequiredId<T>,
  options?: InsertOneOptions,
  Model?: MongoModel<T>,
): Promise<InsertOne<T>> => {
  logger.debug('mongodb: insertOne called', {
    collectionName: collection.collectionName,
    doc,
    options,
    withModel: !!Model,
  });

  const newDoc = Model?.addTimestamps() ? getDocWithTimestamps(doc) : doc;
  logger.debug('mongodb: insertOne', { newDoc });

  return collection
    .insertOne(newDoc, options)
    .then((result) => {
      if (!result.acknowledged) {
        return { result };
      }

      const insertedDoc = { _id: result.insertedId, ...newDoc } as T;

      return { doc: Model?.getModel ? Model.getModel(insertedDoc) : insertedDoc, result };
    })
    .catch((error: MongoServerError) => {
      logger.warn('mongodb: insertOne failed', { error });

      return { error };
    });
};

export default { bulkWrite, deleteMany, find, findOne, findOneAndUpdate, insertOne };
