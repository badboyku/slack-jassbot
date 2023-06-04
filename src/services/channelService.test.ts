import { ObjectId } from 'mongodb';
import { ChannelModel } from '@db/models';
import { channelService } from '@services';
import { logger } from '@utils';
import {
  DB_BATCH_SIZE_DEFAULT,
  DB_BATCH_SIZE_MAX,
  DB_LIMIT_DEFAULT,
  DB_LIMIT_MAX,
  DB_SORT_DEFAULT,
} from '@utils/constants';
import type { AnyBulkWriteOperation, BulkWriteResult } from 'mongodb';
import type { Query } from 'mongoose';
import type { BulkWriteResults, Channel, ChannelData } from '@types';

jest.mock('@db/models/channelModel');
jest.mock('@utils/logger/logger');

describe('services channel', () => {
  const channel1 = { _id: '6471bdeb1eda180988fb5a19', channelId: 'foo' };
  const channel2 = { _id: '6471bee81eda180988fb5b0e', channelId: 'bar' };
  const error = 'error';

  describe('calling function bulkWrite', () => {
    const ops: AnyBulkWriteOperation<ChannelData>[] = [{ updateOne: { filter: {}, update: {} } }];
    let results: BulkWriteResults;

    describe('successfully', () => {
      const result = { ok: 1, insertedCount: 1, upsertedCount: 1, matchedCount: 1, modifiedCount: 1, deletedCount: 1 };

      beforeEach(async () => {
        jest.spyOn(ChannelModel, 'bulkWrite').mockResolvedValueOnce(result as unknown as BulkWriteResult);

        results = await channelService.bulkWrite(ops);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls ChannelModel.bulkWrite', () => {
        expect(ChannelModel.bulkWrite).toHaveBeenCalledWith(ops);
      });

      it('returns results', () => {
        expect(results).toEqual({ ...result });
      });
    });

    describe('with ops empty', () => {
      beforeEach(async () => {
        jest.spyOn(ChannelModel, 'bulkWrite');

        results = await channelService.bulkWrite([]);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('does not call ChannelModel.bulkWrite', () => {
        expect(ChannelModel.bulkWrite).not.toHaveBeenCalled();
      });

      it('returns undefined', () => {
        expect(results).toEqual(undefined);
      });
    });

    describe('with error on ChannelModel.bulkWrite', () => {
      beforeEach(async () => {
        jest.spyOn(ChannelModel, 'bulkWrite').mockRejectedValueOnce(error);

        results = await channelService.bulkWrite(ops);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('channelService: bulkWrite failed', { error });
      });

      it('returns undefined', () => {
        expect(results).toEqual(undefined);
      });
    });
  });

  describe('calling function create', () => {
    const data = { channelId: 'foo' };
    let result: Channel | Channel[] | null;

    describe('successfully', () => {
      beforeEach(async () => {
        jest.spyOn(ChannelModel, 'create').mockResolvedValueOnce(channel1 as unknown as Channel[]);

        result = await channelService.create(data);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls ChannelModel.create', () => {
        expect(ChannelModel.create).toHaveBeenCalledWith(data);
      });

      it('returns new channel', () => {
        expect(result).toEqual(channel1);
      });
    });

    describe('with error on ChannelModel.create', () => {
      beforeEach(async () => {
        jest.spyOn(ChannelModel, 'create').mockRejectedValueOnce(error);

        result = await channelService.create(data);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('channelService: create failed', { error });
      });

      it('returns null', () => {
        expect(result).toEqual(null);
      });
    });
  });

  describe('calling function find', () => {
    const filter = { isPrivate: true };
    let next: jest.Mock;
    let cursor: jest.Mock;
    let limit: jest.Mock;
    let sort: jest.Mock;
    let result: Channel[];

    describe('successfully with no options param', () => {
      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(channel1).mockReturnValueOnce(channel2).mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(ChannelModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await channelService.find(filter);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls ChannelModel.find', () => {
        expect(ChannelModel.find).toHaveBeenCalledWith(filter);
      });

      it('calls sort with undefined', () => {
        expect(sort).toHaveBeenCalledWith(undefined);
      });

      it('calls limit with DB_LIMIT_DEFAULT', () => {
        expect(limit).toHaveBeenCalledWith(DB_LIMIT_DEFAULT);
      });

      it('calls cursor with DB_BATCH_SIZE_DEFAULT', () => {
        expect(cursor).toHaveBeenCalledWith({ batchSize: DB_BATCH_SIZE_DEFAULT });
      });

      it('calls cursor.next', () => {
        expect(next).toHaveBeenCalled();
      });

      it('returns channels found', () => {
        expect(result).toEqual([channel1, channel2]);
      });
    });

    describe('with options empty', () => {
      const options = {};

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(ChannelModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await channelService.find(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls sort with undefined', () => {
        expect(sort).toHaveBeenCalledWith(undefined);
      });

      it('calls limit with DB_LIMIT_DEFAULT', () => {
        expect(limit).toHaveBeenCalledWith(DB_LIMIT_DEFAULT);
      });

      it('calls cursor with DB_BATCH_SIZE_DEFAULT', () => {
        expect(cursor).toHaveBeenCalledWith({ batchSize: DB_BATCH_SIZE_DEFAULT });
      });
    });

    describe('with options batchSize param', () => {
      const options = { batchSize: 10 };

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(ChannelModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await channelService.find(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls cursor with options batchSize param', () => {
        expect(cursor).toHaveBeenCalledWith({ batchSize: options.batchSize });
      });
    });

    describe('with options limit param', () => {
      const options = { limit: 10 };

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(ChannelModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await channelService.find(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls limit with options limit param', () => {
        expect(limit).toHaveBeenCalledWith(options.limit);
      });
    });

    describe('with options sort param', () => {
      const options = { sort: 'sort' };

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(ChannelModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await channelService.find(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls sort with options sort param', () => {
        expect(sort).toHaveBeenCalledWith(options.sort);
      });
    });

    describe('with options batchSize param too large', () => {
      const options = { batchSize: 10000 };

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(ChannelModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await channelService.find(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls cursor with DB_BATCH_SIZE_MAX', () => {
        expect(cursor).toHaveBeenCalledWith({ batchSize: DB_BATCH_SIZE_MAX });
      });
    });

    describe('with options limit param too large', () => {
      const options = { limit: 10000 };

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(ChannelModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await channelService.find(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls limit with DB_LIMIT_MAX', () => {
        expect(limit).toHaveBeenCalledWith(DB_LIMIT_MAX);
      });
    });

    describe('with error on ChannelModel.find', () => {
      beforeEach(async () => {
        jest.spyOn(ChannelModel, 'find').mockImplementationOnce(() => {
          throw error;
        });

        result = await channelService.find(filter);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('channelService: find error', { error });
      });

      it('returns channels empty array', () => {
        expect(result).toEqual([]);
      });
    });
  });

  describe('calling function findAll', () => {
    const filter = { isPrivate: true };
    let next: jest.Mock;
    let cursor: jest.Mock;
    let limit: jest.Mock;
    let sort: jest.Mock;
    let result: Channel[];

    describe('successfully with no options param', () => {
      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(channel1).mockReturnValueOnce(channel2).mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(ChannelModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await channelService.findAll(filter);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls ChannelModel.find', () => {
        expect(ChannelModel.find).toHaveBeenCalledWith(filter);
      });

      it('calls sort with DB_SORT_DEFAULT', () => {
        expect(sort).toHaveBeenCalledWith(DB_SORT_DEFAULT);
      });

      it('calls limit with DB_LIMIT_DEFAULT', () => {
        expect(limit).toHaveBeenCalledWith(DB_LIMIT_DEFAULT);
      });

      it('calls cursor with DB_BATCH_SIZE_DEFAULT', () => {
        expect(cursor).toHaveBeenCalledWith({ batchSize: DB_BATCH_SIZE_DEFAULT });
      });

      it('returns channels found', () => {
        expect(result).toEqual([channel1, channel2]);
      });
    });

    describe('with options empty', () => {
      const options = {};

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(ChannelModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await channelService.findAll(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls sort with DB_SORT_DEFAULT', () => {
        expect(sort).toHaveBeenCalledWith(DB_SORT_DEFAULT);
      });

      it('calls limit with DB_LIMIT_DEFAULT', () => {
        expect(limit).toHaveBeenCalledWith(DB_LIMIT_DEFAULT);
      });

      it('calls cursor with DB_BATCH_SIZE_DEFAULT', () => {
        expect(cursor).toHaveBeenCalledWith({ batchSize: DB_BATCH_SIZE_DEFAULT });
      });
    });

    describe('with options batchSize param', () => {
      const options = { batchSize: 10 };

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(ChannelModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await channelService.findAll(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls cursor with options batchSize param', () => {
        expect(cursor).toHaveBeenCalledWith({ batchSize: options.batchSize });
      });
    });

    describe('with options limit param', () => {
      const options = { limit: 10 };

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(ChannelModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await channelService.findAll(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls limit with options limit param', () => {
        expect(limit).toHaveBeenCalledWith(options.limit);
      });
    });

    describe('with options sort param', () => {
      const options = { sort: 'sort' };

      beforeEach(async () => {
        next = jest.fn().mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(ChannelModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await channelService.findAll(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls sort with options sort param', () => {
        expect(sort).toHaveBeenCalledWith(options.sort);
      });
    });

    describe('with multiple pages', () => {
      const options = { limit: 2 };

      beforeEach(async () => {
        next = jest
          .fn()
          .mockReturnValueOnce(channel1)
          .mockReturnValueOnce(channel2)
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(null);
        cursor = jest.fn().mockReturnValueOnce({ next });
        limit = jest.fn().mockReturnValueOnce({ cursor });
        sort = jest.fn().mockReturnValueOnce({ limit });
        jest.spyOn(ChannelModel, 'find').mockReturnValueOnce({ sort } as unknown as Query<never, never>);

        result = await channelService.findAll(filter, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls ChannelModel.find for first call with no _id filter', () => {
        expect(ChannelModel.find).toHaveBeenNthCalledWith(1, filter);
      });

      it('calls ChannelModel.find for second call with _id filter of last channel in page', () => {
        expect(ChannelModel.find).toHaveBeenNthCalledWith(2, { ...filter, _id: { $gt: new ObjectId(channel2._id) } });
      });
    });
  });

  describe('calling function findOne', () => {
    const filter = { channelId: 'foo' };
    let result: Channel | null;

    describe('successfully', () => {
      beforeEach(async () => {
        jest.spyOn(ChannelModel, 'findOne').mockResolvedValueOnce(channel1);

        result = await channelService.findOne(filter);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls ChannelModel.findOne', () => {
        expect(ChannelModel.findOne).toHaveBeenCalledWith(filter);
      });

      it('returns channel', () => {
        expect(result).toEqual(channel1);
      });
    });

    describe('with error on ChannelModel.findOne', () => {
      beforeEach(async () => {
        jest.spyOn(ChannelModel, 'findOne').mockRejectedValueOnce(error);

        result = await channelService.findOne(filter);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('channelService: findOne failed', { error });
      });

      it('returns null', () => {
        expect(result).toEqual(null);
      });
    });
  });

  describe('calling function findOneAndUpdateByChannelId', () => {
    const channelId = 'foo';
    const filter = { channelId };
    const data = { foo: 'bar' };
    const options = { new: true, setDefaultsOnInsert: true, upsert: true };
    let result: Channel | null;

    describe('successfully', () => {
      beforeEach(async () => {
        jest.spyOn(ChannelModel, 'findOneAndUpdate').mockResolvedValueOnce(channel1);

        result = await channelService.findOneAndUpdateByChannelId(channelId, data);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls ChannelModel.findOneAndUpdate', () => {
        expect(ChannelModel.findOneAndUpdate).toHaveBeenCalledWith(filter, data, options);
      });

      it('returns channel', () => {
        expect(result).toEqual(channel1);
      });
    });

    describe('with error on ChannelModel.findOneAndUpdate', () => {
      beforeEach(async () => {
        jest.spyOn(ChannelModel, 'findOneAndUpdate').mockRejectedValueOnce(error);

        result = await channelService.findOneAndUpdateByChannelId(channelId, data);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls logger.warn', () => {
        expect(logger.warn).toHaveBeenCalledWith('channelService: findOneAndUpdateByChannelId failed', { error });
      });

      it('returns null', () => {
        expect(result).toEqual(null);
      });
    });
  });

  describe('calling function findOneOrCreateByChannelId', () => {
    const channelId = 'foo';
    let result: Channel | null;

    describe('successfully finds one', () => {
      beforeEach(async () => {
        jest.spyOn(ChannelModel, 'findOne').mockResolvedValueOnce(channel1);

        result = await channelService.findOneOrCreateByChannelId(channelId);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls ChannelModel.findOne', () => {
        expect(ChannelModel.findOne).toHaveBeenCalledWith({ channelId });
      });

      it('returns channel', () => {
        expect(result).toEqual(channel1);
      });
    });

    describe('successfully creates one', () => {
      beforeEach(async () => {
        jest.spyOn(ChannelModel, 'findOne').mockResolvedValueOnce(null);
        jest.spyOn(ChannelModel, 'create').mockResolvedValueOnce(channel1 as unknown as Channel[]);

        result = await channelService.findOneOrCreateByChannelId(channelId);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls ChannelModel.findOne', () => {
        expect(ChannelModel.findOne).toHaveBeenCalledWith({ channelId });
      });

      it('calls ChannelModel.create', () => {
        expect(ChannelModel.create).toHaveBeenCalledWith({ channelId });
      });

      it('returns channel', () => {
        expect(result).toEqual(channel1);
      });
    });
  });
});
