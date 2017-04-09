const parse = require('./parser');
const evaluate = require('./interpreter');

exports = module.exports = function main() {
	let tree = parse('52 - 2 * 3');
	console.log(tree);
	console.log(evaluate(tree));
};

if (typeof module !== 'undefined' && require.main === module) {
	exports(process.argv.slice(1));
}
