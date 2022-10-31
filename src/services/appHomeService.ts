import appHomeView from '../views/appHomeView';
import type {Logger} from '@slack/logger';
import type {WebClient} from '@slack/web-api';
import type {User} from '../@types/global';

const appHomeOpened = async (user: User, client: WebClient, logger: Logger) => {
  logger.debug('appHomeService: appHomeOpened called', { user });

  // TODO: get user from storage.
  const userModel = { ...user, birthday: '1/13', workAnniversary: '5/15/2015' };
  const options = appHomeView.appHomeRoot(userModel);

  try {
    await client.views.publish(options);
    logger.debug('appHomeService: appHomeOpened ok');
  } catch (error) {
    logger.error('appHomeService: appHomeOpened error', { error });
  }
};

const manageUserDates = async (user: User, client: WebClient, logger: Logger) => {
  logger.debug('appHomeService: manageUserDates called', { user });

  // TODO: get user from storage.
  const userObj = { ...user, birthday: '1/13', workAnniversary: '5/15/2015' };
  const options = appHomeView.manageUserDates(userObj);

  try {
    await client.views.publish(options);
    logger.debug('appHomeService: manageUserDates ok');
  } catch (error) {
    logger.error('appHomeService: manageUserDates error', { error });
  }
};

export default { appHomeOpened, manageUserDates };