import mongoose from 'mongoose';
import config from './config';
import logger from './logger';

const connect = async (): Promise<{ isConnected: boolean }> => {
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

const disconnect = async (): Promise<{ isDisconnected: boolean }> => {
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
