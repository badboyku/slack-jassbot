import { MongoClient, ServerApiVersion } from 'mongodb';
import { ChannelModel, UserModel } from '@db/models';
import { logger } from '@utils';
import config from '@utils/config';
import type { Document } from 'bson';
import type { Collection, Db } from 'mongodb';
import type { ChannelDoc, DbCloseResult, DbConnectResult, UserDoc } from '@types';

const dbName = 'jassbot';

const syncValidation = (db: Db, collMod: string, validator: Document): Promise<boolean> => {
  logger.debug(`db: ${dbName} syncValidation called`, { collMod, validator });

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

  getChannelCollection(): Collection<ChannelDoc> {
    return client.db(dbName).collection<ChannelDoc>(ChannelModel.getCollName());
  },

  getUserCollection(): Collection<UserDoc> {
    return client.db(dbName).collection<UserDoc>(UserModel.getCollName());
  },

  async syncValidations(): Promise<void> {
    await syncValidation(client.db(dbName), ChannelModel.getCollName(), ChannelModel.getValidator());
    await syncValidation(client.db(dbName), UserModel.getCollName(), UserModel.getValidator());
  },
});

export default db(
  new MongoClient(config.db.jassbot.uri, { serverApi: { strict: true, version: ServerApiVersion.v1 } }),
);
