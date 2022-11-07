import {DateTime} from 'luxon';
import {getBirthDate} from '../utils/datetime';
import type {ViewsOpenArguments, ViewsPublishArguments} from '@slack/web-api';
import type {User, UserDocType} from '../db/models/UserModel';

const appHomeRoot = (userId: string, user: User): ViewsPublishArguments => {
  const { birthMonth, birthDay, workAnniversaryDate } = user as UserDocType;

  const birthDate = getBirthDate(birthMonth, birthDay);
  const birthDayStr = birthDate ? `\`${birthDate.toFormat('MMMM d')}\`` : '\n';
  const workAnniversaryStr = workAnniversaryDate
    ? `\`${DateTime.fromJSDate(workAnniversaryDate).toFormat('DDD')}\``
    : '\n';

  return {
    user_id: userId,
    view: {
      type: 'home',
      blocks: [
        { type: 'section', text: { type: 'mrkdwn', text: '*Birthday*' } },
        { type: 'section', text: { type: 'mrkdwn', text: `${birthDayStr}` } },
        { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
        { type: 'section', text: { type: 'mrkdwn', text: '\n' } },
        { type: 'section', text: { type: 'mrkdwn', text: '*Work Anniversary*' } },
        { type: 'section', text: { type: 'mrkdwn', text: `${workAnniversaryStr}` } },
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
    },
  };
};

const manageUserDates = (triggerId: string, user: User): ViewsOpenArguments => {
  const { birthMonth, birthDay, workAnniversaryDate } = user as UserDocType;

  const birthDate = getBirthDate(birthMonth, birthDay);
  const birthdayStr = birthDate ? birthDate.toISODate() : undefined;
  const workAnniversaryStr = workAnniversaryDate ? DateTime.fromJSDate(workAnniversaryDate).toISODate() : undefined;

  return {
    trigger_id: triggerId,
    view: {
      type: 'modal',
      callback_id: 'saveUserDates',
      title: { type: 'plain_text', text: 'Manage Dates' },
      blocks: [
        {
          type: 'input',
          block_id: 'birthday',
          label: { type: 'plain_text', text: 'Birthday', emoji: true },
          element: {
            type: 'datepicker',
            action_id: 'datepicker',
            initial_date: birthdayStr,
            placeholder: { type: 'plain_text', text: 'Select a date', emoji: true },
          },
          hint: { type: 'plain_text', text: 'Year is ignored', emoji: true },
          optional: true,
        },
        {
          type: 'input',
          block_id: 'workAnniversary',
          label: { type: 'plain_text', text: 'Work Anniversary', emoji: true },
          element: {
            type: 'datepicker',
            action_id: 'datepicker',
            initial_date: workAnniversaryStr,
            placeholder: { type: 'plain_text', text: 'Select a date', emoji: true },
          },
          optional: true,
        },
      ],
      submit: { type: 'plain_text', text: 'Save' },
    },
  };
};

export default { appHomeRoot, manageUserDates };
