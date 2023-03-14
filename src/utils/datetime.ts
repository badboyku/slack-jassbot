import { DateTime } from 'luxon';
import type { Zone } from 'luxon';

const getDateTime = (): DateTime => {
  return DateTime.now();
};

const getDateTimeFromIso = (text?: string): DateTime | undefined => {
  return text ? DateTime.fromISO(text) : undefined;
};

const getDateTimeFromJSDate = (date?: Date, options?: { zone?: string | Zone }): DateTime | undefined => {
  return date ? DateTime.fromJSDate(date, options) : undefined;
};

export default { getDateTime, getDateTimeFromIso, getDateTimeFromJSDate };
