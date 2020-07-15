const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const { getMainKeyboard } = require('../keyboards');
const { getCurrentWheather } = require('../wheather');

const main = new Scene('mainScene');

main.enter(({ i18n, replyWithHTML }) => replyWithHTML(`${i18n.t('main')}`, getMainKeyboard(i18n)));
main.hears(['⚙️настройки', '⚙️configuration'], ({ scene }) => scene.enter('configScene'));
main.hears(['/cancel'], Stage.leave());

module.exports = {
  main,
};
