const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { getMainKeyboard, getConfigKeyboard } = require('../keyboards');

// Greeter scene
const config = new Scene('config');
config.enter(({ i18n, replyWithHTML }) => {
  replyWithHTML(`${i18n.t('config')}`, getConfigKeyboard(i18n));
});

config.hears(['⬅️Back', '⬅️Вернуться', '/cancel'], Stage.leave());
config.hears(['⬅️Back', '⬅️Вернуться'], Stage.leave());
config.hears(['⬅️Back', '⬅️Вернуться'], Stage.leave());
config.hears(['⬅️Back', '⬅️Вернуться'], Stage.leave());
config.on('message', (ctx) => ctx.reply('Send `hi`'));

config.leave(({ i18n, replyWithHTML }) => replyWithHTML('⬅️', getMainKeyboard(i18n)));

module.exports = {
  config,
};
