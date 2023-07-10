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
  UpdateFilter,
} from 'mongodb';
import type { BulkWrite, DeleteMany, Find, FindOne, FindOneAndUpdate, FindParams, InsertOne, MongoModel } from '@types';

/** private functions */
const getDocWithTimestamps = (doc: OptionalUnlessRequiredId<Document>) => {
  const nowDate = new Date();
  const { createdAt, updatedAt, deletedAt, ...rest } = doc;

  return { ...rest, createdAt: createdAt || nowDate, updatedAt: updatedAt || nowDate, deletedAt: deletedAt || null };
};

const getFindIdFilter = (after?: string, before?: string) => {
  if (after) {
    return { _id: { $gt: ObjectId.createFromHexString(after) } };
  }
  if (before) {
    return { _id: { $lt: ObjectId.createFromHexString(before) } };
  }

  return undefined;
};

const getFindPageInfo = (docs: Document[], hasMore: boolean, hasBeforeParam: boolean) => {
  if (!docs.length) {
    return undefined;
  }

  const id = docs.at(-1)?._id;
  const pageInfo = hasBeforeParam
    ? { startCursor: id.toString(), hasPreviousPage: hasMore }
    : { endCursor: id.toString(), hasNextPage: hasMore };

  return { pageInfo };
};

const getUpdateWithTimestamps = (update: UpdateFilter<Document>) => {
  const nowDate = new Date();

  const getSet = (set?: MatchKeysAndValues<Document>) => {
    const { updatedAt, ...rest } = set || {};

    return { ...rest, updatedAt: updatedAt || nowDate };
  };

  const getSetOnInsert = (setOnInsert?: MatchKeysAndValues<Document>) => {
    const { createdAt, ...rest } = setOnInsert || {};

    return { ...rest, createdAt: createdAt || nowDate };
  };

  return { ...update, $set: getSet(update?.$set), $setOnInsert: getSetOnInsert(update?.$setOnInsert) };
};

/** public functions */
const bulkWrite = (
  collection: Collection,
  operations: AnyBulkWriteOperation[],
  options?: BulkWriteOptions,
): Promise<BulkWrite> | BulkWrite => {
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
    .then((result: BulkWriteResult) => ({ result }))
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

const deleteMany = (
  collection: Collection,
  filter?: Filter<Document>,
  options?: DeleteOptions,
): Promise<DeleteMany> => {
  logger.debug('mongodb: deleteMany called', { collectionName: collection.collectionName, filter, options });

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
  Model?: MongoModel,
): Promise<Find> => {
  logger.debug('mongodb: find called', {
    collectionName: collection.collectionName,
    filter,
    options,
    params,
    withModel: !!Model,
  });

  const findFilter = { ...filter, ...getFindIdFilter(params?.after, params?.before) };
  const limit = Math.min(options?.limit || params?.limit || DB_LIMIT_DEFAULT, DB_LIMIT_MAX);
  const sort = options?.sort || { [params?.sort || DB_SORT_DEFAULT]: !params?.after && params?.before ? -1 : 1 };
  const findOptions = { ...options, limit: limit + 1, sort };
  const cursor = collection.find(findFilter, findOptions);

  const docs: Document[] = [];
  let hasMore = false;
  // eslint-disable-next-line no-restricted-syntax
  for await (const doc of cursor) {
    if (docs.length < limit) {
      docs.push(Model?.getModel ? Model.getModel(doc) : doc);
    } else {
      hasMore = true;
    }
  }

  return { result: docs, ...getFindPageInfo(docs, hasMore, Boolean(!params?.after && params?.before)) };
};

const findOne = (
  collection: Collection,
  filter: Filter<Document>,
  options?: FindOptions,
  Model?: MongoModel,
): Promise<FindOne> => {
  logger.debug('mongodb: findOne called', {
    collectionName: collection.collectionName,
    filter,
    options,
    withModel: !!Model,
  });

  return collection
    .findOne(filter, options)
    .then((result: Document | null) => ({ result: result && Model?.getModel ? Model.getModel(result) : result }))
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
  Model?: MongoModel,
): Promise<FindOneAndUpdate> => {
  logger.debug('mongodb: findOneAndUpdate called', {
    collectionName: collection.collectionName,
    filter,
    update,
    options,
    withModel: !!Model,
  });

  const updateFilter = Model?.addTimestamps() ? getUpdateWithTimestamps(update) : update;
  const updateOptions = { returnDocument: ReturnDocument.AFTER, upsert: true, ...options };

  return collection
    .findOneAndUpdate(filter, updateFilter, updateOptions)
    .then((result: ModifyResult) => {
      if (!result.ok || !result.value) {
        return { result };
      }

      return { doc: Model?.getModel ? Model.getModel(result.value) : result.value, result };
    })
    .catch((error: MongoServerError) => {
      logger.warn('mongodb: findOneAndUpdate failed', { error });

      return { error };
    });
};

const insertOne = (
  collection: Collection,
  doc: OptionalUnlessRequiredId<Document>,
  options?: InsertOneOptions,
  Model?: MongoModel,
): Promise<InsertOne> => {
  logger.debug('mongodb: insertOne called', {
    collectionName: collection.collectionName,
    doc,
    options,
    withModel: !!Model,
  });

  const newDoc = Model?.addTimestamps() ? getDocWithTimestamps(doc) : doc;

  return collection
    .insertOne(newDoc, options)
    .then((result: InsertOneResult) => {
      if (!result.acknowledged) {
        return { result };
      }

      const insertedDoc = { _id: result.insertedId, ...newDoc };

      return { doc: Model?.getModel ? Model.getModel(insertedDoc) : insertedDoc, result };
    })
    .catch((error: MongoServerError) => {
      logger.warn('mongodb: insertOne failed', { error });

      return { error };
    });
};

// TODO: add insertMany maybe?

export default { bulkWrite, deleteMany, find, findOne, findOneAndUpdate, insertOne };
