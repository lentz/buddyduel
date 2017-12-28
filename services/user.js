const requestPromise = require('request-promise-native');

async function getToken() {
  const options = {
    url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
    headers: { 'content-type': 'application/json' },
    body: {
      grant_type: 'client_credentials',
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `https://${process.env.AUTH0_DOMAIN}/api/v2/`,
    },
    json: true,
  };

  return (await requestPromise.post(options)).access_token;
}

module.exports.getInfo = async (userId) => {
  const options = {
    url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
    headers: { Authorization: `Bearer ${await getToken()}` },
    json: true,
  };
  return requestPromise(options);
};

module.exports.updateMetadata = async (userId, userMetadata) => {
  const options = {
    method: 'PATCH',
    url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
    headers: { Authorization: `Bearer ${await getToken()}` },
    json: true,
    body: { user_metadata: userMetadata },
  };
  return requestPromise(options);
};
