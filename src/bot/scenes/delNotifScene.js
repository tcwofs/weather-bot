const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { getMainKeyboard, getConfigInline } = require('../keyboards');

// Greeter scene
const delNotif = new Scene('delNotifScene');

delNotif.enter(({ i18n, replyWithHTML }) => replyWithHTML(`${i18n.t('city')}`, getConfigInline(i18n)));
delNotif.action('exit', ({ scene }) => scene.enter('configScene'));

delNotif.hears(['⬅️Back', '⬅️Вернуться', '/cancel'], Stage.leave());
delNotif.on('message', (ctx) => ctx.reply('Send `hi`'));
delNotif.leave(({ i18n, replyWithHTML }) => replyWithHTML('⬅️', getMainKeyboard(i18n)));

module.exports = {
  delNotif,
};
