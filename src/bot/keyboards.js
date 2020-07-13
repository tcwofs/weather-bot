const { Markup } = require('telegraf');

const getMainKeyboard = (i18n) =>
  Markup.keyboard([['', ''], [`${i18n.t('config_label')}`]])
    .resize()
    .extra();

const getConfigKeyboard = (i18n) =>
  Markup.keyboard([
    [`${i18n.t('city_label')}`],
    [`${i18n.t('set_alarm_label')}`, `${i18n.t('del_alarm_label')}`],
    [`${i18n.t('about_label')}`],
    [`${i18n.t('back_label')}`],
  ])
    .resize()
    .oneTime()
    .extra();

const getLangInline = () => Markup.inlineKeyboard([Markup.callbackButton('🇷🇺', 'ru'), Markup.callbackButton('🇺🇸', 'en')]).extra();

const getBackKeyboard = (i18n) =>
  Markup.keyboard([[`${i18n.t('back_label')}`]])
    .resize()
    .oneTime()
    .extra();

const getConfirmInline = () => Markup.inlineKeyboard([Markup.callbackButton('✅', 'confirm')]).extra();

module.exports = {
  getMainKeyboard,
  getConfigKeyboard,
  getLangInline,
  getBackKeyboard,
  getConfirmInline,
};
