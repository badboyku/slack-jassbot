/* istanbul ignore file */
import config from './config';

export const DEV = 'DEV';

export const DEBUG = 'DEBUG';
export const INFO = 'INFO';
export const WARN = 'WARN';
export const ERROR = 'ERROR';

const getSeverityNum = (severity: string): number => {
  switch (severity) {
    case DEBUG:
      return 0;
    case INFO:
      return 1;
    case WARN:
      return 2;
    case ERROR:
      return 3;
    default:
      return -1;
  }
};

const doLog = (severity: string, message: string, context?: Record<string, unknown>, minLogLevel?: string) => {
  const {
    app: { logLevel, logOutputFormat },
  } = config;

  const severityNum = getSeverityNum(severity);
  const minSeverityNum = getSeverityNum(minLogLevel || logLevel);
  if (severityNum < minSeverityNum) {
    return;
  }

  const log = { severity, message, context };
  const logStringified = logOutputFormat === DEV ? JSON.stringify(log, null, 4) : JSON.stringify(log);

  // eslint-disable-next-line no-console
  console.log(logStringified);
};

export default {
  debug: (msg: string, context?: Record<string, unknown>, minLogLevel?: string) =>
    doLog(DEBUG, msg, context, minLogLevel),
  info: (msg: string, context?: Record<string, unknown>, minLogLevel?: string) =>
    doLog(INFO, msg, context, minLogLevel),
  warn: (msg: string, context?: Record<string, unknown>, minLogLevel?: string) =>
    doLog(WARN, msg, context, minLogLevel),
  error: (msg: string, context?: Record<string, unknown>, minLogLevel?: string) =>
    doLog(ERROR, msg, context, minLogLevel),
};
