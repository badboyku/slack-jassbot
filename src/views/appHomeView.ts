import type { ViewsPublishArguments } from '@slack/web-api';
import type { User } from '../@types/global';

const appHomeRoot = (user: User): ViewsPublishArguments => {
  const { id: userId, birthday, workAnniversary } = user;

  return {
    user_id: userId,
    view: {
      type: 'home',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Birthday*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `\`${birthday}\``,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '\n',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '\n',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Work Anniversary*',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `\`${workAnniversary}\``,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '\n',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '\n',
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Manage',
                emoji: true,
              },
              value: 'manageUserDates',
              action_id: 'manageUserDates',
            },
          ],
        },
      ],
    },
  };
};

const manageUserDates = (user: User): ViewsPublishArguments => {
  const { id: userId, birthday, workAnniversary } = user;

  return {
    user_id: userId,
    view: {
      type: 'home',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Birthday* _(year is ignored)_',
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'datepicker',
              initial_date: '2023-04-28',
              placeholder: {
                type: 'plain_text',
                text: 'Select a date',
                emoji: true,
              },
              action_id: 'setUserBirthday',
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*Work Anniversary*',
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'datepicker',
              initial_date: '2023-04-28',
              placeholder: {
                type: 'plain_text',
                text: 'Select a date',
                emoji: true,
              },
              action_id: 'setUserWorkAnniversary',
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '\n',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '\n',
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Cancel',
                emoji: true,
              },
              value: 'cancelManageUserDates',
              action_id: 'cancelManageUserDates',
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Save',
                emoji: true,
              },
              style: 'primary',
              value: 'save',
              action_id: 'doneManageUserDates',
            },
          ],
        },
      ],
    },
  };
};

export default { appHomeRoot, manageUserDates };
