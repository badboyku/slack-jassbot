/* istanbul ignore file */
import { LogLevel } from '@slack/bolt';
import config from './config';
import logger, { DEBUG, ERROR, INFO, WARN } from './logger';

const getLogMsg = (msgs: Array<string | Record<string, unknown>>) => {
  let message: string;
  let context: Record<string, unknown> | undefined;

  if (!msgs.length) {
    message = 'Unknown error occurred';
  } else if (msgs.length === 2) {
    message = msgs[0] as string;
    context = msgs[1] as Record<string, unknown>;
  } else {
    message = msgs[0] as string;
    msgs.shift();
    context = msgs.length ? { msgExtra: msgs } : undefined;
  }

  return { message, context };
};

const doLog = (severity: string, msgs: Array<string | Record<string, unknown>>) => {
  const {
    slack: { logLevel },
  } = config;
  const { message, context } = getLogMsg(msgs);

  switch (severity) {
    case DEBUG:
      logger.debug(message, context, logLevel);
      break;
    case INFO:
      logger.info(message, context, logLevel);
      break;
    case WARN:
      logger.warn(message, context, logLevel);
      break;
    case ERROR:
      logger.error(message, context, logLevel);
      break;
    default:
    // Do nothing.
  }
};

const slackLogger = {
  debug: (...msgs: Array<string | Record<string, unknown>>) => doLog(DEBUG, msgs),
  info: (...msgs: Array<string | Record<string, unknown>>) => doLog(INFO, msgs),
  warn: (...msgs: Array<string | Record<string, unknown>>) => doLog(WARN, msgs),
  error: (...msgs: Array<string | Record<string, unknown>>) => doLog(ERROR, msgs),
  setLevel: (_level: LogLevel) => {
    // Do nothing.
  },
  getLevel: () => LogLevel.INFO,
  setName: (_name: string) => {
    // Do nothing.
  },
};

export default slackLogger;
