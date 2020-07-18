const Scene = require('telegraf/scenes/base');
const { getBackKeyboard, getConfirmInline } = require('../keyboards');
const data = require('../../city.list.min.json');
const { getTimezone } = require('../wheather');

require('dotenv').config();

let country;

const city = new Scene('setCityScene');

city.enter(({ i18n, replyWithHTML }) => replyWithHTML(`${i18n.t('city')}`, getBackKeyboard(i18n)));
city.hears(['⬅️Back', '⬅️Вернуться', '/cancel'], ({ scene }) => scene.enter('configScene'));
city.on('text', ({ i18n, replyWithHTML, message }) => {
  let input = message.text.split(' ');
  if (input.length === 2) {
    country = data.find((el) => el.name.toLowerCase() === input[0].toLowerCase() && el.country.toLowerCase() === input[1].toLowerCase());
  } else if (input.length === 1) {
    country = data.find((el) => el.name.toLowerCase() === input[0].toLowerCase());
  } else {
    country = null;
  }

  if (country) {
    return replyWithHTML(`${i18n.t('city_q')}: ${country.name}, ${country.country}`, getConfirmInline());
  } else {
    return replyWithHTML(`${i18n.t('city_err')}`);
  }
});
city.action('confirm', async ({ deleteMessage, session, scene, replyWithHTML, i18n }) => {
  session.country = country;
  let res = await getTimezone(country);
  session.offset = res.data.timezone_offset / 60 / 60;
  return [deleteMessage(), replyWithHTML(`${i18n.t('city_set')}: ${country.name}, ${country.country}`), scene.enter('configScene')];
});

module.exports = {
  city,
};
