const esprima = require('esprima');
require('lively.lang');
const ast = require('lively.ast');

exports.parse = function parse(source) {
	return esprima.parse(source);
};

exports.print = function print(node) {
	return ast.printAst(node);
};

exports.stringify = function stringify(node) {
	return ast.stringify(node);
};
