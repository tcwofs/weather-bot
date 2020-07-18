const { getWheatherSevenDays } = require('./wheather');
const CronJob = require('cron').CronJob;

const startWheatherLoop = (bot, localSession) => {
  let job = new CronJob(
    '0 * * * * *',
    async () => {
      let counter = 0;
      let now = new Date();
      let time = `0${now.getUTCHours()}`.substr(-2) + ':' + `0${now.getMinutes()}`.substr(-2);

      let index = localSession.DB.__wrapped__.alerts.findIndex((el) => el.time === time);

      if (index !== -1) {
        if (counter === 30) await sleep(1000);
        for (let alert = 0; alert < localSession.DB.__wrapped__.alerts[index].arr.length; alert++) {
          console.log(alert);
          let res = await getWheatherSevenDays(localSession.DB.__wrapped__.alerts[index].arr[alert].coord);
          let answer = formatTimerMessage();
          bot.telegram.sendMessage(localSession.DB.__wrapped__.alerts[index].arr[alert].id, res.data);
          counter++;
        }
      }
    },
    null,
    true,
    'Greenwich'
  );

  job.start();
};

module.exports = {
  startWheatherLoop,
};
