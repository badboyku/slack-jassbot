import type { ModalView } from '@slack/types';
import type { ChatPostMessageArguments } from '@slack/web-api';
import type { User } from '../db/models/UserModel';

const getButton = (actionId?: string) => {
  return {
    type: 'button',
    action_id: actionId || 'manageUserDates',
    text: { type: 'plain_text', text: 'Manage Your Dates :birthday: :tada:', emoji: true },
  };
};

const getModal = (user: User, callbackId?: string): ModalView => {
  return {
    type: 'modal',
    callback_id: callbackId || 'saveUserDates',
    title: { type: 'plain_text', text: 'Manage Your Dates' },
    blocks: [
      {
        type: 'input',
        block_id: 'birthday',
        label: { type: 'plain_text', text: 'Birthday :birthday:', emoji: true },
        element: {
          type: 'datepicker',
          action_id: 'datepicker',
          initial_date: user?.getNextBirthDate()?.toISODate() || undefined,
          placeholder: { type: 'plain_text', text: 'Select a date', emoji: true },
        },
        hint: { type: 'plain_text', text: 'Year is ignored', emoji: true },
        optional: true,
      },
      {
        type: 'input',
        block_id: 'workAnniversary',
        label: { type: 'plain_text', text: 'Work Anniversary :tada:', emoji: true },
        element: {
          type: 'datepicker',
          action_id: 'datepicker',
          initial_date: user?.getWorkAnniversaryDate()?.toISODate() || undefined,
          placeholder: { type: 'plain_text', text: 'Select a date', emoji: true },
        },
        optional: true,
      },
    ],
    submit: { type: 'plain_text', text: 'Save' },
  };
};

const getSaveResult = (userId: string, user: User, hasSaveError = false): ChatPostMessageArguments => {
  const nextBirthDate = user?.getNextBirthDate() || undefined;
  const nextBirthDateStr = nextBirthDate ? nextBirthDate.toFormat('MMMM d') : '-----';
  const workAnniversaryDate = user?.getWorkAnniversaryDate() || undefined;
  const workAnniversaryStr = workAnniversaryDate ? workAnniversaryDate.toFormat('DDD') : '-----';

  const fallbackText = hasSaveError
    ? 'On no! I seem to be having issues saving your data, cross your fingers and please try again.'
    : 'Thank you! I have saved your dates.';
  const greeting = hasSaveError ? 'Oh no! :scream:' : 'Thank you! :smiley:';
  const message = hasSaveError
    ? 'I seem to be having issues saving your data, cross your fingers and please try again.'
    : `I have saved your dates.\nBirthday: ${nextBirthDateStr}\nWork Anniversary: ${workAnniversaryStr}`;

  return {
    channel: userId,
    text: fallbackText,
    blocks: [
      { type: 'section', text: { type: 'mrkdwn', text: greeting } },
      { type: 'section', text: { type: 'mrkdwn', text: message } },
    ],
  };
};

export default { getButton, getModal, getSaveResult };