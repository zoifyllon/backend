const axios = require('axios');

const predict = async(url) => {
  const apiResponse = await axios.get(process.env.DETECT_API_URL + url);
  if ('error' in apiResponse.data) {
    throw new Error(apiResponse.data["error"]);
  }
  console.log(apiResponse.data);
  return apiResponse.data;
}

module.exports = { predict } 