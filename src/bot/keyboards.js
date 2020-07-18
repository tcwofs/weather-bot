const { Markup } = require('telegraf');

const getMainKeyboard = (i18n) =>
  Markup.keyboard([[`${i18n.t('wheather_current')}`, `${i18n.t('wheather_days')}`], [`${i18n.t('config_label')}`]])
    .resize()
    .extra();

const getConfigKeyboard = (i18n, units) =>
  Markup.keyboard([
    [`${i18n.t('city_label')}`, `${i18n.t('unit_label')} ${units === 'metric' ? `°C | ${i18n.t('unit_metres')}` : `°F | ${i18n.t('unit_miles')}`}`],
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

const getNotifInline = (notifications) => {
  let buttons = [];
  for (let i = 1; i <= notifications.length; i++) {
    buttons.push(Markup.callbackButton(`${notifications[i - 1].name}`, `${notifications[i - 1].name} ${notifications[i - 1].time}`));
  }
  return Markup.inlineKeyboard(buttons).extra();
};

module.exports = {
  getMainKeyboard,
  getConfigKeyboard,
  getLangInline,
  getBackKeyboard,
  getConfirmInline,
  getNotifInline,
};
