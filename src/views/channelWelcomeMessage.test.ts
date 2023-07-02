import { channelWelcomeMessage, manageUserDates } from '@views';
import type { ChatPostMessageArguments } from '@slack/web-api';

jest.mock('@views/manageUserDates');

describe('views channelWelcomeMessage', () => {
  describe('calling function getOptions', () => {
    const button = { foo: 'bar' };
    const channel = 'channel';
    let options: ChatPostMessageArguments;

    describe('successfully', () => {
      beforeEach(() => {
        jest.spyOn(manageUserDates, 'getButton').mockReturnValueOnce(button as never);

        options = channelWelcomeMessage.getOptions(channel);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls manageUserDates.getButton', () => {
        expect(manageUserDates.getButton).toHaveBeenCalled();
      });

      it('returns channel', () => {
        expect(options.channel).toEqual(channel);
      });

      it('returns text', () => {
        expect(options.text).toEqual(
          'Hello everybody! I am here to help celebrate your fellow Zegonauts birthdays and work anniversaries.',
        );
      });

      it('returns blocks', () => {
        expect(options.blocks).toEqual([
          { type: 'section', text: { type: 'mrkdwn', text: 'Hello everybody! :smiley:' } },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'I am here to help celebrate your fellow Zegonauts birthdays and work anniversaries.',
            },
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'If you feel like receiving a special message on your day, click the Manage Your Dates button below to set your birthday and work anniversary.',
            },
          },
          {
            type: 'section',
            text: { type: 'mrkdwn', text: 'Looking forward to celebrating with all of you! :partying_face:' },
          },
          {
            type: 'actions',
            block_id: 'channelWelcomeMessageActions',
            elements: [button],
          },
        ]);
      });
    });
  });
});
