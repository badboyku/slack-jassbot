import type { Sort } from '@types';

// Database
export const DEFAULT_DB_BATCH_SIZE = 100;
export const DEFAULT_DB_LIMIT = 100;
export const DEFAULT_DB_SORT: Sort = { _id: 1 };
export const DEFAULT_DB_FIND_OPTIONS = { batchSize: DEFAULT_DB_BATCH_SIZE, limit: DEFAULT_DB_LIMIT, sort: undefined };
export const DB_MAX_BATCH_SIZE = 1000;
export const DB_MAX_LIMIT = 1000;

// Logger
export const LOG_FORMAT_DEV = 'DEV';
export const LOG_FORMAT_ELK = 'ELK';
export const LOG_LEVEL_DEBUG = 'DEBUG';
export const LOG_LEVEL_DEBUG_NUM = 0;
export const LOG_LEVEL_INFO = 'INFO';
export const LOG_LEVEL_INFO_NUM = 1;
export const LOG_LEVEL_WARN = 'WARN';
export const LOG_LEVEL_WARN_NUM = 2;
export const LOG_LEVEL_ERROR = 'ERROR';
export const LOG_LEVEL_ERROR_NUM = 3;

// Slack
export const DEFAULT_SLACK_GET_LIMIT = 1000;
