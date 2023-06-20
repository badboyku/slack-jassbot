import { manageUserDates } from '@views';
import type { HomeView } from '@slack/web-api';
import type { UserModel } from '@types';

const getView = (user?: UserModel): HomeView => {
  const birthday = user?.getBirthdayDate()?.toFormat('`DDD`') || '-----';
  const workAnniversary = user?.getWorkAnniversaryDate()?.toFormat('`DDD`') || '-----';
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
      { type: 'section', text: { type: 'mrkdwn', text: birthday } },
      { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
      { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
      { type: 'section', text: { type: 'mrkdwn', text: '*Work Anniversary*' } },
      { type: 'section', text: { type: 'mrkdwn', text: workAnniversary } },
      { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
      { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
      {
        type: 'actions',
        block_id: 'appHomeActions',
        elements: [manageUserDates.getButton()],
      },
    ],
  };
};

export default { getView };
