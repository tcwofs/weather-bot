const axios = require('axios');

require('dotenv').config();

const emoji = {
  sunrise: '🌅',
  sunset: '🌇',
  temperature: '🌡',
  temperature_feel: '🤒',
  humidity: '💧',
  pressure: '🕰',
  dew: '🌱',
  uvi: '🌞',
  clouds: '☁️',
  visibility: '👁',
  wind_speed: '💨',
  wind_degree: {
    '0': '⬆️',
    '45': '↗️',
    '90': '➡️',
    '130': '↘️',
    '180': '⬇️',
    '230': '↙️',
    '270': '⬅️',
    '320': '↖️',
  },
  weather: {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅️',
    '02n': '⛅️',
    '03d': '🌥',
    '03n': '🌥',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧',
    '09n': '🌧',
    '10d': '🌦',
    '10n': '🌦',
    '11d': '🌩',
    '11n': '🌩',
    '13d': '❄️',
    '13n': '❄️',
    '50d': '🌫',
    '50n': '🌫',
  },
};

const getCurrentWheather = async (coord, units, lang) =>
  await axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly,daily&lang=${lang}&units=${units}&appid=${process.env.OPENWHEATHER_TOKEN}`
  );

const getTimezone = async (country) =>
  await axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${country.coord.lat}&lon=${country.coord.lon}&exclude=minutely,hourly,daily,current&appid=${process.env.OPENWHEATHER_TOKEN}`
  );

const getWheatherSevenDays = async (coord, units, lang) =>
  await axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly,current&lang=${lang}&units=${units}&appid=${process.env.OPENWHEATHER_TOKEN}`
  );

const formatCurrentMessage = (data, session, i18n) => {
  let sunrise = new Date(data.current.sunrise * 1000);
  let sunset = new Date(data.current.sunset * 1000);
  let sunriseHours = '0' + sunrise.getHours();
  let sunsetHours = '0' + sunset.getHours();
  let sunriseMinutes = '0' + sunrise.getMinutes();
  let sunsetMinutes = '0' + sunset.getMinutes();

  let degree;
  let fault = 22.5;

  if (parseInt(data.current.wind_deg) > 360 - fault && parseInt(data.current.wind_deg) < 0 + fault) degree = '0';
  else if (parseInt(data.current.wind_deg) > fault && parseInt(data.current.wind_deg) < 45 + fault) degree = '45';
  else if (parseInt(data.current.wind_deg) > 45 + fault && parseInt(data.current.wind_deg) < 90 + fault) degree = '90';
  else if (parseInt(data.current.wind_deg) > 90 + fault && parseInt(data.current.wind_deg) < 135 + fault) degree = '135';
  else if (parseInt(data.current.wind_deg) > 135 + fault && parseInt(data.current.wind_deg) < 180 + fault) degree = '180';
  else if (parseInt(data.current.wind_deg) > 180 + fault && parseInt(data.current.wind_deg) < 225 + fault) degree = '225';
  else if (parseInt(data.current.wind_deg) > 225 + fault && parseInt(data.current.wind_deg) < 270 + fault) degree = '270';
  else if (parseInt(data.current.wind_deg) > 270 + fault && parseInt(data.current.wind_deg) < 315 + fault) degree = '315';

  return `
<pre>${emoji.sunrise}: ${sunriseHours.substr(-2)}:${sunriseMinutes.substr(-2)}\t\t\t\t\t\t\t${emoji.sunset}: ${sunsetHours.substr(
    -2
  )}:${sunsetMinutes.substr(-2)}
${emoji.temperature}: ${data.current.temp} ${session.units === 'metric' ? '°C' : '°F'}\t\t\t\t${emoji.temperature_feel}: ${data.current.feels_like} ${
    session.units === 'metric' ? '°C' : '°F'
  }
${emoji.humidity}: ${data.current.humidity}%\t\t\t\t\t\t\t\t\t${emoji.dew}: ${data.current.dew_point} ${session.units === 'metric' ? '°C' : '°F'} 
${emoji.pressure}: ${data.current.pressure} ${i18n.t('unit_pressure')}\t\t\t\t${emoji.uvi}: ${data.current.uvi}
${emoji.clouds}: ${data.current.clouds}%\t\t\t\t\t\t\t\t\t${emoji.visibility}: ${data.current.visibility} ${i18n.t('unit_m')}
${emoji.wind_degree[degree]}: ${data.current.wind_speed} ${session.units === 'metric' ? i18n.t('unit_metres') : i18n.t('unit_miles')}
${emoji.weather[data.current.weather[0].icon]}: ${data.current.weather[0].description}
</pre>
`;
};

const formatSevenDaysMessage = (data, session) => {};

const formatTimerMessage = (data, session) => {};

module.exports = {
  getCurrentWheather,
  getTimezone,
  getWheatherSevenDays,
  formatCurrentMessage,
  formatTimerMessage,
  formatSevenDaysMessage,
};
