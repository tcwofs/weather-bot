const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { getMainKeyboard, getConfigInline } = require('../keyboards');

// Greeter scene
const about = new Scene('aboutScene');

about.enter(({ i18n, replyWithHTML }) => replyWithHTML(`${i18n.t('city')}`, getConfigInline(i18n)));
about.action('exit', ({ scene }) => scene.enter('configScene'));

about.hears(['⬅️Back', '⬅️Вернуться', '/cancel'], Stage.leave());
about.on('message', (ctx) => ctx.reply('Send `hi`'));
about.leave(({ i18n, replyWithHTML }) => replyWithHTML('⬅️', getMainKeyboard(i18n)));

module.exports = {
  about,
};
