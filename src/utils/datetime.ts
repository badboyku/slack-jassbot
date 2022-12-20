import { DateTime } from 'luxon';

const getNextBirthDate = (month: number | null, day: number | null): DateTime | undefined => {
  if (!month || !day) {
    return undefined;
  }

  const today = DateTime.now().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  const monthPad = month.toString().padStart(2, '0');
  const dayPad = day.toString().padStart(2, '0');
  const birthDate = DateTime.fromISO(`${today.year}-${monthPad}-${dayPad}`);

  return birthDate < today ? birthDate.plus({ year: 1 }) : birthDate;
};

const getWorkAnniversaryDate = (
  month: number | null,
  day: number | null,
  year: number | null,
): DateTime | undefined => {
  if (!month || !day || !year) {
    return undefined;
  }

  const monthPad = month.toString().padStart(2, '0');
  const dayPad = day.toString().padStart(2, '0');

  return DateTime.fromISO(`${year}-${monthPad}-${dayPad}`);
};

export default { getNextBirthDate, getWorkAnniversaryDate };
