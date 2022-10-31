/* istanbul ignore file */
import actionListener from './actionListener';
import commandListener from './commandListener';
import eventListener from './eventListener';
import messageListener from './messageListener';
import optionsListener from './optionsListener';
import shortcutListener from './shortcutListener';
import stepListener from './stepListener';
import viewListener from './viewListener';
import type { App } from '@slack/bolt';

const registerListeners = (app: App) => {
  actionListener.register(app);
  commandListener.register(app);
  eventListener.register(app);
  messageListener.register(app);
  optionsListener.register(app);
  shortcutListener.register(app);
  stepListener.register(app);
  viewListener.register(app);
};

export default registerListeners;
