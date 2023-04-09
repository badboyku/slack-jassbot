import { loggerHelper } from '@utils/helpers';

describe('utils/helpers loggerHelper', () => {
  describe('calling function getSeverityNum', () => {
    const testCases = [
      { severity: 'DEBUG', num: 0 },
      { severity: 'INFO', num: 1 },
      { severity: 'WARN', num: 2 },
      { severity: 'ERROR', num: 3 },
      { severity: 'unknown', num: 3 },
    ];
    testCases.forEach(({ severity, num }) => {
      describe(`with severity ${severity}`, () => {
        it(`returns severity num ${num}`, () => {
          expect(loggerHelper.getSeverityNum(severity)).toEqual(num);
        });
      });
    });
  });
});
