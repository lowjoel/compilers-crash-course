const parse = require('./parser');

exports = module.exports = function main() {
	console.log(parse('52^2*3'));
};

if (typeof module !== 'undefined' && require.main === module) {
	exports(process.argv.slice(1));
}
