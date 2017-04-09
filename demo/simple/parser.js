const esprima = require('esprima');
const escodegen = require('escodegen');
const estraverse = require('estraverse');
const util = require('util');

exports.parse = function parse(source) {
	return esprima.parse(source);
};

exports.print = function print(node) {
	return util.inspect(node, false, null);
};

exports.stringify = function stringify(node) {
	return escodegen.generate(node);
};

exports.transform = function transform(node, transformer) {
	return estraverse.replace(node, {
		enter: transformer
	});
};
