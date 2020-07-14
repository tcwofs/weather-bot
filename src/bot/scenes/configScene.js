const Scene = require('telegraf/scenes/base');
const { getMainKeyboard, getConfigKeyboard } = require('../keyboards');

const config = new Scene('configScene');

config.enter(({ i18n, replyWithHTML }) => replyWithHTML(`${i18n.t('config')}`, getConfigKeyboard(i18n)));
config.hears(['⬅️Back', '⬅️Вернуться', '/cancel'], ({ scene }) => scene.enter('mainScene'));
config.hears(['🏢Set city', '🏢Указать город'], ({ scene }) => scene.enter('setCityScene'));
config.hears(['🕐Set notification', '🕐Уст. напоминание'], ({ scene }) => scene.enter('setNotifScene'));
config.hears(['❌Delete notification', '❌Уд. напоминание'], ({ scene }) => scene.enter('delNotifScene'));
config.hears(['ℹ️About', 'ℹ️О проекте'], ({ scene }) => scene.enter('aboutScene'));
config.on('message', ({ i18n, replyWithHTML }) => replyWithHTML(`${i18n.t('config')}`));
config.leave(({ i18n, replyWithHTML }) => replyWithHTML('⬅️', getMainKeyboard(i18n)));

module.exports = {
  config,
};
