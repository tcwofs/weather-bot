const Scene = require('telegraf/scenes/base');
const { getMainKeyboard, getConfigKeyboard } = require('../keyboards');

const config = new Scene('configScene');

config.enter(({ i18n, replyWithHTML, session }) => replyWithHTML(`${i18n.t('config')}`, getConfigKeyboard(i18n, session.units)));
config.hears(['⬅️Back', '⬅️Вернуться', '/cancel'], ({ scene }) => scene.enter('mainScene'));
config.hears(['🏢Set city', '🏢Указать город'], ({ scene }) => scene.enter('setCityScene'));
config.hears(['🕐Set notification', '🕐Уст. напоминание'], ({ scene }) => scene.enter('setNotifScene'));
config.hears(['❌Delete notification', '❌Уд. напоминание'], ({ scene }) => scene.enter('delNotifScene'));
config.hears(['ℹ️About', 'ℹ️О проекте'], ({ scene }) => scene.enter('aboutScene'));
config.hears(/🧮.+/, ({ session, replyWithHTML, i18n }) => {
  session.units === 'metric' ? (session.units = 'imperial') : (session.units = 'metric');
  replyWithHTML(`${i18n.t('unit_changed')} ${session.units === 'metric' ? '°C' : '°F'}`, getConfigKeyboard(i18n, session.units));
});
config.on('message', ({ i18n, replyWithHTML }) => replyWithHTML(`${i18n.t('config')}`));
config.leave(({ i18n, replyWithHTML }) => replyWithHTML('⬅️', getMainKeyboard(i18n)));

module.exports = {
  config,
};
