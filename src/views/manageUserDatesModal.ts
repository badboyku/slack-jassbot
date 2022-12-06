import type { ModalView } from '@slack/types';
import type { User } from '../db/models/UserModel';

const getView = (user: User): ModalView => {
  let nextBirthDateStr;
  let workAnniversaryStr;
  if (user) {
    const nextBirthDate = user.getNextBirthDate();
    if (nextBirthDate) {
      nextBirthDateStr = nextBirthDate.toISODate();
    }
    const workAnniversaryDate = user.getWorkAnniversaryDate();
    if (workAnniversaryDate) {
      workAnniversaryStr = workAnniversaryDate.toISODate();
    }
  }

  return {
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
          initial_date: nextBirthDateStr,
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
  };
};

export default { getView };
