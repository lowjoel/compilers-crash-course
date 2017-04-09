const parse = require('./parser');
const evaluate = require('./interpreter');

exports = module.exports = function main() {
	let program = `
		function square(x) {
			return x * x;
		}

		var a = 52 - 2 * 3;
		var b = false || a * 3;
		square(b / b)`;
	interpret(program);
};

function interpret(program) {
	let tree = parse(program);
	console.log(tree);
	console.log(evaluate(tree));
}

if (typeof module !== 'undefined' && require.main === module) {
	exports(process.argv.slice(1));
}
