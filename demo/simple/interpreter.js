const errors = require('./errors');

const global = {};
const nodes = {
	program: 'Program',
	variableDeclaration: 'VariableDeclaration',
	expressionStatement: 'ExpressionStatement',
	binaryExpression: 'BinaryExpression',
	logicalExpression: 'LogicalExpression',
	identifier: 'Identifier',
	literal: 'Literal'
};

function evaluate(node, environment) {
	if (environment === undefined) {
		environment = global;
	}

	switch (node.type) {
		case nodes.program:
			return evaluateStatements(node.body, environment);
		case nodes.expressionStatement:
			return evaluate(node.expression, environment);
		case nodes.variableDeclaration:
			return evaluateVariableDeclaration(node.declarations, environment);
		case nodes.binaryExpression:
			return evaluateBinaryExpression(node.operator, node.left, node.right, environment);
		case nodes.logicalExpression:
			return evaluateLogicalExpression(node.operator, node.left, node.right, environment);
		case nodes.identifier:
			return evaluateIdentifier(node.name, environment);
		case nodes.literal:
			return node.value;
		default:
			console.error("Unknown node", node);
			throw new errors.ParseError();
	}
}

function evaluateStatements(nodes, environment) { // array of nodes
	let result;
	for (let node of nodes) {
		result = evaluate(node, environment);
	}

	return result;
}

function evaluateVariableDeclaration(declarations, environment) {
	for (let declaration of declarations) {
		environment[declaration.id.name] = evaluate(declaration.init, environment);
	}

	return undefined;
}

const binaryFunctions = {
	'+': (a, b) => a + b,
	'-': (a, b) => a - b,
	'*': (a, b) => a * b,
	'/': (a, b) => a / b,
};

function evaluateBinaryExpression(operator, left, right, environment) {
	let func = binaryFunctions[operator];
	if (!func) {
		throw new errors.ParseError();
	}

	return func(evaluate(left, environment), evaluate(right, environment));
}

function evaluateLogicalExpression(operator, left, right, environment) {
	let lhs = evaluate(left, environment);

	switch (operator) {
		case '||':
			if (lhs) {
				return lhs;
			}
			return evaluate(right, environment);

		case '&&':
			if (!lhs) {
				return lhs;
			}
			return evaluate(right, environment);

		default:
			throw new errors.ParseError();
	}
}

function evaluateIdentifier(identifier, environment) {
	while (environment) {
		if (environment.hasOwnProperty(identifier)) {
			return environment[identifier];
		}

		environment = environment.parent;
	}

	return undefined;
}

function apply(node) {
}

exports = module.exports = evaluate;
