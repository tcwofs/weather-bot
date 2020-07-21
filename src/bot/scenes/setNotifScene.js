const Scene = require('telegraf/scenes/base');
const { getBackKeyboard } = require('../keyboards');

const setNotif = new Scene('setNotifScene');

setNotif.enter(({ i18n, replyWithHTML, session }) => {
  let notifications = session.notif.map((el) => `${el.name}: ${el.time !== null ? `<b>${el.time}</b>` : `<b>${i18n.t('not_set')}</b>`}\n`).join('');
  return [replyWithHTML(`${i18n.t('notif')}`, getBackKeyboard(i18n)), replyWithHTML(`${notifications}`)];
});
setNotif.hears(['⬅️Back', '⬅️Вернуться', '/cancel'], ({ scene }) => scene.enter('configScene'));
setNotif.hears(/\d \d?\d:\d\d/, ({ i18n, replyWithHTML, message, session, sessionDB }) => {
  if (!session.country) {
    return replyWithHTML(i18n.t('city_null'));
  }
  let num = message.text.split(' ')[0];
  let time = message.text.split(' ')[1];
  let hours = +time.split(':')[0];
  let minutes = +time.split(':')[1];

  if (num > session.notif.length) return replyWithHTML(`${i18n.t('notif_sorry')}`);
  if ((hours > 23 && minutes > 0) || hours < 0 || minutes < 0) return replyWithHTML(`${i18n.t('time_err')}`);

  let pushData = {
    id: `${message.chat.id}`,
    index: `${num}`,
    coord: session.country.coord,
    lang: session.__language_code,
    units: session.units,
  };

  let previous = session.notif[num - 1].time;
  if (previous) {
    let previousHours = +previous.split(':')[0] - session.offset;
    let previousMinutes = +previous.split(':')[1];
    let indexTime = sessionDB.__wrapped__.alerts.findIndex(
      (el) => el.time === `0${previousHours}`.substr(-2) + ':' + `0${previousMinutes}`.substr(-2)
    );
    let indexAlert = sessionDB.__wrapped__.alerts[indexTime].arr.findIndex((el) => el.id === pushData.id && el.index === pushData.index);
    sessionDB.__wrapped__.alerts[indexTime].arr.splice(indexAlert, 1);
  }
  session.notif[num - 1].time = `0${hours}`.substr(-2) + ':' + `0${minutes}`.substr(-2);
  let index = sessionDB.__wrapped__.alerts.findIndex((el) => el.time === `0${hours - session.offset}`.substr(-2) + ':' + `0${minutes}`.substr(-2));
  if (index !== -1) {
    sessionDB.__wrapped__.alerts[index].arr.push(pushData);
  } else {
    sessionDB.__wrapped__.alerts.push({ time: `0${hours - session.offset}`.substr(-2) + ':' + `0${minutes}`.substr(-2), arr: [pushData] });
  }

  let notifications = session.notif.map((el) => `${el.name}: ${el.time !== null ? `<b>${el.time}</b>` : `<b>${i18n.t('not_set')}</b>`}\n`).join('');

  return replyWithHTML(`${notifications}`);
});
setNotif.on('text', ({ replyWithHTML, i18n }) => replyWithHTML(`${i18n.t('time_err')}`));
module.exports = {
  setNotif,
};
