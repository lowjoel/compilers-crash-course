const esprima = require('esprima');

exports = module.exports = function parse(source) {
	return esprima.parse(source);
};
