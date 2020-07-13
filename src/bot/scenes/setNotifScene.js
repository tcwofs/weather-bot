const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { getMainKeyboard, getConfigInline } = require('../keyboards');

// Greeter scene
const setNotif = new Scene('setNotifScene');

setNotif.enter(({ i18n, replyWithHTML }) => replyWithHTML(`${i18n.t('city')}`, getConfigInline(i18n)));
setNotif.action('exit', ({ scene }) => scene.enter('configScene'));

setNotif.hears(['⬅️Back', '⬅️Вернуться', '/cancel'], Stage.leave());
setNotif.on('message', (ctx) => ctx.reply('Send `hi`'));
setNotif.leave(({ i18n, replyWithHTML }) => replyWithHTML('⬅️', getMainKeyboard(i18n)));

module.exports = {
  setNotif,
};
