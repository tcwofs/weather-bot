const { config } = require('./configScene');
const { city } = require('./setCityScene');
const { main } = require('./mainScene');
const { about } = require('./aboutScene');
const { delNotif } = require('./delNotifScene');
const { setNotif } = require('./setNotifScene');

module.exports = {
  city,
  config,
  main,
  about,
  delNotif,
  setNotif,
};
