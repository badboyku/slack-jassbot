import mongoose from 'mongoose';
import config from './config';
import logger from './logger';

const connect = async () => {
  const {
    db: { uri },
  } = config;

  mongoose.set('strictQuery', false);

  let isConnected = false;
  try {
    await mongoose.connect(uri, { autoIndex: false });

    isConnected = true;
  } catch (error) {
    logger.error('Database failed to connect', { error });
  }

  if (isConnected) {
    logger.debug('Database connected');
  }

  return { isConnected };
};

const disconnect = async () => {
  await mongoose.disconnect();
  logger.debug('Database disconnected');
};

export default { connect, disconnect };
