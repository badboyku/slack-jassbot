/* eslint-disable no-console */
import { config } from '@utils';
import {
  LOG_FORMAT_DEV,
  LOG_LEVEL_DEBUG,
  LOG_LEVEL_DEBUG_NUM,
  LOG_LEVEL_ERROR,
  LOG_LEVEL_ERROR_NUM,
  LOG_LEVEL_INFO,
  LOG_LEVEL_INFO_NUM,
  LOG_LEVEL_WARN,
  LOG_LEVEL_WARN_NUM,
} from '@utils/constants';
import type { LogContext } from '@types';

export const getSeverityNum = (severity: string): number => {
  switch (severity) {
    case LOG_LEVEL_DEBUG:
      return LOG_LEVEL_DEBUG_NUM; // 0
    case LOG_LEVEL_INFO:
      return LOG_LEVEL_INFO_NUM; // 1
    case LOG_LEVEL_WARN:
      return LOG_LEVEL_WARN_NUM; // 2
    case LOG_LEVEL_ERROR:
    default:
      return LOG_LEVEL_ERROR_NUM; // 3
  }
};

const skipLog = (severity: string): boolean => getSeverityNum(severity) < getSeverityNum(config.app.logLevel);

const getLogMessage = (severity: string, message: string, context?: LogContext): string => {
  const log = { severity, message, context };

  return config.app.logOutputFormat === LOG_FORMAT_DEV ? JSON.stringify(log, null, 4) : JSON.stringify(log);
};

export type Logger = {
  debug: (message: string, context?: LogContext) => void;
  info: (message: string, context?: LogContext) => void;
  warn: (message: string, context?: LogContext) => void;
  error: (message: string, context?: LogContext) => void;
};
const logger: Logger = {
  debug: (message: string, context?: LogContext) =>
    !skipLog(LOG_LEVEL_DEBUG) && console.debug(getLogMessage(LOG_LEVEL_DEBUG, message, context)),
  info: (message: string, context?: LogContext) =>
    !skipLog(LOG_LEVEL_INFO) && console.info(getLogMessage(LOG_LEVEL_INFO, message, context)),
  warn: (message: string, context?: LogContext) =>
    !skipLog(LOG_LEVEL_WARN) && console.warn(getLogMessage(LOG_LEVEL_WARN, message, context)),
  error: (message: string, context?: LogContext) =>
    !skipLog(LOG_LEVEL_ERROR) && console.error(getLogMessage(LOG_LEVEL_ERROR, message, context)),
};

export default logger;
