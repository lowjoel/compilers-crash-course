const parse = require('./parser');
const evaluate = require('./interpreter');

exports = module.exports = function main() {
	// language=JavaScript
	let program = `
		function collatz(n) {
			function next(n) {
				if (n % 2 === 0) {
					return n / 2;
				}

				return 3 * n + 1;
			}

			function count(n, k) {
				if (n === 1) {
					return k;
				}

				return count(next(n), k + 1);
			}

			return count(n, 0);
		}

		collatz;`;
	let result = interpret(program, {log: console.log});
	console.log(result(19));
};

function interpret(program, environment) {
	let tree = parse(program);
	console.log('Parse tree:', tree);
	console.log('\n\n');

	let result = evaluate(tree, environment);
	console.log('Result:', result);
	console.log('\n\n');
	return result;
}

if (typeof module !== 'undefined' && require.main === module) {
	exports(process.argv.slice(1));
}
