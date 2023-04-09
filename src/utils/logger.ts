/* eslint-disable no-console */
import { config } from '@utils';
import { loggerHelper } from '@utils/helpers';
import { LOG_FORMAT_DEV, LOG_LEVEL_DEBUG, LOG_LEVEL_ERROR, LOG_LEVEL_INFO, LOG_LEVEL_WARN } from '@utils/constants';

const skipLog = (severity: string): boolean =>
  loggerHelper.getSeverityNum(severity) < loggerHelper.getSeverityNum(config.app.logLevel);

export type LogContext = Record<string, unknown>;
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
