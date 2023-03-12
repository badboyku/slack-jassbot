import type { ViewStateValue } from '@slack/bolt';

export type BulkWriteResults = {
  ok: number;
  nInserted: number;
  nUpserted: number;
  nMatched: number;
  nModified: number;
  nRemoved: number;
};

export type ViewStateValues = {
  [blockId: string]: {
    [actionId: string]: ViewStateValue;
  };
};

declare global {}
