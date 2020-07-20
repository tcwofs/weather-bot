const Scene = require('telegraf/scenes/base');
const { getNotifInline, getBackKeyboard } = require('../keyboards');

const delNotif = new Scene('delNotifScene');

delNotif.enter(({ i18n, replyWithHTML, session }) => {
  let notifications = session.notif.filter((el) => el.time !== null);
  if (notifications.length > 0) {
    return [
      replyWithHTML(`${i18n.t('notif_del')}`, getBackKeyboard(i18n)),
      replyWithHTML(`${notifications.map((el) => `${el.name}: <b>${el.time}</b>\n`).join('')}`, getNotifInline(notifications)),
    ];
  } else {
    return replyWithHTML(`${i18n.t('notif_del_null')}`, getBackKeyboard(i18n));
  }
});
delNotif.hears(['⬅️Back', '⬅️Вернуться', '/cancel'], ({ scene }) => scene.enter('configScene'));
delNotif.action(/\d \d?\d:\d\d/, async ({ getChat, sessionDB, i18n, match, session, replyWithHTML, message }) => {
  let chatInfo = await getChat();
  let num = match[0].split(' ')[0];
  let time = match[0].split(' ')[1];
  let hours = `0${+time.split(':')[0] - session.offset}`.substr(-2);
  let minutes = `0${+time.split(':')[1]}`.substr(-2);
  time = `${hours}:${minutes}`;

  let alert = session.notif[num - 1];

  if (alert.time !== null) {
    let indexTime = sessionDB.__wrapped__.alerts.findIndex((el) => el.time === time);

    if (indexTime !== -1) {
      let indexAlert = sessionDB.__wrapped__.alerts[indexTime].arr.findIndex((el) => el.id === chatInfo.id.toString() && el.index === num);
      sessionDB.__wrapped__.alerts[indexTime].arr.splice(indexAlert, 1);
      alert.time = null;
    }

    return replyWithHTML(i18n.t('notif_del_confirm'));
  } else {
    return replyWithHTML(i18n.t('notif_deleted'));
  }
});

module.exports = {
  delNotif,
};
