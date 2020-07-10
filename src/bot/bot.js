const commandParts = require('telegraf-command-parts');
const { bot, i18n, localSession, property } = require('./config');
const { getCurrentWheather } = require('./wheather');
const Keyboard = require('telegraf-keyboard');

const mainMenu = new Keyboard({ inline: false });
mainMenu
  .add('', 'Item 2', 'Item 3') // first line
  .add('config', 'help');

bot.use(localSession.middleware(property));
bot.use(i18n.middleware());
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

bot.start(({ i18n, replyWithHTML }) => {
  const startKeyboard = new Keyboard({ inline: true });
  startKeyboard.add('🇺🇸:en', '🇷🇺:ru');
  replyWithHTML(`${i18n.t('greeting')}\n\nВыберите, пожалуйста язык.\nPlease, choose language`, startKeyboard.draw());
});

bot.action(['ru', 'en'], ({ i18n, deleteMessage, match, reply }) => {
  i18n.locale(match);
  return [deleteMessage(), reply(i18n.t('switched'), mainMenu.draw())];
});

bot.hears(['help', '/help'], ({ i18n, replyWithHTML }) => replyWithHTML(i18n.t('help')));
bot.hears(['config', '/config'], ({ i18n, replyWithHTML }) => {
  replyWithHTML(i18n.t('help'));
});

bot.command('echo', (ctx) => {
  return ctx.reply(ctx.state.command.args);
});

bot.command('rkb', ({ reply, i18n }) => {
  return reply(i18n.t('switched'), mainMenu.clear());
});

bot.command('skb', ({ reply, i18n }) => {
  return reply(i18n.t('switched'), mainMenu.draw());
});

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
