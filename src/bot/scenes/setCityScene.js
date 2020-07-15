const Scene = require('telegraf/scenes/base');
const { getBackKeyboard, getConfirmInline } = require('../keyboards');
const data = require('../../city.list.min.json');
const axios = require('axios');

require('dotenv').config();

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
city.action('confirm', async ({ deleteMessage, session, scene, replyWithHTML, i18n }) => {
  session.country = country;
  console.log(country);
  let res = await axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${country.coord.lat}&lon=${country.coord.lon}&exclude=minutely,hourly,daily,current&appid=${process.env.OPENWHEATHER_TOKEN}`
  );
  console.log(res);
  session.offset = res.data.timezone_offset / 60 / 60;
  return [deleteMessage(), replyWithHTML(`${i18n.t('city_set')}: ${country.name}, ${country.country}`), scene.enter('configScene')];
});

module.exports = {
  city,
};
