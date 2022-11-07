/* istanbul ignore file */
import mongoose from 'mongoose';
import config from '../utils/config';
import logger from '../utils/logger';

const connect = () => {
  const {
    db: { uri },
  } = config;
  const options = { autoIndex: false };

  mongoose
    .connect(uri, options)
    .then(() => {
      logger.debug('db: connect completed');
    })
    .catch((error) => {
      logger.error('db: connect error', { error });
    });
};

export default { connect };
