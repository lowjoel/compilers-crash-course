const calculator = require('./calculator');

exports = module.exports = function main() {
  console.log(calculator.parse('52^2*3'));
};

if (typeof module !== 'undefined' && require.main === module) {
  exports(process.argv.slice(1));
}