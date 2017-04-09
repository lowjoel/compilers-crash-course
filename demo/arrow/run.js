const parser = require('../simple/parser');

exports = module.exports = function main() {
	// language=JavaScript
	const program=`
		var a = (x) => x * 2;
		var b = (y) => { var z = 2 * y; return z - y; };
`;

	let result = transform(program, transpileArrowFunctions);
	console.log(parser.stringify(result));
};

function transform(program, transformer) {
	let tree = parser.parse(program);
	return parser.transform(tree, transformer);
}

function transpileArrowFunctions(node) {
	if (node.type !== 'ArrowFunctionExpression') {
		return node;
	}

	let body = node.body;
	if (body.type !== 'BlockStatement') {
		body = {
			type: 'BlockStatement',
			body: [{
				type: 'ReturnStatement',
				argument: body
			}]
		};
	}

	return {
		type: 'FunctionExpression',
		id: node.id,
		params: node.params,
		body: body,
		generator: false,
		async: false,
		expression: false,
	}
}

if (typeof module !== 'undefined' && require.main === module) {
	exports(process.argv.slice(1));
}
