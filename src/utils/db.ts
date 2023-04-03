import mongoose from 'mongoose';
import { config, logger } from '@utils';

export type DbConnectResult = { isConnected: boolean };
const connect = async (): Promise<DbConnectResult> => {
  const {
    db: { uri },
  } = config;

  mongoose.set('strictQuery', false);

  let isConnected = false;
  try {
    await mongoose.connect(uri, { autoIndex: false });
    isConnected = true;
  } catch (error) {
    logger.warn('db: connect failed', { error });
  }

  return { isConnected };
};

export type DbDisconnectResult = { isDisconnected: boolean };
const disconnect = async (): Promise<DbDisconnectResult> => {
  let isDisconnected = false;
  try {
    await mongoose.disconnect();
    isDisconnected = true;
  } catch (error) {
    logger.warn('db: disconnect failed', { error });
  }

  return { isDisconnected };
};

export default { connect, disconnect };
