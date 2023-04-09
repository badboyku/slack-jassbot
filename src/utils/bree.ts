import { config, logger } from '@utils';
import { breeHelper, gracefulHelper } from '@utils/helpers';

const start = async () => {
  if (config.bree.isDisabled) {
    return;
  }

  const bree = breeHelper.getBree();
  bree.on('worker created', (name: string) => {
    logger.debug('bree: worker created', { data: { name } });
  });
  bree.on('worker deleted', (name: string) => {
    logger.debug('bree: worker deleted', { data: { name } });
  });

  const gracefulOptions = gracefulHelper.getGracefulOptions(bree);
  const graceful = gracefulHelper.getGraceful(gracefulOptions);
  graceful.listen();

  await bree.start();
  logger.info('bree: start success');
};

export default { start };
