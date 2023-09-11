/* istanbul ignore file */
// Database
export const DB_LIMIT_DEFAULT = 300;
export const DB_LIMIT_MAX = 1000;
export const DB_SKIP_DEFAULT = 0;
export const DB_SKIP_MAX = 1000;
export const DB_SORT_BY_DEFAULT = '_id';
export const DB_SORT_DIRECTIONS = { ASC: 'asc', DESC: 'desc' };
export const DB_SORT_DIRECTION_DEFAULT = DB_SORT_DIRECTIONS.ASC;

// Logger
export const LOG_FORMATS = { DEV: 'DEV', ELK: 'ELK' };
export const LOG_LEVELS = { DEBUG: 'DEBUG', INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR' };
export const LOG_LEVELS_NUM = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };

// Slack
export const SLACK_GET_LIMIT_DEFAULT = 999;

// User
export const USER_TZ_DEFAULT = 'America/Los_Angeles';
