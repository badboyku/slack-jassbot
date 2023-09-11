import type { Document as MongoDoc } from 'mongodb';
import type { MongoModel, MongoModelOptions } from '@types';

export const model = <T extends MongoDoc>(options: MongoModelOptions<T>): MongoModel<T> => {
  return {
    options,

    addTimestamps() {
      return this.options?.addTimestamps ?? false;
    },

    getCollectionName() {
      return this.options.collectionName;
    },

    getDefaults() {
      return this.options?.defaults;
    },

    getModel(doc) {
      return { ...doc, ...this.options?.methods } as T;
    },

    getValidator() {
      return this.options?.validator;
    },
  };
};
