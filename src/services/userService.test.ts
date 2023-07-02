import { UserModel } from '@db/models';
import { dbJassbot } from '@db/sources';
import { userService } from '@services';
import { mongodb } from '@utils';
import type { UserModel as UserModelType } from '@types';

jest.mock('@db/models/userModel');
jest.mock('@db/sources/jassbotSource');
jest.mock('@utils/logger/logger');
jest.mock('@utils/mongodb');

describe('services user', () => {
  const collection = {};
  const options = {};
  const user1 = { _id: '6471bdeb1eda180988fb5a19', userId: 'foo' };
  const user2 = { _id: '6471bee81eda180988fb5b0e', userId: 'bar' };
  const error = 'error';

  describe('calling function findAll', () => {
    const filter = {};
    let result: UserModelType[];

    describe('successfully', () => {
      beforeEach(async () => {
        jest.spyOn(dbJassbot, 'getUserCollection').mockReturnValueOnce(collection as never);
        jest.spyOn(mongodb, 'find').mockResolvedValueOnce({ result: [user1] });

        result = await userService.findAll(filter);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls dbJassbot.getUserCollection', () => {
        expect(dbJassbot.getUserCollection).toHaveBeenCalled();
      });

      it('calls mongodb.find', () => {
        expect(mongodb.find).toHaveBeenCalledWith(collection, filter, { limit: 1000 }, {}, UserModel);
      });

      it('returns docs', () => {
        expect(result).toEqual([user1]);
      });
    });

    describe('when find hasMore results', () => {
      beforeEach(async () => {
        jest.spyOn(dbJassbot, 'getUserCollection').mockReturnValueOnce(collection as never);
        jest
          .spyOn(mongodb, 'find')
          .mockResolvedValueOnce({ result: [user1], pageInfo: { endCursor: user1._id, hasNextPage: true } })
          .mockResolvedValueOnce({ result: [user2] });

        result = await userService.findAll(filter);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls mongodb.find with after param', () => {
        expect(mongodb.find).toHaveBeenCalledWith(collection, filter, { limit: 1000 }, { after: user1._id }, UserModel);
      });

      it('returns docs', () => {
        expect(result).toEqual([user1, user2]);
      });
    });
  });

  describe('calling function findOneAndUpdateByUserId', () => {
    const data = {};
    let result: UserModelType | undefined;

    describe('successfully', () => {
      beforeEach(async () => {
        jest.spyOn(dbJassbot, 'getUserCollection').mockReturnValueOnce(collection as never);
        jest.spyOn(mongodb, 'findOneAndUpdate').mockResolvedValueOnce({ doc: user1 });

        result = await userService.findOneAndUpdateByUserId(user1.userId, data, options);
      });

      afterEach(() => {
        jest.restoreAllMocks();
      });

      it('calls dbJassbot.getUserCollection', () => {
        expect(dbJassbot.getUserCollection).toHaveBeenCalled();
      });

      it('calls mongodb.findOneAndUpdate', () => {
        expect(mongodb.findOneAndUpdate).toHaveBeenCalledWith(
          collection,
          { userId: user1.userId },
          { $set: data },
          options,
          UserModel,
        );
      });

      it('returns doc', () => {
        expect(result).toEqual(user1);
      });
    });

    const testCases = [
      { test: 'no doc', findOneAndUpdateResult: {} },
      { test: 'error', findOneAndUpdateResult: { error } },
    ];
    testCases.forEach(({ test, findOneAndUpdateResult }) => {
      describe(`with ${test}`, () => {
        beforeEach(async () => {
          jest.spyOn(dbJassbot, 'getUserCollection').mockReturnValueOnce(collection as never);
          jest.spyOn(mongodb, 'findOneAndUpdate').mockResolvedValueOnce(findOneAndUpdateResult as never);

          result = await userService.findOneAndUpdateByUserId(user1.userId, data, options);
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
