/* istanbul ignore file */
import actions from './actions';
import commands from './commands';
import events from './events';
import messages from './messages';
import options from './options';
import shortcuts from './shortcuts';
import steps from './steps';
import views from './views';
import type { App } from '@slack/bolt';

const registerListeners = (app: App) => {
  actions.register(app);
  commands.register(app);
  events.register(app);
  messages.register(app);
  options.register(app);
  shortcuts.register(app);
  steps.register(app);
  views.register(app);
};

export default registerListeners;
