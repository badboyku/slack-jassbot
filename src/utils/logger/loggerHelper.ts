import { LOG_LEVELS, LOG_LEVELS_NUM } from '@utils/constants';

const { DEBUG, INFO, WARN, ERROR } = LOG_LEVELS;
const { DEBUG: DEBUG_NUM, INFO: INFO_NUM, WARN: WARN_NUM, ERROR: ERROR_NUM } = LOG_LEVELS_NUM;

const getSeverityNum = (severity: string): number => {
  switch (severity) {
    case DEBUG:
      return DEBUG_NUM;
    case INFO:
      return INFO_NUM;
    case WARN:
      return WARN_NUM;
    case ERROR:
    default:
      return ERROR_NUM;
  }
};

export default { getSeverityNum };
