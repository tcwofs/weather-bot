const { bot, i18n, localSession, property } = require('./config');
const { menu } = require('./menus');
const commandParts = require('telegraf-command-parts');

bot.use(localSession.middleware(property));
bot.use(i18n.middleware());
bot.use(commandParts());
bot.use(menu.init());

bot.start(({ i18n, replyWithHTML }) => replyWithHTML(i18n.t('greeting')));
bot.help(({ i18n, replyWithHTML }) => replyWithHTML(i18n.t('help')));

bot.command('en', ({ i18n, replyWithHTML }) => {
  i18n.locale('en');
  return replyWithHTML(i18n.t('switch'));
});

bot.command('ru', ({ i18n, replyWithHTML }) => {
  i18n.locale('ru');
  return replyWithHTML(i18n.t('switch'));
});

bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log('Response time: %sms', ms);
});

bot.command('echo', (ctx) => {
  return ctx.reply(ctx.state.command.args);
});

bot.catch((err, ctx) => {
  console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

bot.on('text', (ctx, next) => {
  ctx[property].counter = ctx[property].counter || 0;
  ctx[property].counter++;
  console.log(ctx[property].counter);
  ctx.replyWithMarkdown(`Counter updated, new value: \`${ctx[property].counter}\``);
  // Writing message to Array `messages` into database which already has sessions Array
  ctx[property + 'DB'].get('messages').push([ctx.message]).write();
  // `property`+'DB' is a name of property which contains lowdb instance, default = `sessionDB`, in current example = `dataDB`
  // ctx.dataDB.get('messages').push([ctx.message]).write()

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
