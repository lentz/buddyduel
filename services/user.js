const request = require('request');
const async = require('async');

function getToken(cb) {
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

  request.post(options, (err, _res, body) => {
    if (err) { return cb(err); }
    return cb(null, body.access_token);
  });
}

module.exports.getInfo = (userId, cb) => {
  async.waterfall([
    getToken,
    (token, waterfall) => {
      const options = {
        url: `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
        headers: { Authorization: `Bearer ${token}` },
        json: true,
      };
      request(options, (err, _res, body) => waterfall(err, body));
    },
  ], cb);
};
