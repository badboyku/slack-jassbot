import type { ViewStateValue } from '@slack/bolt';

export type ViewStateValues = {
  [blockId: string]: {
    [actionId: string]: ViewStateValue;
  };
};

declare global {}
