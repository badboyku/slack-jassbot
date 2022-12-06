import type { HomeView } from '@slack/web-api';
import type { User } from '../db/models/UserModel';

const HEADER_WELCOME =
  '*Hi there!* :smiley:\nManage your birthday and work anniversary by clicking the manage button below.';
const HEADER_USER_NOT_FOUND =
  "*Oh no!* :scream:\nWe seem to be having issues retrieving your data, but don't worry it should show up eventually.";
const HEADER_USER_SAVE_ERROR =
  '*Oh no!* :scream:\nWe seem to be having issues saving your data, cross your fingers and please try again.';

const getView = (user: User, hasSaveError = false): HomeView => {
  let headerStr = HEADER_WELCOME;
  if (hasSaveError) {
    headerStr = HEADER_USER_SAVE_ERROR;
  } else if (!user) {
    headerStr = HEADER_USER_NOT_FOUND;
  }

  let nextBirthDateStr = '-----\n';
  let workAnniversaryStr = '-----\n';
  if (user) {
    const nextBirthDate = user.getNextBirthDate();
    if (nextBirthDate) {
      nextBirthDateStr = `\`${nextBirthDate.toFormat('MMMM d')}\``;
    }
    const workAnniversaryDate = user.getWorkAnniversaryDate();
    if (workAnniversaryDate) {
      workAnniversaryStr = `\`${workAnniversaryDate.toFormat('DDD')}\``;
    }
  }

  return {
    type: 'home',
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: headerStr } },
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
        block_id: 'appHomeManageUserDates',
        elements: [
          {
            type: 'button',
            action_id: 'manageUserDates',
            text: { type: 'plain_text', text: 'Manage', emoji: true },
          },
        ],
      },
    ],
  };
};

export default { getView };
