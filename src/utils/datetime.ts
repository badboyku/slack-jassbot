import {DateTime} from 'luxon';

const getBirthDate = (birthMonth: number | null, birthDay: number | null): DateTime | undefined => {
  if (!birthMonth || !birthDay) {
    return undefined;
  }

  const today = DateTime.now().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  const month = birthMonth.toString().padStart(2, '0');
  const day = birthDay.toString().padStart(2, '0');
  const birthDate = DateTime.fromISO(`${today.year}-${month}-${day}`);

  return birthDate < today ? birthDate.plus({ year: 1 }) : birthDate;
};

export { getBirthDate };
