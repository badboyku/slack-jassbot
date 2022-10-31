/* istanbul ignore file */
import {appHomeController} from '../controllers';
import type {App} from '@slack/bolt';

const register = (app: App) => {
  app.event('app_home_opened', appHomeController.appHomeOpened);
};

export default { register };
