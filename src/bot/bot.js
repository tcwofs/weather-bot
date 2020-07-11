const commandParts = require('telegraf-command-parts');
const { bot, i18n, localSession, stageConfig } = require('./config');
const { getCurrentWheather } = require('./wheather');
const { getMainKeyboard, getLangInline } = require('./keyboards');

const property = 'session';

bot.use(localSession.middleware(property));
bot.use(i18n.middleware());
bot.use(stageConfig.middleware());
bot.use(commandParts());
bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log('Response time: %sms', ms);
});

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

bot.start(({ i18n, replyWithHTML }) =>
  replyWithHTML(`${i18n.t('greeting')}\n\nВыберите, пожалуйста язык.\nPlease, choose language`, getLangInline())
);

bot.action(['ru', 'en'], ({ i18n, deleteMessage, match, replyWithHTML }) => {
  i18n.locale(match);
  return [deleteMessage(), replyWithHTML(i18n.t('switched'), getMainKeyboard(i18n))];
});

bot.hears(['⚙️настройки', '⚙️configuration', '/conf'], ({ scene }) => scene.enter('config'));
bot.command('ru', ({ i18n, replyWithHTML }) => {
  i18n.locale('ru');
  replyWithHTML(i18n.t('switched'));
});
bot.command('en', ({ i18n, replyWithHTML }) => {
  i18n.locale('en');
  replyWithHTML(i18n.t('switched'));
});
bot.help(({ i18n, replyWithHTML }) => replyWithHTML(i18n.t('help')));

bot.on('text', (ctx, next) => {
  ctx[property].counter = ctx[property].counter || 0;
  ctx[property].counter++;
  console.log(ctx[property].counter);
  ctx.replyWithMarkdown(`Counter updated, new value: \`${ctx[property].counter}\``);
  ctx[property + 'DB'].get('messages').push([ctx.message]).write();
  return next();
});

bot.command('stats', (ctx) => {
  let msg = `Using session object from [Telegraf Context](http://telegraf.js.org/context.html) (\`ctx\`), named \`${property}\`\n`;
  msg += `Database has \`${ctx[property].counter}\` messages from @${ctx.from.username || ctx.from.id}`;
  ctx.replyWithMarkdown(msg);
});

bot.command('remove', (ctx) => {
  ctx.replyWithMarkdown(`Removing session from database: \`${JSON.stringify(ctx[property])}\``);
  // Setting session to null, undefined or empty object/array will trigger removing it from database
  ctx[property] = null;
});

bot.launch();
