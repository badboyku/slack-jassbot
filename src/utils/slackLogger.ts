/* istanbul ignore file */
import { LogLevel } from '@slack/bolt';
import logger from './logger';

type Msgs = Array<string | Record<string, unknown>>;

const getSlackLogger = (logLevel: LogLevel) => {
  const getLogMsg = (msgs: Msgs) => {
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
    debug: (...msgs: Msgs) => logger.debug(getLogMsg(msgs)),
    info: (...msgs: Msgs) => logger.info(getLogMsg(msgs)),
    warn: (...msgs: Msgs) => logger.warn(getLogMsg(msgs)),
    error: (...msgs: Msgs) => logger.error(getLogMsg(msgs)),
    setLevel: (_level: LogLevel) => {
      // Do nothing.
    },
    getLevel: () => logLevel,
    setName: (_name: string) => {
      // Do nothing.
    },
  };
};

const getSlackLogLevel = (logLevel: string) => {
  switch (logLevel) {
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

export { getSlackLogger, getSlackLogLevel };
