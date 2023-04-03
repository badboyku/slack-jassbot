import { breeHelper, gracefulHelper } from '@utilHelpers';
import { config, logger } from '@utils';

const start = async () => {
  if (config.bree.isDisabled) {
    return;
  }

  const breeOptions = breeHelper.getBreeOptions();
  const bree = breeHelper.getBree(breeOptions);
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
