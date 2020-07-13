const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { getMainKeyboard } = require('../keyboards');
const { getCurrentWheather } = require('../wheather');

const main = new Scene('mainScene');

main.enter(({ i18n, replyWithHTML }) => replyWithHTML(`${i18n.t('main')}`, getMainKeyboard(i18n)));
main.hears(['⚙️настройки', '⚙️configuration'], ({ scene }) => scene.enter('configScene'));
main.hears(['/cancel'], Stage.leave());

main.on('text', (ctx, next) => {
  ctx.session.counter = ctx.session.counter || 0;
  ctx.session.counter++;
  ctx.replyWithMarkdown(`Counter updated, new value: \`${ctx.session.counter}\``);
  ctx.sessionDB.get('messages').push([ctx.message]).write();
  return next();
});

main.command('stats', (ctx) => {
  let msg = `Using session object from [Telegraf Context](http://telegraf.js.org/context.html) (\`ctx\`), named \`${'session'}\`\n`;
  msg += `Database has \`${ctx.session.counter}\` messages from @${ctx.from.username || ctx.from.id}`;
  ctx.replyWithMarkdown(msg);
});

main.command('remove', (ctx) => {
  ctx.replyWithMarkdown(`Removing session from database: \`${JSON.stringify(ctx.session)}\``);
  // Setting session to null, undefined or empty object/array will trigger removing it from database
  ctx.session = null;
});

module.exports = {
  main,
};
