import { LogLevel } from '@slack/bolt';
import { config, logger, loggerHelper } from '@utils';
import { LOG_LEVELS } from '@utils/constants';
import type { Logger } from '@slack/logger';
import type { LogContext } from '@types';

const { DEBUG, INFO, WARN, ERROR } = LOG_LEVELS;

const skipLog = (severity: string): boolean =>
  loggerHelper.getSeverityNum(severity) < loggerHelper.getSeverityNum(config.slack.logLevel);

const getLogMessageAndContext = (...msgs: string[]): [string, LogContext | undefined] => {
  const messages = [...msgs];
  let message = 'Unknown message';
  let context: LogContext | undefined;

  if (messages.length) {
    // eslint-disable-next-line prefer-destructuring
    message = messages[0];
    messages.shift();
    if (messages.length) {
      context = { msgExtra: messages };
    }

    const index = message.indexOf(':');
    if (index > -1) {
      const messageStr = message.slice(0, index).trim();
      const contextStr = message.slice(index + 1, message.length).trim();

      if (contextStr.startsWith('{') && contextStr.endsWith('}') && contextStr !== '{}') {
        try {
          const data = JSON.parse(contextStr);

          message = messageStr;
          context = { ...context, data };
        } catch (error) {
          // Do nothing.
        }
      }
    }
  }

  return [message, context];
};

const slackLogger: Logger = {
  debug: (...msgs: string[]) => !skipLog(DEBUG) && logger.debug(...getLogMessageAndContext(...msgs)),
  info: (...msgs: string[]) => !skipLog(INFO) && logger.info(...getLogMessageAndContext(...msgs)),
  warn: (...msgs: string[]) => !skipLog(WARN) && logger.warn(...getLogMessageAndContext(...msgs)),
  error: (...msgs: string[]) => !skipLog(ERROR) && logger.error(...getLogMessageAndContext(...msgs)),
  setLevel: /* istanbul ignore next */ (_level: LogLevel) => {
    // Do nothing.
  },
  getLevel: /* istanbul ignore next */ () => LogLevel.INFO,
  setName: /* istanbul ignore next */ (_name: string) => {
    // Do nothing.
  },
};

export default slackLogger;
