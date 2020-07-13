const commandParts = require('telegraf-command-parts');
const { bot, i18n, localSession, stageConfig, property } = require('./config');
const { getLangInline } = require('./keyboards');

bot.use(localSession.middleware(property));
bot.use(i18n.middleware());
bot.use(commandParts());
bot.use(stageConfig.middleware());
bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log('Response time: %sms', ms);
});

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

bot.start(({ i18n, replyWithHTML }) => replyWithHTML(`${i18n.t('lang')}`, getLangInline()));

bot.action(['ru', 'en'], ({ i18n, deleteMessage, match, replyWithHTML, scene }) => {
  i18n.locale(match);
  return [deleteMessage(), replyWithHTML(i18n.t('switched')), scene.enter('mainScene')];
});

bot.help(({ i18n, replyWithHTML }) => replyWithHTML(i18n.t('help')));

bot.launch();
