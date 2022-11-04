export type SaveUserDatesValues = {
  birthdayInput: {
    birthdayDatepicker: { type: 'datepicker'; selected_date: string };
  };
  workAnniversaryInput: {
    workAnniversaryDatepicker: { type: 'datepicker'; selected_date: string };
  };
};

export type User = {
  id: string;
  username?: string;
  name?: string;
  team_id?: string;
  birthday?: string;
  workAnniversary?: string;
};

declare global {}
