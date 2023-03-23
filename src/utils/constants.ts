/* istanbul ignore file */
import type { Sort } from '../@types/global';

// Find options
export const DB_DEFAULT_BATCH_SIZE = 100;
export const DB_DEFAULT_LIMIT = 100;
export const DB_DEFAULT_SORT: Sort = { _id: 1 };
export const DB_DEFAULT_OPTIONS = { batchSize: DB_DEFAULT_BATCH_SIZE, limit: DB_DEFAULT_LIMIT, sort: undefined };
export const DB_MAX_BATCH_SIZE = 1000;
export const DB_MAX_LIMIT = 1000;

export const SLACK_DEFAULT_LIMIT = 1000;
