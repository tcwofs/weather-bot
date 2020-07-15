const Scene = require('telegraf/scenes/base');
const { getBackKeyboard } = require('../keyboards');

const setNotif = new Scene('setNotifScene');

setNotif.enter(({ i18n, replyWithHTML, session }) => {
  let notifications = session.notif.map((el) => `${el.name}: ${el.time !== null ? `<b>${el.time}</b>` : `<b>${i18n.t('not_set')}</b>`}\n`).join('');
  return [replyWithHTML(`${i18n.t('notif')}`, getBackKeyboard(i18n)), replyWithHTML(`${notifications}`)];
});
setNotif.hears(['⬅️Back', '⬅️Вернуться', '/cancel'], ({ scene }) => scene.enter('configScene'));
setNotif.hears(/\d \d\d:\d\d/, ({ i18n, replyWithHTML, message, session }) => {
  let num = message.text.split(' ')[0];
  let time = message.text.split(' ')[1];
  let hours = +time.split(':')[0];
  let minutes = +time.split(':')[1];

  if (num > session.notif.length) return replyWithHTML(`${i18n.t('notif_sorry')}`);
  if (hours > 23 && minutes > 0) return replyWithHTML(`${i18n.t('time_err')}`);

  session.notif[num - 1].time = time;
  let notifications = session.notif.map((el) => `${el.name}: ${el.time !== null ? `<b>${el.time}</b>` : `<b>${i18n.t('not_set')}</b>`}\n`).join('');
  return replyWithHTML(`${notifications}`);
});
setNotif.on('text', ({ replyWithHTML, i18n }) => replyWithHTML(`${i18n.t('time_err')}`));
module.exports = {
  setNotif,
};
