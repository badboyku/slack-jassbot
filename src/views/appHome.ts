import manageYourDates from './manageYourDates';
import type { HomeView } from '@slack/web-api';
import type { User } from '../db/models/UserModel';

const getView = (user: User): HomeView => {
  const nextBirthDate = user?.getNextBirthDate() || undefined;
  const nextBirthDateStr = nextBirthDate ? `\`${nextBirthDate.toFormat('MMMM d')}\`` : '-----\n';
  const workAnniversaryDate = user?.getWorkAnniversaryDate() || undefined;
  const workAnniversaryStr = workAnniversaryDate ? `\`${workAnniversaryDate.toFormat('DDD')}\`` : '-----\n';

  const greeting = !user
    ? "*Oh no!* :scream:\nWe seem to be having issues retrieving your data, but don't worry it should show up eventually."
    : '*Hi there!* :smiley:\nUpdate your birthday and work anniversary by clicking the Manage Your Dates button below.';

  return {
    type: 'home',
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: greeting } },
      { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
      { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
      { type: 'section', text: { type: 'mrkdwn', text: '*Birthday*' } },
      { type: 'section', text: { type: 'mrkdwn', text: nextBirthDateStr } },
      { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
      { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
      { type: 'section', text: { type: 'mrkdwn', text: '*Work Anniversary*' } },
      { type: 'section', text: { type: 'mrkdwn', text: workAnniversaryStr } },
      { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
      { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
      {
        type: 'actions',
        block_id: 'appHomeActions',
        elements: [manageYourDates.getButton()],
      },
    ],
  };
};

export default { getView };
