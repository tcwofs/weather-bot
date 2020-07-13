const Scene = require('telegraf/scenes/base');
const { getBackKeyboard, getConfirmInline } = require('../keyboards');
const data = require('../../city.list.min.json');

let country;

const city = new Scene('setCityScene');

city.enter(({ i18n, replyWithHTML }) => replyWithHTML(`${i18n.t('city')}`, getBackKeyboard(i18n)));
city.hears(['⬅️Back', '⬅️Вернуться', '/cancel'], ({ scene }) => scene.enter('configScene'));
city.on('text', ({ i18n, replyWithHTML, message }) => {
  country = data.find((el) => el.name.toLowerCase() === message.text.toLowerCase());
  if (country) {
    return replyWithHTML(`${i18n.t('city_q')}: ${country.name}, ${country.country}`, getConfirmInline());
  } else {
    return replyWithHTML(`${i18n.t('city_err')}`);
  }
});
city.action('confirm', ({ deleteMessage, session, scene, replyWithHTML, i18n }) => {
  session.country = country;
  return [deleteMessage(), replyWithHTML(`${i18n.t('city_set')}: ${country.name}, ${country.country}`), scene.enter('configScene')];
});

module.exports = {
  city,
};
