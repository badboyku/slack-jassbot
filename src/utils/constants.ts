/* istanbul ignore file */
import type { Sort } from '@types';

// Database
export const DEFAULT_DB_BATCH_SIZE = 100;
export const DEFAULT_DB_LIMIT = 100;
export const DEFAULT_DB_SORT: Sort = { _id: 1 };
export const DEFAULT_DB_FIND_OPTIONS = { batchSize: DEFAULT_DB_BATCH_SIZE, limit: DEFAULT_DB_LIMIT, sort: undefined };
export const DB_MAX_BATCH_SIZE = 1000;
export const DB_MAX_LIMIT = 1000;

// Logger
export const LOG_FORMATS = { DEV: 'DEV', ELK: 'ELK' };
export const LOG_LEVELS = { DEBUG: 'DEBUG', INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR' };
export const LOG_LEVELS_NUM = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };

// Slack
export const DEFAULT_SLACK_GET_LIMIT = 1000;
