const parse = require('./parser');
const evaluate = require('./interpreter');

exports = module.exports = function main() {
	let program = `
		var a = 52 - 2 * 3;
		false || a * 3`;
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
