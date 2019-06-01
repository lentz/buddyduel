const crypto = require('crypto');

module.exports = content => crypto.createHash('md5').update(content).digest('hex');
