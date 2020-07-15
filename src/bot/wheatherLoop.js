const axios = require('axios');

const startWheatherLoop = (bot, localSession) => {
  setInterval(async () => {
    let counter = 0;
    let now = new Date();
    if (now.getUTCHours() === 0 && now.getMinutes === 0 && now.getSeconds === 0 && now.getMilliseconds === 0)
      for (let alert = 0; alert < localSession.DB.__wrapped__.alerts.length; alert++) {
        localSession.DB.__wrapped__.alerts[alert].ticked = false;
      }
    for (let alert = 0; alert < localSession.DB.__wrapped__.alerts.length; alert++) {
      if (
        now.getUTCHours() + parseInt(localSession.DB.__wrapped__.alerts[alert].offset) ===
          parseInt(localSession.DB.__wrapped__.alerts[alert].hours) &&
        now.getMinutes() === parseInt(localSession.DB.__wrapped__.alerts[alert].minutes)
      ) {
        if (counter === 30) await sleep(1000);
        if (localSession.DB.__wrapped__.alerts[alert].ticked === false) {
          let res = await axios.get(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${localSession.DB.__wrapped__.alerts[alert].coord.lat}&lon=${localSession.DB.__wrapped__.alerts[alert].coord.lon}&exclude=minutely,hourly,daily&appid=6c37268219474796a4d4249f353b852f`
          );
          bot.telegram.sendMessage(localSession.DB.__wrapped__.alerts[alert].id, res.data);
          localSession.DB.__wrapped__.alerts[alert].ticked = true;
          counter++;
        }
      }
    }
  }, 1000);
};

module.exports = {
  startWheatherLoop,
};
