import {
  LOG_LEVEL_DEBUG,
  LOG_LEVEL_DEBUG_NUM,
  LOG_LEVEL_ERROR,
  LOG_LEVEL_ERROR_NUM,
  LOG_LEVEL_INFO,
  LOG_LEVEL_INFO_NUM,
  LOG_LEVEL_WARN,
  LOG_LEVEL_WARN_NUM,
} from '@utils/constants';

const getSeverityNum = (severity: string): number => {
  switch (severity) {
    case LOG_LEVEL_DEBUG:
      return LOG_LEVEL_DEBUG_NUM;
    case LOG_LEVEL_INFO:
      return LOG_LEVEL_INFO_NUM;
    case LOG_LEVEL_WARN:
      return LOG_LEVEL_WARN_NUM;
    case LOG_LEVEL_ERROR:
    default:
      return LOG_LEVEL_ERROR_NUM;
  }
};

export default { getSeverityNum };
