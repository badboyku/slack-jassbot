import { MongoClient, ServerApiVersion } from 'mongodb';
import { UserNewModel } from '@db/models';
import { config, logger } from '@utils';
import type { Collection, Db } from 'mongodb';
import type { Document } from 'bson';
import type { DbCloseResult, DbConnectResult, UserModelDoc } from '@types';

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

        return client
          .db(dbName)
          .command({ ping: 1 })
          .then((result) => {
            logger.debug(`db: ${dbName} ping success`, { result });

            return { isConnected: true };
          })
          .catch((error) => {
            logger.warn(`db: ${dbName} ping failed`, { error });

            return { isConnected: false };
          });
      })
      .catch((error) => {
        logger.warn(`db: ${dbName} connect failed`, { error });

        return { isConnected: false };
      });
  },

  getUserCollection(): Collection<UserModelDoc> {
    return client.db(dbName).collection<UserModelDoc>(UserNewModel.collectionName);
  },

  async syncValidations(): Promise<void> {
    await syncValidation(client.db(dbName), UserNewModel.collectionName, UserNewModel.validator);
  },
});

const options = { serverApi: { strict: true, version: ServerApiVersion.v1 } };
export default db(new MongoClient(config.db.jassbot.uri, options));
