/* istanbul ignore file */
import {LogLevel} from '@slack/bolt';
import logger from './logger';

const getSlackLogger = (logLevel: LogLevel) => {
  const getLogMsg = (msgs: string[]) => {
    const message = msgs.length ? msgs[0] : 'Unknown error occurred';
    msgs.shift();
    const msgExtra = msgs.length ? { msgExtra: msgs } : undefined;

    return { message, ...msgExtra };
  };

  return {
    debug: (...msgs: string[]) => logger.debug(getLogMsg(msgs)),
    info: (...msgs: string[]) => logger.info(getLogMsg(msgs)),
    warn: (...msgs: string[]) => logger.warn(getLogMsg(msgs)),
    error: (...msgs: string[]) => logger.error(getLogMsg(msgs)),
    setLevel: (level: LogLevel) => {},
    getLevel: () => logLevel,
    setName: (name: string) => {},
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
