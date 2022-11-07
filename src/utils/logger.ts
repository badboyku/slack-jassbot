/* istanbul ignore file */
import {LogLevel} from '@slack/bolt';
import winston, {format} from 'winston';
import config from './config';

export const getSlackLogLevel = () => {
  const {
    slack: { logLevel: slackLogLevel },
  } = config;

  switch (slackLogLevel) {
    case 'debug':
      return LogLevel.DEBUG;
    case 'warn':
      return LogLevel.WARN;
    case 'error':
      return LogLevel.ERROR;
    case 'info':
    default:
      return LogLevel.INFO;
  }
};

export const getSlackLogger = () => {
  const getLogMsg = (msgs: Array<string | Record<string, unknown>>) => {
    let message: string;
    let msgExtra: Record<string, unknown> | undefined;

    if (!msgs.length) {
      message = 'Unknown error occurred';
    } else if (msgs.length === 2) {
      message = msgs[0] as string;
      msgExtra = msgs[1] as Record<string, unknown>;
    } else {
      message = msgs[0] as string;
      msgs.shift();
      msgExtra = msgs.length ? { msgExtra: msgs } : undefined;
    }

    return { message, ...msgExtra };
  };

  return {
    debug: (...msgs: Array<string | Record<string, unknown>>) => logger.debug(getLogMsg(msgs)),
    info: (...msgs: Array<string | Record<string, unknown>>) => logger.info(getLogMsg(msgs)),
    warn: (...msgs: Array<string | Record<string, unknown>>) => logger.warn(getLogMsg(msgs)),
    error: (...msgs: Array<string | Record<string, unknown>>) => logger.error(getLogMsg(msgs)),
    setLevel: (_level: LogLevel) => {
      // Do nothing.
    },
    getLevel: () => getSlackLogLevel(),
    setName: (_name: string) => {
      // Do nothing.
    },
  };
};

const {
  app: { logLevel: appLogLevel },
} = config;
const { combine, prettyPrint, timestamp } = format;

const logger = winston.createLogger({
  level: appLogLevel,
  format: combine(timestamp(), prettyPrint({ depth: 8, colorize: true })),
  transports: [new winston.transports.Console()],
});

export default logger;
