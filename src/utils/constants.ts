/* istanbul ignore file */
import type { Sort } from '@types';

// Database
export const DB_BATCH_SIZE_DEFAULT = 100;
export const DB_BATCH_SIZE_MAX = 1000;
export const DB_LIMIT_DEFAULT = 100;
export const DB_LIMIT_MAX = 1000;
export const DB_SORT_DEFAULT: Sort = { _id: 1 };

// Logger
export const LOG_FORMATS = { DEV: 'DEV', ELK: 'ELK' };
export const LOG_LEVELS = { DEBUG: 'DEBUG', INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR' };
export const LOG_LEVELS_NUM = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };

// Slack
export const DEFAULT_SLACK_GET_LIMIT = 1000;
