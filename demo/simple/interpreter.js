const errors = require('./errors');

class Environment {
	constructor(parent) {
		this.parent = parent;
		this.entries = {};
	}

	static fromObject(parent, object) {
		let result = new Environment(parent);

		for (let key in object) {
			if (!object.hasOwnProperty(key)) {
				continue;
			}

			result.define(key, object[key]);
		}

		return result;
	}

	define(identifier, value) {
		this.entries[identifier] = value;
		return value;
	}

	lookup(identifier) {
		let environment = this;
		while (environment) {
			if (environment.entries.hasOwnProperty(identifier)) {
				return environment.entries[identifier];
			}

			environment = environment.parent;
		}

		return undefined;
	}
}

function FunctionValue(name, params, body, environment) {
	// This is a thunk for normal JavaScript methods to invoke the interpreter.
	let result = (new Function('apply', `
		return function ${name}() {
			return apply(arguments.callee, arguments);
		};`))(apply);

	result.parameters = params;
	result.body = body;
	result.environment = environment;
	return result;
}

class ControlFlowValue {
	constructor(value) {
		this.value = value;
	}
}

class ReturnValue extends ControlFlowValue {
}

const global = new Environment();
const nodes = {
	program: 'Program',
	blockStatement: 'BlockStatement',
	variableDeclaration: 'VariableDeclaration',
	functionDeclaration: 'FunctionDeclaration',
	expressionStatement: 'ExpressionStatement',
	ifStatement: 'IfStatement',
	returnStatement: 'ReturnStatement',
	functionExpression: 'FunctionExpression',
	callExpression: 'CallExpression',
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
		case nodes.blockStatement:
			return evaluateStatements(node.body, environment);
		case nodes.variableDeclaration:
			return evaluateVariableDeclaration(node.declarations, environment);
		case nodes.functionDeclaration:
			return evaluateFunctionDeclaration(node.id.name, node.params, node.body, environment);
		case nodes.expressionStatement:
			return evaluate(node.expression, environment);
		case nodes.ifStatement:
			return evaluateIfStatement(node.test, node.consequent, node.alternate, environment);
		case nodes.returnStatement:
			return evaluateReturnStatement(node.argument, environment);
		case nodes.functionExpression:
			return evaluateFunctionExpression(node.id ? node.id.name : "", node.params, node.body, environment);
		case nodes.callExpression:
			return evaluateCallExpression(node.callee, node.arguments, environment);
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

		if (result instanceof ControlFlowValue) {
			return result;
		}
	}

	return result;
}

function evaluateIfStatement(test, consequent, alternative, environment) {
	if (evaluate(test, environment)) {
		return evaluate(consequent, environment);
	} else if (alternative !== null) {
		return evaluate(alternative, environment);
	}

	return undefined;
}

function evaluateReturnStatement(argument, environment) {
	if (argument === null) {
		return new ReturnValue(undefined);
	}

	return new ReturnValue(evaluate(argument, environment));
}

function evaluateVariableDeclaration(declarations, environment) {
	for (let declaration of declarations) {
		environment.define(declaration.id.name, evaluate(declaration.init, environment));
	}

	return undefined;
}

function evaluateFunctionDeclaration(name, params, body, environment) {
	let result = evaluateFunctionExpression(name, params, body, environment);
	environment.define(name, result);

	return result;
}

function evaluateFunctionExpression(name, params, body, environment) {
	return new FunctionValue(name, params, body, environment);
}

function evaluateCallExpression(callee, parameters, environment) {
	let f = evaluate(callee, environment);
	let params = [];

	for (let p of parameters) {
		params.push(evaluate(p, environment));
	}

	return apply(f, params);
}

const binaryFunctions = {
	'+': (a, b) => a + b,
	'-': (a, b) => a - b,
	'*': (a, b) => a * b,
	'/': (a, b) => a / b,
	'%': (a, b) => a % b,
	'===': (a, b) => a === b,
	'!==': (a, b) => a !== b
};

function evaluateBinaryExpression(operator, left, right, environment) {
	let func = binaryFunctions[operator];
	if (!func) {
		throw new errors.ParseError('Unknown operator: ' + operator);
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
			throw new errors.ParseError('Unknown operator: ' + operator);
	}
}

function evaluateIdentifier(identifier, environment) {
	return environment.lookup(identifier);
}

function apply(f, params) {
	if (f && f.hasOwnProperty('environment')) {
		return applyInterpreterFunction(f, params);
	}

	return f.apply(null, params);
}

function applyInterpreterFunction(f, params) {
	let newEnvironment = new Environment(f.environment);

	for (let i = 0; i < f.parameters.length; ++i) {
		let param = f.parameters[i];
		newEnvironment.define(param.name, params[i]);
	}

	let result = evaluate(f.body, newEnvironment);
	if (result instanceof ReturnValue) {
		return result.value;
	}

	return undefined;
}

exports = module.exports = function entry(source, environment) {
	let result = evaluate(source, Environment.fromObject(global, environment));
	if (result instanceof ControlFlowValue) {
		throw new errors.InterpreterError();
	}

	return result;
};
