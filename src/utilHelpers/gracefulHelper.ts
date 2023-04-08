import Graceful from '@ladjs/graceful';
import type Bree from 'bree';
import type { GracefulOptions } from '@ladjs/graceful';

const getGraceful = (options?: GracefulOptions): Graceful => new Graceful(options);

const getGracefulOptions = (bree: Bree): GracefulOptions => ({ brees: [bree] });

export default { getGraceful, getGracefulOptions };
