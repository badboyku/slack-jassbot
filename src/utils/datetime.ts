import { DateTime } from 'luxon';
import type { Zone } from 'luxon';

const getDateTimeFromIso = (text?: string): DateTime | undefined => {
  return text ? DateTime.fromISO(text) : undefined;
};

const getDateTimeFromJSDate = (date?: Date, options?: { zone?: string | Zone }): DateTime | undefined => {
  return date ? DateTime.fromJSDate(date, options) : undefined;
};

export default { getDateTimeFromIso, getDateTimeFromJSDate };
