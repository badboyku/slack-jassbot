import {DateTime} from 'luxon';

const getBirthDate = (birthMonth: number | null, birthDay: number | null): DateTime | undefined => {
  if (!birthMonth || !birthDay) {
    return undefined;
  }

  const today = DateTime.now().set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
  const birthDateIsoStr = `${today.year}-${birthMonth.toString().padStart(2, '0')}-${birthDay
    .toString()
    .padStart(2, '0')}`;
  const birthDate = DateTime.fromISO(birthDateIsoStr);

  return birthDate < today ? birthDate.plus({ year: 1 }) : birthDate;
};

export { getBirthDate };
