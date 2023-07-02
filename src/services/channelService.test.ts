import { ChannelModel } from '@db/models';
import { dbJassbot } from '@db/sources';
import { channelService } from '@services';
import { mongodb } from '@utils';
import type { ChannelModel as ChannelModelType } from '@types';

jest.mock('@db/models/channelModel');
jest.mock('@db/sources/jassbotSource');
jest.mock('@utils/logger/logger');
jest.mock('@utils/mongodb');

describe('services channel', () => {
  const collection = {};
  const options = {};
  const channel1 = { _id: '6471bdeb1eda180988fb5a19', channelId: 'foo' };
  const channel2 = { _id: '6471bee81eda180988fb5b0e', channelId: 'bar' };
  const error = 'error';

  describe('calling function findAll', () => {
    const filter = {};
    let result: ChannelModelType[];

    describe('successfully', () => {
      beforeEach(async () => {
        jest.spyOn(dbJassbot, 'getChannelCollection').mockReturnValueOnce(collection as never);
        jest.spyOn(mongodb, 'find').mockResolvedValueOnce({ result: [channel1] });

        result = await channelService.findAll(filter);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls dbJassbot.getChannelCollection', () => {
        expect(dbJassbot.getChannelCollection).toHaveBeenCalled();
      });

      it('calls mongodb.find', () => {
        expect(mongodb.find).toHaveBeenCalledWith(collection, filter, { limit: 1000 }, {}, ChannelModel);
      });

      it('returns docs', () => {
        expect(result).toEqual([channel1]);
      });
    });

    describe('when find hasMore results', () => {
      beforeEach(async () => {
        jest.spyOn(dbJassbot, 'getChannelCollection').mockReturnValueOnce(collection as never);
        jest
          .spyOn(mongodb, 'find')
          .mockResolvedValueOnce({ result: [channel1], pageInfo: { endCursor: channel1._id, hasNextPage: true } })
          .mockResolvedValueOnce({ result: [channel2] });

        result = await channelService.findAll(filter);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls mongodb.find with after param', () => {
        expect(mongodb.find).toHaveBeenCalledWith(
          collection,
          filter,
          { limit: 1000 },
          { after: channel1._id },
          ChannelModel,
        );
      });

      it('returns docs', () => {
        expect(result).toEqual([channel1, channel2]);
      });
    });
  });

  describe('calling function findOneAndUpdateByChannelId', () => {
    const data = {};
    let result: ChannelModelType | undefined;

    describe('successfully', () => {
      beforeEach(async () => {
        jest.spyOn(dbJassbot, 'getChannelCollection').mockReturnValueOnce(collection as never);
        jest.spyOn(mongodb, 'findOneAndUpdate').mockResolvedValueOnce({ doc: channel1 });

        result = await channelService.findOneAndUpdateByChannelId(channel1.channelId, data, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls dbJassbot.getChannelCollection', () => {
        expect(dbJassbot.getChannelCollection).toHaveBeenCalled();
      });

      it('calls mongodb.findOneAndUpdate', () => {
        expect(mongodb.findOneAndUpdate).toHaveBeenCalledWith(
          collection,
          { channelId: channel1.channelId },
          { $set: data },
          options,
          ChannelModel,
        );
      });

      it('returns doc', () => {
        expect(result).toEqual(channel1);
      });
    });

    const testCases = [
      { test: 'no doc', findOneAndUpdateResult: {} },
      { test: 'error', findOneAndUpdateResult: { error } },
    ];
    testCases.forEach(({ test, findOneAndUpdateResult }) => {
      describe(`with ${test}`, () => {
        beforeEach(async () => {
          jest.spyOn(dbJassbot, 'getChannelCollection').mockReturnValueOnce(collection as never);
          jest.spyOn(mongodb, 'findOneAndUpdate').mockResolvedValueOnce(findOneAndUpdateResult as never);

          result = await channelService.findOneAndUpdateByChannelId(channel1.channelId, data, options);
        });

        afterEach(() => {
          jest.restoreAllMocks();
        });

        it('returns undefined', () => {
          expect(result).toEqual(undefined);
        });
      });
    });
  });
});
