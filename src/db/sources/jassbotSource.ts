import mongoose from 'mongoose';
import { config, logger } from '@utils';
import type { DbConnectResult, DbDisconnectResult } from '@types';

const connect = async (): Promise<DbConnectResult> => {
  mongoose.set('strictQuery', false);

  let isConnected = false;
  try {
    const db = await mongoose.connect(config.db.jassbot.uri, { autoIndex: false });
    isConnected = db.connection.readyState === 1;
  } catch (error) {
    logger.warn('dbJassbot: connect failed', { error });
  }

  return { isConnected };
};

const disconnect = async (): Promise<DbDisconnectResult> => {
  let isDisconnected = false;
  try {
    await mongoose.disconnect();
    isDisconnected = true;
  } catch (error) {
    logger.warn('dbJassbot: disconnect failed', { error });
  }

  return { isDisconnected };
};

export default { connect, disconnect };
