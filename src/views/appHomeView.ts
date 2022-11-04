import type { User } from '../@types/global';
import type { ViewsOpenArguments, ViewsPublishArguments } from '@slack/web-api';

const appHomeRoot = (user: User): ViewsPublishArguments => {
  const { id: userId, birthday, workAnniversary } = user;

  return {
    user_id: userId,
    view: {
      type: 'home',
      blocks: [
        { type: 'section', text: { type: 'mrkdwn', text: '*Birthday*' } },
        { type: 'section', text: { type: 'mrkdwn', text: `\`${birthday}\`` } },
        { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
        { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
        { type: 'section', text: { type: 'mrkdwn', text: '*Work Anniversary*' } },
        { type: 'section', text: { type: 'mrkdwn', text: `\`${workAnniversary}\`` } },
        { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
        { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
        {
          type: 'actions',
          block_id: 'manageUserDates',
          elements: [
            {
              type: 'button',
              action_id: 'manageUserDatesButton',
              text: { type: 'plain_text', text: 'Manage', emoji: true },
              value: 'manageUserDates',
            },
          ],
        },
      ],
    },
  };
};

const manageUserDates = (triggerId: string, user: User): ViewsOpenArguments => {
  const { birthday, workAnniversary } = user;

  return {
    trigger_id: triggerId,
    view: {
      type: 'modal',
      callback_id: 'saveUserDates',
      title: { type: 'plain_text', text: 'Manage Dates' },
      submit: { type: 'plain_text', text: 'Save' },
      blocks: [
        {
          type: 'input',
          block_id: 'birthdayInput',
          label: { type: 'plain_text', text: 'Birthday', emoji: true },
          element: {
            type: 'datepicker',
            action_id: 'birthdayDatepicker',
            initial_date: birthday,
            placeholder: { type: 'plain_text', text: 'Select a date', emoji: true },
          },
          hint: { type: 'plain_text', text: 'Year is ignored', emoji: true },
        },
        {
          type: 'input',
          block_id: 'workAnniversaryInput',
          label: { type: 'plain_text', text: 'Work Anniversary', emoji: true },
          element: {
            type: 'datepicker',
            action_id: 'workAnniversaryDatepicker',
            initial_date: workAnniversary,
            placeholder: { type: 'plain_text', text: 'Select a date', emoji: true },
          },
        },
      ],
    },
  };
};

export default { appHomeRoot, manageUserDates };
