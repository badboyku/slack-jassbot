import { appHome, manageUserDates } from '@views';
import type { Button, HomeView } from '@slack/types';
import type { User } from '@types';

describe('views appHome', () => {
  describe('calling function getView', () => {
    const greetingSuccess =
      '*Hi there!* :smiley:\nUpdate your birthday and work anniversary by clicking the Manage Your Dates button below.';
    const greetingFailure =
      "*Oh no!* :scream:\nWe seem to be having issues retrieving your data, but don't worry it should show up eventually.";
    const birthdayStr = 'birthday';
    const workAnniversaryStr = 'workAnniversary';
    const birthdayDefault = '-----';
    const workAnniversaryDefault = '-----';
    const button = { foo: 'bar' };
    const getBlocks = (greeting: string, birthday: string, workAnniversary: string) => [
      { type: 'section', text: { type: 'mrkdwn', text: greeting } },
      { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
      { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
      { type: 'section', text: { type: 'mrkdwn', text: '*Birthday*' } },
      { type: 'section', text: { type: 'mrkdwn', text: birthday } },
      { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
      { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
      { type: 'section', text: { type: 'mrkdwn', text: '*Work Anniversary*' } },
      { type: 'section', text: { type: 'mrkdwn', text: workAnniversary } },
      { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
      { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
      { type: 'actions', block_id: 'appHomeActions', elements: [button] },
    ];
    let user: User;
    let view: HomeView;

    describe('successfully with user', () => {
      const blocks = getBlocks(greetingSuccess, birthdayStr, workAnniversaryStr);
      let toFormat: jest.Mock;

      beforeEach(() => {
        toFormat = jest.fn();
        toFormat.mockReturnValueOnce(birthdayStr);
        toFormat.mockReturnValueOnce(workAnniversaryStr);
        user = {
          getBirthdayDate: jest.fn().mockReturnValueOnce({ toFormat }),
          getWorkAnniversaryDate: jest.fn().mockReturnValueOnce({ toFormat }),
        } as unknown as User;
        jest.spyOn(manageUserDates, 'getButton').mockReturnValueOnce(button as unknown as Button);

        view = appHome.getView(user);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls user.getBirthdayDate', () => {
        expect(user?.getBirthdayDate).toHaveBeenCalled();
      });

      it('calls getBirthdayDate.toFormat', () => {
        expect(toFormat).toHaveBeenNthCalledWith(1, '`DDD`');
      });

      it('calls user.getWorkAnniversaryDate', () => {
        expect(user?.getWorkAnniversaryDate).toHaveBeenCalled();
      });

      it('calls getWorkAnniversaryDate.toFormat', () => {
        expect(toFormat).toHaveBeenNthCalledWith(2, '`DDD`');
      });

      it('calls manageUserDates.getButton', () => {
        expect(manageUserDates.getButton).toHaveBeenCalled();
      });

      it('returns type', () => {
        expect(view.type).toEqual('home');
      });

      it('returns blocks', () => {
        expect(view.blocks).toEqual(blocks);
      });
    });

    describe('with user=null', () => {
      const blocks = getBlocks(greetingFailure, birthdayDefault, workAnniversaryDefault);

      beforeEach(() => {
        user = null;
        jest.spyOn(manageUserDates, 'getButton').mockReturnValueOnce(button as unknown as Button);

        view = appHome.getView(user);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('returns blocks with greeting failure', () => {
        expect(view.blocks).toEqual(blocks);
      });
    });

    describe('with user having no birthday date', () => {
      const blocks = getBlocks(greetingSuccess, birthdayDefault, workAnniversaryStr);

      beforeEach(() => {
        user = {
          getBirthdayDate: jest.fn().mockReturnValueOnce({
            toFormat: jest.fn().mockReturnValueOnce(birthdayDefault),
          }),
          getWorkAnniversaryDate: jest.fn().mockReturnValueOnce({
            toFormat: jest.fn().mockReturnValueOnce(workAnniversaryStr),
          }),
        } as unknown as User;
        jest.spyOn(manageUserDates, 'getButton').mockReturnValueOnce(button as unknown as Button);

        view = appHome.getView(user);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('returns blocks with default birthday string', () => {
        expect(view.blocks).toEqual(blocks);
      });
    });

    describe('with user having no work anniversary date', () => {
      const blocks = getBlocks(greetingSuccess, birthdayStr, workAnniversaryDefault);

      beforeEach(() => {
        user = {
          getBirthdayDate: jest.fn().mockReturnValueOnce({
            toFormat: jest.fn().mockReturnValueOnce(birthdayStr),
          }),
          getWorkAnniversaryDate: jest.fn().mockReturnValueOnce({
            toFormat: jest.fn().mockReturnValueOnce(workAnniversaryDefault),
          }),
        } as unknown as User;
        jest.spyOn(manageUserDates, 'getButton').mockReturnValueOnce(button as unknown as Button);

        view = appHome.getView(user);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('returns blocks with default work anniversary string', () => {
        expect(view.blocks).toEqual(blocks);
      });
    });
  });
});
