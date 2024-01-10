const axios = require('axios');

const SPACE_X_API_URL = 'https://api.spacexdata.com/v4';

const axiosConfig = {
  baseURL: SPACE_X_API_URL,
};

const axiosInstance = axios.create(axiosConfig);

async function getSpaceXLaunches () {
  const { data } = await axiosInstance.post('/launches/query', {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: 'rocket',
          select: {
            name: 1
          }
        },
        {
          path: 'payloads',
          select: {
            customers: 1
          }
        }
      ]
    }
  });

  return data.docs;
}

module.exports = {
  getSpaceXLaunches
}
