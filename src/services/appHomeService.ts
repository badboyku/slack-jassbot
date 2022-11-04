import appHomeView from '../views/appHomeView';
import type { Logger } from '@slack/logger';
import type { WebClient } from '@slack/web-api';
import type { SaveUserDatesValues, User } from '../@types/global';

const dummyUser = { birthday: '2023-01-15', workAnniversary: '2015-05-15' };

const appHomeOpened = async (user: User, client: WebClient, logger: Logger) => {
  logger.debug('appHomeService: appHomeOpened called', { user });

  // TODO: get user from storage.
  const userModel = { ...user, ...dummyUser };
  const options = appHomeView.appHomeRoot(userModel);

  try {
    await client.views.publish(options);
  } catch (error) {
    logger.error('appHomeService: appHomeOpened error', { error });
  }

  logger.debug('appHomeService: appHomeOpened completed');
};

const manageUserDates = async (triggerId: string, user: User, client: WebClient, logger: Logger) => {
  logger.debug('appHomeService: manageUserDates called', { triggerId, user });

  // TODO: get user from storage.
  const userObj = { ...user, ...dummyUser };
  const options = appHomeView.manageUserDates(triggerId, userObj);

  try {
    await client.views.open(options);
  } catch (error) {
    logger.error('appHomeService: manageUserDates error', { error });
  }

  logger.debug('appHomeService: manageUserDates completed');
};

const saveUserDates = async (user: User, values: SaveUserDatesValues, client: WebClient, logger: Logger) => {
  logger.debug('appHomeService: saveUserDates called', { user, values });

  const { id } = user;
  const {
    birthdayInput: {
      birthdayDatepicker: { selected_date: birthdayNew },
    },
    workAnniversaryInput: {
      workAnniversaryDatepicker: { selected_date: workAnniversaryNew },
    },
  } = values;

  // TODO: get user from storage.
  logger.debug('appHomeService: saveUserDates to db', { id, birthdayNew, workAnniversaryNew });
  // TODO: save dates on user to db.

  logger.debug('appHomeService: saveUserDates completed');
};

export default { appHomeOpened, manageUserDates, saveUserDates };
