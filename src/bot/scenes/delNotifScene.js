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
delNotif.action(/\d/, async ({ getChat, sessionDB, i18n, match, session, replyWithHTML, message }) => {
  let chatInfo = await getChat();
  let alert = session.notif[match[0] - 1];

  if (alert.time !== null) {
    let index = sessionDB.__wrapped__.alerts.findIndex((el) => el.id === chatInfo.id.toString() && el.index === match[0]);

    if (index !== -1) {
      sessionDB.__wrapped__.alerts.splice(index, 1);
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
