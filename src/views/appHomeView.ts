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
            text: `Birthday: *${birthday}*`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Work Anniversary: *${workAnniversary}*`,
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
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '<- Back',
                emoji: true,
              },
              value: 'goBackAppHome',
              action_id: 'goBackAppHome',
            },
          ],
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Birthday: *${birthday}*`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Work Anniversary: *${workAnniversary}*`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Save',
                emoji: true,
              },
              value: 'save',
              action_id: 'saveUserDates',
            },
          ],
        },
      ],
    },
  };
};

export default { appHomeRoot, manageUserDates };
