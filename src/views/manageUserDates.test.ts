import { manageUserDates } from '@views';
import type { Button, Datepicker, InputBlock, ModalView } from '@slack/types';
import type { ChatPostMessageArguments } from '@slack/web-api';
import type { User } from '@types';

describe('views manageUserDates', () => {
  describe('calling function getButton', () => {
    let button: Button;

    describe('successfully', () => {
      beforeEach(() => {
        button = manageUserDates.getButton();
      });

      it('returns type', () => {
        expect(button.type).toEqual('button');
      });

      it('returns default action_id', () => {
        expect(button.action_id).toEqual('manageUserDates');
      });

      it('returns text', () => {
        expect(button.text).toEqual({ type: 'plain_text', text: 'Manage Your Dates :birthday: :tada:', emoji: true });
      });
    });

    describe('with actionId', () => {
      const actionId = 'actionId';

      beforeEach(() => {
        button = manageUserDates.getButton(actionId);
      });

      it('returns action_id', () => {
        expect(button.action_id).toEqual(actionId);
      });
    });
  });

  describe('calling function getModal', () => {
    let user: User = { getBirthdayDate: jest.fn(), getWorkAnniversaryDate: jest.fn() } as never;
    let modal: ModalView;
    let block1: InputBlock;
    let block1element: Datepicker;
    let block2: InputBlock;
    let block2element: Datepicker;

    describe('successfully with user', () => {
      const birthdayDate = 'birthdayDate';
      const workAnniversaryDate = 'workAnniversaryDate';
      let toISODate: jest.Mock;

      beforeEach(() => {
        toISODate = jest.fn();
        toISODate.mockReturnValueOnce(birthdayDate);
        toISODate.mockReturnValueOnce(workAnniversaryDate);
        user = {
          getBirthdayDate: jest.fn().mockReturnValueOnce({ toISODate }),
          getWorkAnniversaryDate: jest.fn().mockReturnValueOnce({ toISODate }),
        } as never;

        modal = manageUserDates.getModal(user);
        block1 = modal.blocks[0] as InputBlock;
        block1element = block1.element as Datepicker;
        block2 = modal.blocks[1] as InputBlock;
        block2element = block2.element as Datepicker;
      });

      it('calls user.getBirthdayDate', () => {
        expect(user?.getBirthdayDate).toHaveBeenCalled();
      });

      it('calls getBirthdayDate.toISODate', () => {
        expect(toISODate).toHaveBeenNthCalledWith(1);
      });

      it('calls user.getWorkAnniversaryDate', () => {
        expect(user?.getWorkAnniversaryDate).toHaveBeenCalled();
      });

      it('calls getWorkAnniversaryDate.toISODate', () => {
        expect(toISODate).toHaveBeenNthCalledWith(2);
      });

      it('returns type', () => {
        expect(modal.type).toEqual('modal');
      });

      it('returns default callback_id', () => {
        expect(modal.callback_id).toEqual('saveUserDates');
      });

      it('returns title', () => {
        expect(modal.title).toEqual({ type: 'plain_text', text: 'Manage Your Dates' });
      });

      it('returns 1st block type', () => {
        expect(block1.type).toEqual('input');
      });

      it('returns 1st block block_id', () => {
        expect(block1.block_id).toEqual('birthday');
      });

      it('returns 1st block label', () => {
        expect(block1.label).toEqual({ type: 'plain_text', text: 'Birthday :birthday:', emoji: true });
      });

      it('returns 1st block element type', () => {
        expect(block1element.type).toEqual('datepicker');
      });

      it('returns 1st block element action_id', () => {
        expect(block1element.action_id).toEqual('datepicker');
      });

      it('returns 1st block element initial_date with birthday iso date', () => {
        expect(block1element.initial_date).toEqual(birthdayDate);
      });

      it('returns 1st block element placeholder', () => {
        expect(block1element.placeholder).toEqual({ type: 'plain_text', text: 'Select a date', emoji: true });
      });

      it('returns 1st block optional', () => {
        expect(block1.optional).toEqual(true);
      });

      it('returns 2nd block type', () => {
        expect(block2.type).toEqual('input');
      });

      it('returns 2nd block block_id', () => {
        expect(block2.block_id).toEqual('workAnniversary');
      });

      it('returns 2nd block label', () => {
        expect(block2.label).toEqual({ type: 'plain_text', text: 'Work Anniversary :tada:', emoji: true });
      });

      it('returns 2nd block element type', () => {
        expect(block2element.type).toEqual('datepicker');
      });

      it('returns 2nd block element action_id', () => {
        expect(block2element.action_id).toEqual('datepicker');
      });

      it('returns 2nd block element initial_date with work anniversary iso date', () => {
        expect(block2element.initial_date).toEqual(workAnniversaryDate);
      });

      it('returns 2nd block element placeholder', () => {
        expect(block2element.placeholder).toEqual({ type: 'plain_text', text: 'Select a date', emoji: true });
      });

      it('returns 2nd block optional', () => {
        expect(block2.optional).toEqual(true);
      });

      it('returns submit', () => {
        expect(modal.submit).toEqual({ type: 'plain_text', text: 'Save' });
      });
    });

    describe('with user having no birthday date', () => {
      beforeEach(() => {
        modal = manageUserDates.getModal(user);
        block1 = modal.blocks[0] as InputBlock;
        block1element = block1.element as Datepicker;
      });

      it('returns default for 1st block element initial_date', () => {
        expect(block1element.initial_date).toEqual(undefined);
      });
    });

    describe('with user having no work anniversary date', () => {
      beforeEach(() => {
        modal = manageUserDates.getModal(user);
        block2 = modal.blocks[1] as InputBlock;
        block2element = block2.element as Datepicker;
      });

      it('returns default for 2nd block element initial_date', () => {
        expect(block2element.initial_date).toEqual(undefined);
      });
    });

    describe('with callbackId', () => {
      const callbackId = 'callback_id';

      beforeEach(() => {
        modal = manageUserDates.getModal(user, callbackId);
      });

      it('returns callback_id', () => {
        expect(modal.callback_id).toEqual(callbackId);
      });
    });
  });

  describe('calling function getSaveResult', () => {
    const userId = 'userId';
    let result: ChatPostMessageArguments;

    describe('successfully', () => {
      beforeEach(() => {
        result = manageUserDates.getSaveResult(userId);
      });

      it('returns channel', () => {
        expect(result.channel).toEqual(userId);
      });

      it('returns text', () => {
        expect(result.text).toEqual('Thank you! I have saved your dates.');
      });

      it('returns blocks', () => {
        expect(result.blocks).toEqual([
          { type: 'section', text: { type: 'mrkdwn', text: 'Thank you! :smiley:' } },
          { type: 'section', text: { type: 'mrkdwn', text: 'I have saved your dates.' } },
        ]);
      });
    });

    describe('with save error', () => {
      const hasSaveError = true;

      beforeEach(() => {
        result = manageUserDates.getSaveResult(userId, hasSaveError);
      });

      it('returns text', () => {
        expect(result.text).toEqual(
          'On no! I seem to be having issues saving your dates, cross your fingers and please try again.',
        );
      });

      it('returns blocks', () => {
        expect(result.blocks).toEqual([
          { type: 'section', text: { type: 'mrkdwn', text: 'Oh no! :scream:' } },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'I seem to be having issues saving your dates, cross your fingers and please try again.',
            },
          },
        ]);
      });
    });
  });
});
