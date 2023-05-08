/* eslint-disable no-console */
import { config } from '@utils';
import { LOG_FORMATS, LOG_LEVELS } from '@utils/constants';
import { loggerHelper } from '@utils/helpers';
import type { LogContext, Logger } from '@types';

const { DEBUG, INFO, WARN, ERROR } = LOG_LEVELS;

const skipLog = (severity: string): boolean =>
  loggerHelper.getSeverityNum(severity) < loggerHelper.getSeverityNum(config.app.logLevel);

const getLogMessage = (severity: string, message: string, context?: LogContext): string => {
  const log = { severity, message, context };

  return config.app.logOutputFormat === LOG_FORMATS.DEV ? JSON.stringify(log, null, 4) : JSON.stringify(log);
};

const logger: Logger = {
  debug: (message: string, context?: LogContext) =>
    !skipLog(DEBUG) && console.debug(getLogMessage(DEBUG, message, context)),
  info: (message: string, context?: LogContext) =>
    !skipLog(INFO) && console.info(getLogMessage(INFO, message, context)),
  warn: (message: string, context?: LogContext) =>
    !skipLog(WARN) && console.warn(getLogMessage(WARN, message, context)),
  error: (message: string, context?: LogContext) =>
    !skipLog(ERROR) && console.error(getLogMessage(ERROR, message, context)),
};

export default logger;
