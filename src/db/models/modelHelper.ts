import type { Document as MongoDoc } from 'mongodb';
import type { MongoModel, MongoModelOptions } from '@types';

export const model = (options: MongoModelOptions): MongoModel => {
  return {
    options,

    addTimestamps() {
      return this.options?.addTimestamps || false;
    },

    getCollectionName() {
      return this.options.collectionName;
    },

    getDefaults() {
      return this.options?.defaults || undefined;
    },

    getModel(doc: MongoDoc) {
      return { ...doc, ...this.options?.methods };
    },

    getValidator() {
      return this.options?.validator || undefined;
    },
  };
};
