/* istanbul ignore file */
import {appHomeController} from '../controllers';
import type {App} from '@slack/bolt';

const register = (app: App) => {
  app.action('goBackAppHome', appHomeController.goBackAppHome);
  app.action('manageUserDates', appHomeController.manageUserDates);
};

export default { register };
