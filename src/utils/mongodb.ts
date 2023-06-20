import { ObjectId, ReturnDocument } from 'mongodb';
import { logger } from '@utils';
import { DB_LIMIT_DEFAULT, DB_LIMIT_MAX, DB_SORT_DEFAULT } from '@utils/constants';
import type {
  AnyBulkWriteOperation,
  BulkWriteOptions,
  BulkWriteResult,
  Collection,
  DeleteOptions,
  DeleteResult,
  Document,
  Filter,
  FindOneAndUpdateOptions,
  FindOptions,
  InsertOneOptions,
  InsertOneResult,
  MatchKeysAndValues,
  ModifyResult,
  MongoBulkWriteError,
  MongoError,
  MongoServerError,
  OptionalUnlessRequiredId,
  Sort,
  SortDirection,
  UpdateFilter,
} from 'mongodb';
import type { BulkWrite, DeleteMany, FindOne, FindOneAndUpdate, FindParams, InsertOne } from '@types';

const bulkWrite = (
  collection: Collection,
  operations: AnyBulkWriteOperation[],
  options?: BulkWriteOptions,
): Promise<BulkWrite> | BulkWrite => {
  logger.debug('mongodb: bulkWrite called', {
    collection: collection.collectionName,
    numOperations: operations.length,
    options,
  });
  if (!operations.length) {
    return {};
  }

  return collection
    .bulkWrite(operations, options)
    .then((result: BulkWriteResult) => ({ result }))
    .catch((error: MongoBulkWriteError) => {
      logger.warn('mongodb: bulkWrite failed', { error });

      return { error };
    });
};

const deleteMany = (
  collection: Collection,
  filter?: Filter<Document>,
  options?: DeleteOptions,
): Promise<DeleteMany> => {
  logger.debug('mongodb: deleteMany called', { collection: collection.collectionName, filter, options });

  return collection
    .deleteMany(filter, options)
    .then((result: DeleteResult) => ({ result }))
    .catch((error: MongoError) => {
      logger.warn('mongodb: deleteMany failed', { error });

      return { error };
    });
};

const find = async (
  collection: Collection,
  filter: Filter<Document>,
  options?: FindOptions,
  params?: FindParams,
  toModelFunction?: (doc: never) => {},
) => {
  logger.debug('mongodb: find called', { collection, filter, options, params });

  const getIdFilter = (afterId?: string, beforeId?: string) => {
    if (afterId) {
      return { _id: { $gt: ObjectId.createFromHexString(afterId) } };
    }
    if (beforeId) {
      return { _id: { $lt: ObjectId.createFromHexString(beforeId) } };
    }

    return undefined;
  };

  const getLimit = (limitParam?: number, limitOption?: number) => {
    return Math.min(limitParam || limitOption || DB_LIMIT_DEFAULT, DB_LIMIT_MAX);
  };

  const getSort = (sortParam?: string, sortOption?: Sort, beforeParam?: string) => {
    if (sortParam) {
      const sortDirection: SortDirection = beforeParam ? -1 : 1;

      return { [sortParam]: sortDirection };
    }
    if (sortOption) {
      return sortOption;
    }

    return DB_SORT_DEFAULT;
  };

  const findFilter = { ...filter, ...getIdFilter(params?.after, params?.before) };
  const findOptions = {
    ...options,
    limit: getLimit(params?.limit, options?.limit),
    sort: getSort(params?.sort, options?.sort, params?.before),
  };

  const cursor = collection.find(findFilter, findOptions);

  const data: Document[] = [];
  for await (const doc of cursor) {
    data.push(toModelFunction ? toModelFunction(doc as never) : doc);
  }
  const metadata = data.length ? { startCursor: data.at(0)?._id, endCursor: data.at(-1)?._id } : undefined;

  return { data, metadata };
};

const findOne = (collection: Collection, filter: Filter<Document>, options?: FindOptions): Promise<FindOne> => {
  logger.debug('mongodb: findOne called', { collection: collection.collectionName, filter, options });

  return collection
    .findOne(filter, options)
    .then((result: Document | null) => ({ result }))
    .catch((error: MongoError) => {
      logger.warn('mongodb: findOne failed', { error });

      return { error };
    });
};

const findOneAndUpdate = (
  collection: Collection,
  filter: Filter<Document>,
  update: UpdateFilter<Document>,
  options?: FindOneAndUpdateOptions,
  addTimestamps = false,
): Promise<FindOneAndUpdate> => {
  logger.debug('mongodb: findOneAndUpdate called', {
    collection: collection.collectionName,
    filter,
    update,
    options,
    addTimestamps,
  });

  const getUpdateWithTimestamps = (origUpdate: UpdateFilter<Document>) => {
    if (!addTimestamps) {
      return origUpdate;
    }

    const now = new Date();

    const getSet = (origSet?: MatchKeysAndValues<Document>) => {
      const { updatedAt, ...rest } = origSet || {};

      return { ...rest, updatedAt: updatedAt || now };
    };

    const getSetOnInsert = (origSetOnInsert?: MatchKeysAndValues<Document>) => {
      const { createdAt, ...rest } = origSetOnInsert || {};

      return { ...rest, createdAt: createdAt || now };
    };

    return { ...origUpdate, $set: getSet(origUpdate?.$set), $setOnInsert: getSetOnInsert(origUpdate?.$setOnInsert) };
  };

  const getOptionsWithDefaults = (origOptions?: FindOneAndUpdateOptions) => {
    return { returnDocument: ReturnDocument.AFTER, upsert: true, ...origOptions };
  };

  return collection
    .findOneAndUpdate(filter, getUpdateWithTimestamps(update), getOptionsWithDefaults(options))
    .then((result: ModifyResult) => ({ doc: result.ok ? result.value : undefined, result }))
    .catch((error: MongoServerError) => {
      logger.warn('mongodb: findOneAndUpdate failed', { error });

      return { error };
    });
};

const insertOne = (
  collection: Collection,
  doc: OptionalUnlessRequiredId<Document>,
  options?: InsertOneOptions,
  addTimestamps = false,
): Promise<InsertOne> => {
  logger.debug('mongodb: insertOne called', { collection: collection.collectionName, doc, options, addTimestamps });

  const getDocWithTimestamps = (origDoc: OptionalUnlessRequiredId<Document>) => {
    const now = new Date();
    const { createdAt, updatedAt, ...rest } = origDoc || {};

    return { ...rest, createdAt: createdAt || now, updatedAt: updatedAt || now };
  };

  const newDoc = addTimestamps ? getDocWithTimestamps(doc) : doc;

  return collection
    .insertOne(newDoc, options)
    .then((result: InsertOneResult) => ({
      doc: result.acknowledged ? { _id: result.insertedId, ...newDoc } : undefined,
      result,
    }))
    .catch((error: MongoServerError) => {
      logger.warn('mongodb: insertOne failed', { error });

      return { error };
    });
};

export default { bulkWrite, deleteMany, find, findOne, findOneAndUpdate, insertOne };
