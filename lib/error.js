const logger = require('winston');

module.exports.send = (res, err, message) => {
  logger.error(err);
  res.status(500).json({ message });
};
