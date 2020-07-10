const axios = require('axios');

require('dotenv').config();

const getCurrentWheather = async ({ city }) => {
  let res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWHEATHER_TOKEN}`);
  let { data } = res.data;
  return data;
};

module.exports = {
  getCurrentWheather,
};
