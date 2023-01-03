import manageYourDates from './manageYourDates';
import type { ChatPostMessageArguments } from '@slack/web-api';

const getOptions = (channel: string): ChatPostMessageArguments => {
  return {
    channel,
    text: 'Hello everybody! I am here to help celebrate your fellow Zegonauts birthdays and work anniversaries.',
    blocks: [
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
        elements: [manageYourDates.getButton()],
      },
    ],
  };
};

export default { getOptions };
