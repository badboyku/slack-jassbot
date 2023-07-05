import { model } from '@db/models/modelHelper';
import type { MongoModel } from '@types';

describe('db model modelHelper', () => {
  describe('calling function model', () => {
    const addTimestamps = true;
    const collectionName = 'collectionName';
    const defaults = { foo: 'bar' };
    const methods = {
      someMethod() {
        return 'foo';
      },
    };
    const validator = { foo: 'bar' };
    const reqOptions = { collectionName };
    const doc = { foo: 'bar' };
    let SomeModel: MongoModel;

    describe('with options', () => {
      const options = { ...reqOptions };

      beforeEach(async () => {
        SomeModel = model(options);
      });

      it('sets options on Model', () => {
        expect(SomeModel.options).toEqual(options);
      });
    });

    const testCase1 = [
      { test: 'missing', options: {}, expTest: 'default false', exp: false },
      { test: 'set', options: { addTimestamps }, expTest: 'options addTimestamps value', exp: addTimestamps },
    ];
    testCase1.forEach(({ test, options, expTest, exp }) => {
      describe(`when calling Model.addTimestamps with options addTimestamps ${test}`, () => {
        beforeEach(async () => {
          SomeModel = model({ ...reqOptions, ...options });
        });

        it(`returns ${expTest}`, () => {
          expect(SomeModel.addTimestamps()).toEqual(exp);
        });
      });
    });

    describe('when calling Model.getCollectionName with options collectionName set', () => {
      beforeEach(async () => {
        SomeModel = model({ ...reqOptions });
      });

      it('returns options collectionName value', () => {
        expect(SomeModel.getCollectionName()).toEqual(collectionName);
      });
    });

    const testCase2 = [
      { test: 'missing', options: {}, expTest: 'default undefined', exp: undefined },
      { test: 'set', options: { defaults }, expTest: 'options defaults value', exp: defaults },
    ];
    testCase2.forEach(({ test, options, expTest, exp }) => {
      describe(`when calling Model.getDefaults with options defaults ${test}`, () => {
        beforeEach(async () => {
          SomeModel = model({ ...reqOptions, ...options });
        });

        it(`returns ${expTest}`, () => {
          expect(SomeModel.getDefaults()).toEqual(exp);
        });
      });
    });

    const testCase3 = [
      { test: 'missing', options: {}, expTest: 'doc', exp: doc },
      { test: 'set', options: { methods }, expTest: 'doc with methods', exp: { ...doc, ...methods } },
    ];
    testCase3.forEach(({ test, options, expTest, exp }) => {
      describe(`when calling Model.getModel for doc with Model options methods ${test}`, () => {
        beforeEach(async () => {
          SomeModel = model({ ...reqOptions, ...options });
        });

        it(`returns ${expTest}`, () => {
          expect(SomeModel.getModel(doc)).toEqual(exp);
        });
      });
    });

    const testCase4 = [
      { test: 'missing', options: {}, expTest: 'default undefined', exp: undefined },
      { test: 'set', options: { validator }, expTest: 'options validator value', exp: validator },
    ];
    testCase4.forEach(({ test, options, expTest, exp }) => {
      describe(`when calling Model.getValidator with options validator ${test}`, () => {
        beforeEach(async () => {
          SomeModel = model({ ...reqOptions, ...options });
        });

        it(`returns ${expTest}`, () => {
          expect(SomeModel.getValidator()).toEqual(exp);
        });
      });
    });
  });
});
