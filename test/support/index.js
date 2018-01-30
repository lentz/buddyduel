global.assert = require('assert');

// Fix Mocha colors for Solarized
const { colors } = require('mocha/lib/reporters/base');

colors.pass = '92';
colors['error message'] = '37;41';
colors['error stack'] = '0';
