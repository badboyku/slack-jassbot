import { MongoClient, ServerApiVersion } from 'mongodb';
import { ChannelModel, UserModel } from '@db/models';
import { config, logger } from '@utils';
import type { Document } from 'bson';
import type { Collection, Db } from 'mongodb';
import type { Channel, DbCloseResult, DbConnectResult, User } from '@types';

const dbName = 'jassbot';

const syncValidation = (db: Db, collMod: string, validator?: Document): Promise<boolean> | boolean => {
  logger.debug(`db: ${dbName} syncValidation called`, { collMod, validator });

  if (!validator) {
    return true;
  }

  return db
    .command({ collMod, validator })
    .then((result) => {
      logger.debug(`db: ${dbName} syncValidation success`, { collMod, result });

      return true;
    })
    .catch((error) => {
      logger.warn(`db: ${dbName} syncValidation failed`, { collMod, error });

      return false;
    });
};

export const db = (client: MongoClient) => ({
  close(): Promise<DbCloseResult> {
    return client
      .close()
      .then(() => {
        logger.debug(`db: ${dbName} close success`);

        return { isClosed: true };
      })
      .catch((error) => {
        logger.warn(`db: ${dbName} close failed`, { error });

        return { isClosed: false };
      });
  },

  connect(): Promise<DbConnectResult> {
    return client
      .connect()
      .then(() => {
        logger.debug(`db: ${dbName} connect success`);

        return { isConnected: true };
      })
      .catch((error) => {
        logger.warn(`db: ${dbName} connect failed`, { error });

        return { isConnected: false };
      });
  },

  getCollection<T extends Document>(name: string): Collection<T> {
    return client.db(dbName).collection<T>(name);
  },

  getChannelCollection() {
    return this.getCollection<Channel>(ChannelModel.getCollectionName());
  },

  getUserCollection() {
    return this.getCollection<User>(UserModel.getCollectionName());
  },

  async syncValidations(): Promise<void> {
    for await (const model of [ChannelModel, UserModel]) {
      await syncValidation(client.db(dbName), model.getCollectionName(), model.getValidator());
    }
  },
});

export default db(
  new MongoClient(config.db.jassbot.uri, { serverApi: { strict: true, version: ServerApiVersion.v1 } }),
);
