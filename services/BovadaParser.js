const jp = require('jsonpath');

module.exports.call = json => jp.query(JSON.parse(json), '$..items[?(@.type=="NFL")]');
