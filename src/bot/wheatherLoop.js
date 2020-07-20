const { getWheatherSevenDays, formatTimerMessage } = require('./wheather');
const CronJob = require('cron').CronJob;

const startWheatherLoop = (bot, localSession) => {
  let job = new CronJob(
    '0 * * * * *',
    async () => {
      let counter = 0;
      let calls = 0;
      let now = new Date();
      let time = `0${now.getUTCHours()}`.substr(-2) + ':' + `0${now.getMinutes()}`.substr(-2);

      let index = localSession.DB.__wrapped__.alerts.findIndex((el) => el.time === time);

      if (index !== -1) {
        if (counter === 30) await sleep(1000);
        for (let alert = 0; alert < localSession.DB.__wrapped__.alerts[index].arr.length; alert++) {
          let answer;
          if (calls === 59) {
            answer =
              localSession.DB.__wrapped__.alerts[index].arr[alert].lang === 'en'
                ? `Sorry. If you recieved this message please reschedule you notification, because there is limit 60 calls per minute for everyone`
                : 'Извините. Если вы получили данное сообщение, то пожалуйста перепланируйте ваши уведомления, так как лимит существует ливит в 60 вызовов в минуту';
          } else {
            let res = await getWheatherSevenDays(
              localSession.DB.__wrapped__.alerts[index].arr[alert].coord,
              localSession.DB.__wrapped__.alerts[index].arr[alert].units,
              localSession.DB.__wrapped__.alerts[index].arr[alert].lang
            );
            answer = formatTimerMessage(
              res.data,
              localSession.DB.__wrapped__.alerts[index].arr[alert].units,
              localSession.DB.__wrapped__.alerts[index].arr[alert].lang
            );
          }
          bot.telegram.sendMessage(localSession.DB.__wrapped__.alerts[index].arr[alert].id, answer, { parse_mode: 'html' });
          counter++;
          calls++;
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
