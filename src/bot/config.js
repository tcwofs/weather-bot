const Telegraf = require('telegraf');
const I18n = require('telegraf-i18n');
const LocalSession = require('telegraf-session-local');
const Stage = require('telegraf/stage');
const { config, city, main, about, setNotif, delNotif } = require('./scenes');

require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

const i18n = new I18n({
  directory: 'src/locales',
  defaultLanguage: 'en',
  sessionName: 'session',
  useSession: true,
  templateData: {
    pluralize: I18n.pluralize,
    uppercase: (value) => value.toUpperCase(),
  },
});

const localSession = new LocalSession({
  database: 'src/database.json',
  property: 'session',
  storage: LocalSession.storageFileAsync,
  format: {
    serialize: (obj) => JSON.stringify(obj, null, 2), // null & 2 for pretty-formatted JSON
    deserialize: (str) => JSON.parse(str),
  },
  state: { alerts: [] },
});

localSession.DB.then((DB) => {
  console.log('Current LocalSession DB:', DB.value());
});

const stageConfig = new Stage();
stageConfig.register(main);
stageConfig.register(config);
stageConfig.register(city);
stageConfig.register(about);
stageConfig.register(setNotif);
stageConfig.register(delNotif);

module.exports = {
  i18n,
  bot,
  localSession,
  stageConfig,
};
