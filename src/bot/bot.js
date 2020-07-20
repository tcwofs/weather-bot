const { bot, i18n, localSession, stageConfig, property } = require('./config');
const { getLangInline } = require('./keyboards');
const { startWheatherLoop } = require('./wheatherLoop');

bot.use(localSession.middleware(property));
bot.use(i18n.middleware());
bot.use(stageConfig.middleware());

startWheatherLoop(bot, localSession);

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

bot.start(({ i18n, replyWithHTML }) => replyWithHTML(`${i18n.t('lang')}`, getLangInline()));

bot.action(['ru', 'en'], ({ i18n, deleteMessage, match, replyWithHTML, scene, session }) => {
  if (!session.notif) {
    session.notif = [
      {
        name: '1',
        time: null,
      },
      {
        name: '2',
        time: null,
      },
      {
        name: '3',
        time: null,
      },
      {
        name: '4',
        time: null,
      },
    ];
  }
  if (!session.units) session.units = 'metric';
  i18n.locale(match);
  return [deleteMessage(), replyWithHTML(i18n.t('switched')), scene.enter('mainScene')];
});

bot.help(({ i18n, replyWithHTML }) => replyWithHTML(i18n.t('help')));

bot.launch();
