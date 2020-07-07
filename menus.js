const TelegrafInlineMenu = require('telegraf-inline-menu');

const menu = new TelegrafInlineMenu((ctx) => `Hey ${ctx.from.first_name}!`);
menu.setCommand('bye');
menu.simpleButton('I am excited!', 'a', {
  doFunc: (ctx) => ctx.reply('As am I!'),
});

module.exports = {
  menu,
};
