const Scene = require('telegraf/scenes/base');
const { getBackKeyboard } = require('../keyboards');

const about = new Scene('aboutScene');

about.enter(({ i18n, replyWithHTML }) => replyWithHTML(`${i18n.t('about')}`, getBackKeyboard(i18n)));
about.hears(['⬅️Back', '⬅️Вернуться', '/cancel'], ({ scene }) => scene.enter('configScene'));
about.on('message', (ctx) => ctx.reply('about'));

module.exports = {
  about,
};
