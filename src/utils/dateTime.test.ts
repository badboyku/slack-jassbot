import { DateTime } from 'luxon';
import { dateTime } from '@utils';

describe('utils dateTime', () => {
  const text = 'text';
  const datetime = 'datetime';
  let result: DateTime | undefined;

  describe('calling function getDateTime', () => {
    describe('successfully', () => {
      beforeEach(() => {
        jest.spyOn(DateTime, 'now').mockReturnValueOnce(datetime as never);

        result = dateTime.getDateTime();
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls DateTime.now', () => {
        expect(DateTime.now).toHaveBeenCalled();
      });

      it('returns dateTime', () => {
        expect(result).toEqual(datetime);
      });
    });
  });

  describe('calling function getDateTimeFromIso', () => {
    describe('successfully', () => {
      beforeEach(() => {
        jest.spyOn(DateTime, 'fromISO').mockReturnValueOnce(datetime as never);

        result = dateTime.getDateTimeFromIso(text);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls DateTime.fromISO', () => {
        expect(DateTime.fromISO).toHaveBeenCalledWith(text);
      });

      it('returns dateTime', () => {
        expect(result).toEqual(datetime);
      });
    });

    const testCases = [
      { test: 'empty', txt: '' },
      { test: 'undefined', txt: undefined },
    ];
    testCases.forEach(({ test, txt }) => {
      describe(`with text ${test}`, () => {
        beforeEach(() => {
          jest.spyOn(DateTime, 'fromISO');

          result = dateTime.getDateTimeFromIso(txt);
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('does not call DateTime.fromISO', () => {
          expect(DateTime.fromISO).not.toHaveBeenCalled();
        });

        it('returns undefined', () => {
          expect(result).toEqual(undefined);
        });
      });
    });
  });

  describe('calling function getDateTimeFromJSDate', () => {
    describe('successfully', () => {
      const date = new Date();
      const options = { zone: 'zone' };

      beforeEach(() => {
        jest.spyOn(DateTime, 'fromJSDate').mockReturnValueOnce(datetime as never);

        result = dateTime.getDateTimeFromJSDate(date, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls DateTime.fromJSDate', () => {
        expect(DateTime.fromJSDate).toHaveBeenCalledWith(date, options);
      });

      it('returns dateTime', () => {
        expect(result).toEqual(datetime);
      });
    });

    describe('with date undefined', () => {
      const date = undefined;

      beforeEach(() => {
        jest.spyOn(DateTime, 'fromJSDate');

        result = dateTime.getDateTimeFromJSDate(date);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('does not call DateTime.fromJSDate', () => {
        expect(DateTime.fromJSDate).not.toHaveBeenCalled();
      });

      it('returns undefined', () => {
        expect(result).toEqual(undefined);
      });
    });
  });
});
