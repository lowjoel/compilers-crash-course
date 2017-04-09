exports = module.exports = function transpileArrowFunctions(node) {
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
};
