import type {ViewStateValue} from '@slack/bolt';

export type SlackUser = {
  id: string;
  name?: string;
  team_id?: string;
};

export type ViewStateValues = {
  [blockId: string]: {
    [actionId: string]: ViewStateValue;
  };
};

declare global {}
