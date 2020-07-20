const axios = require('axios');

require('dotenv').config();

const emoji = {
  date: '📆',
  sunrise: '🌅',
  sunset: '🌇',
  temperature: '🌡',
  temp: {
    morn: '🌅',
    day: '🏙',
    eve: '🌇',
    night: '🌃',
    min: '🔽',
    max: '🔼',
  },
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
    '135': '↘️',
    '180': '⬇️',
    '225': '↙️',
    '270': '⬅️',
    '315': '↖️',
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
    `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly,daily&lang=${lang}&units=${units}&appid=${process.env.OPENWEATHER_TOKEN}`
  );

const getTimezone = async (country) =>
  await axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${country.coord.lat}&lon=${country.coord.lon}&exclude=minutely,hourly,daily,current&appid=${process.env.OPENWEATHER_TOKEN}`
  );

const getWheatherSevenDays = async (coord, units, lang) =>
  await axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&exclude=minutely,hourly,current&lang=${lang}&units=${units}&appid=${process.env.OPENWEATHER_TOKEN}`
  );

const getWindDirection = (wind_deg) => {
  let degree;
  let fault = 22.5;

  if (parseInt(wind_deg) > 360 - fault || parseInt(wind_deg) < 0 + fault) degree = '0';
  else if (parseInt(wind_deg) > fault && parseInt(wind_deg) < 45 + fault) degree = '45';
  else if (parseInt(wind_deg) > 45 + fault && parseInt(wind_deg) < 90 + fault) degree = '90';
  else if (parseInt(wind_deg) > 90 + fault && parseInt(wind_deg) < 135 + fault) degree = '135';
  else if (parseInt(wind_deg) > 135 + fault && parseInt(wind_deg) < 180 + fault) degree = '180';
  else if (parseInt(wind_deg) > 180 + fault && parseInt(wind_deg) < 225 + fault) degree = '225';
  else if (parseInt(wind_deg) > 225 + fault && parseInt(wind_deg) < 270 + fault) degree = '270';
  else if (parseInt(wind_deg) > 270 + fault && parseInt(wind_deg) < 315 + fault) degree = '315';

  return degree;
};

const formatCurrentMessage = (data, session, i18n) => {
  let sunrise = new Date(data.current.sunrise * 1000);
  let sunset = new Date(data.current.sunset * 1000);
  let sunriseHours = '0' + sunrise.getHours();
  let sunsetHours = '0' + sunset.getHours();
  let sunriseMinutes = '0' + sunrise.getMinutes();
  let sunsetMinutes = '0' + sunset.getMinutes();

  let degree = getWindDirection(data.current.wind_deg);

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

const formatSevenDaysMessage = (data, session, i18n) => {
  let message = '';
  for (let day = 0; day < data.daily.length; day++) {
    let time = new Date(data.daily[day].dt * 1000);
    let sunrise = new Date(data.daily[day].sunrise * 1000);
    let sunset = new Date(data.daily[day].sunset * 1000);
    let timeMonth = '0' + time.getMonth();
    let timeDate = '0' + time.getDate();
    let sunriseHours = '0' + sunrise.getHours();
    let sunriseMinutes = '0' + sunrise.getMinutes();
    let sunsetHours = '0' + sunset.getHours();
    let sunsetMinutes = '0' + sunset.getMinutes();

    let degree = getWindDirection(data.daily[day].wind_deg);

    message += `
<pre>${emoji.date}: ${timeDate.substr(-2) + '/' + timeMonth.substr(-2) + '/' + time.getFullYear()}
${emoji.sunrise}: ${sunriseHours.substr(-2)}:${sunriseMinutes.substr(-2)}\t\t\t\t\t\t\t${emoji.sunset}: ${sunsetHours.substr(
      -2
    )}:${sunsetMinutes.substr(-2)}
${emoji.humidity}: ${data.daily[day].humidity}%\t\t\t\t\t\t\t\t\t${emoji.dew}: ${data.daily[day].dew_point} ${
      session.units === 'metric' ? '°C' : '°F'
    } 
${emoji.pressure}: ${data.daily[day].pressure} ${i18n.t('unit_pressure')}\t\t\t\t${emoji.uvi}: ${data.daily[day].uvi}
${emoji.clouds}: ${data.daily[day].clouds}%\t\t\t\t\t\t\t\t\t${emoji.wind_degree[degree]}: ${data.daily[day].wind_speed} ${
      session.units === 'metric' ? i18n.t('unit_metres') : i18n.t('unit_miles')
    }
${emoji.temperature}:
\t\t${emoji.temp.morn}: ${data.daily[day].temp.morn} ${session.units === 'metric' ? '°C' : '°F'}\t\t${emoji.temp.min}: ${data.daily[day].temp.min} ${
      session.units === 'metric' ? '°C' : '°F'
    }
\t\t${emoji.temp.day}: ${data.daily[day].temp.day} ${session.units === 'metric' ? '°C' : '°F'}\t\t${emoji.temp.max}: ${data.daily[day].temp.max} ${
      session.units === 'metric' ? '°C' : '°F'
    }
\t\t${emoji.temp.eve}: ${data.daily[day].temp.eve} ${session.units === 'metric' ? '°C' : '°F'}
\t\t${emoji.temp.night}: ${data.daily[day].temp.night} ${session.units === 'metric' ? '°C' : '°F'}

${emoji.temperature_feel}:
\t\t${emoji.temp.morn}: ${data.daily[day].feels_like.morn} ${session.units === 'metric' ? '°C' : '°F'}
\t\t${emoji.temp.day}: ${data.daily[day].feels_like.day} ${session.units === 'metric' ? '°C' : '°F'}
\t\t${emoji.temp.eve}: ${data.daily[day].feels_like.eve} ${session.units === 'metric' ? '°C' : '°F'}
\t\t${emoji.temp.night}: ${data.daily[day].feels_like.night} ${session.units === 'metric' ? '°C' : '°F'} 
${emoji.weather[data.daily[day].weather[0].icon]}: ${data.daily[day].weather[0].description}
</pre>`;
  }
  return message;
};

const formatTimerMessage = (data, units, lang) => {
  let message = '';
  for (let day = 0; day < 2; day++) {
    let time = new Date(data.daily[day].dt * 1000);
    let sunrise = new Date(data.daily[day].sunrise * 1000);
    let sunset = new Date(data.daily[day].sunset * 1000);
    let timeMonth = '0' + time.getMonth();
    let timeDate = '0' + time.getDate();
    let sunriseHours = '0' + sunrise.getHours();
    let sunriseMinutes = '0' + sunrise.getMinutes();
    let sunsetHours = '0' + sunset.getHours();
    let sunsetMinutes = '0' + sunset.getMinutes();

    let degree = getWindDirection(data.daily[day].wind_deg);

    message += `
<pre>${emoji.date}: ${timeDate.substr(-2) + '/' + timeMonth.substr(-2) + '/' + time.getFullYear()}
${emoji.sunrise}: ${sunriseHours.substr(-2)}:${sunriseMinutes.substr(-2)}\t\t\t\t\t\t\t${emoji.sunset}: ${sunsetHours.substr(
      -2
    )}:${sunsetMinutes.substr(-2)}
${emoji.humidity}: ${data.daily[day].humidity}%\t\t\t\t\t\t\t\t\t${emoji.dew}: ${data.daily[day].dew_point} ${units === 'metric' ? '°C' : '°F'} 
${emoji.pressure}: ${data.daily[day].pressure} ${lang === 'en' ? 'hPa' : 'гПа'}\t\t\t\t${emoji.uvi}: ${data.daily[day].uvi}
${emoji.clouds}: ${data.daily[day].clouds}%\t\t\t\t\t\t\t\t\t${emoji.wind_degree[degree]}: ${data.daily[day].wind_speed} ${
      units === 'metric' ? (lang === 'en' ? 'm/s' : 'м/с') : lang === 'en' ? 'mph' : 'миль/ч'
    }
${emoji.temperature}:
\t\t${emoji.temp.morn}: ${data.daily[day].temp.morn} ${units === 'metric' ? '°C' : '°F'}\t\t${emoji.temp.min}: ${data.daily[day].temp.min} ${
      units === 'metric' ? '°C' : '°F'
    }
\t\t${emoji.temp.day}: ${data.daily[day].temp.day} ${units === 'metric' ? '°C' : '°F'}\t\t${emoji.temp.max}: ${data.daily[day].temp.max} ${
      units === 'metric' ? '°C' : '°F'
    }
\t\t${emoji.temp.eve}: ${data.daily[day].temp.eve} ${units === 'metric' ? '°C' : '°F'}
\t\t${emoji.temp.night}: ${data.daily[day].temp.night} ${units === 'metric' ? '°C' : '°F'}

${emoji.temperature_feel}:
\t\t${emoji.temp.morn}: ${data.daily[day].feels_like.morn} ${units === 'metric' ? '°C' : '°F'}
\t\t${emoji.temp.day}: ${data.daily[day].feels_like.day} ${units === 'metric' ? '°C' : '°F'}
\t\t${emoji.temp.eve}: ${data.daily[day].feels_like.eve} ${units === 'metric' ? '°C' : '°F'}
\t\t${emoji.temp.night}: ${data.daily[day].feels_like.night} ${units === 'metric' ? '°C' : '°F'} 
${emoji.weather[data.daily[day].weather[0].icon]}: ${data.daily[day].weather[0].description}
</pre>`;
  }
  return message;
};

module.exports = {
  getCurrentWheather,
  getTimezone,
  getWheatherSevenDays,
  formatCurrentMessage,
  formatTimerMessage,
  formatSevenDaysMessage,
};
