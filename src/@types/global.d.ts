import type { SortOrder } from 'mongoose';
import type { ViewStateValue } from '@slack/bolt';

export type BulkWriteResults =
  | {
      ok: number;
      nInserted: number;
      nUpserted: number;
      nMatched: number;
      nModified: number;
      nRemoved: number;
    }
  | undefined;

export type Sort =
  | string
  | { [key: string]: SortOrder | { $meta: 'textScore' } }
  | [string, SortOrder][]
  | undefined
  | null;
export type FindOptions = { batchSize?: number; limit?: number; sort?: Sort };

export type ViewStateValues = { [blockId: string]: { [actionId: string]: ViewStateValue } };

declare global {}
