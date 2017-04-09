const parser = require('../simple/parser');
const transpileArrowFunctions = require('./transpiler');

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

if (typeof module !== 'undefined' && require.main === module) {
	exports(process.argv.slice(1));
}
