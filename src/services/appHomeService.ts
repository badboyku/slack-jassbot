import logger from '../utils/logger';
import appHomeView from '../views/appHomeView';
import userService from './userService';
import type {ViewsOpenArguments, ViewsPublishArguments} from '@slack/web-api';
import type {SlackUser, ViewStateValues} from '../@types/global';

const appHomeOpened = async (userId: string): Promise<ViewsPublishArguments> => {
  logger.debug('appHomeService: appHomeOpened called', { userId });

  const user = await userService.getOrCreateUser(userId);
  const options = appHomeView.appHomeRoot(userId, user);

  logger.debug('appHomeService: appHomeOpened completed');

  return options;
};

const manageUserDates = async (triggerId: string, slackUser: SlackUser): Promise<ViewsOpenArguments> => {
  logger.debug('appHomeService: manageUserDates called', { triggerId, slackUser });

  const { id: userId } = slackUser;
  const user = await userService.getOrCreateUser(userId);
  const options = appHomeView.manageUserDates(triggerId, user);

  logger.debug('appHomeService: manageUserDates completed');

  return options;
};

const saveUserDates = async (slackUser: SlackUser, values: ViewStateValues): Promise<ViewsPublishArguments> => {
  logger.debug('appHomeService: saveUserDates called', { slackUser, values });

  const { id: userId } = slackUser;
  const {
    birthday: {
      datepicker: { selected_date: birthdayNew },
    },
    workAnniversary: {
      datepicker: { selected_date: workAnniversaryNew },
    },
  } = values;

  const user = await userService.updateUserDates(userId, birthdayNew, workAnniversaryNew);
  const options = appHomeView.appHomeRoot(userId, user);

  logger.debug('appHomeService: saveUserDates completed');

  return options;
};

export default { appHomeOpened, manageUserDates, saveUserDates };
