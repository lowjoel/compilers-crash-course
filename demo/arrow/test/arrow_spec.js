const expect = require('chai').expect;
const parser = require('../../simple/parser');
const interpret = require('../../simple/interpreter');
const transpileArrowFunctions = require('../transpiler');

function transform(program) {
	let tree = parser.parse(program);
	return parser.transform(tree, transpileArrowFunctions);
}

describe('arrow', function() {
	it('handles compact form', function() {
		// language=JavaScript
		const program = `
			var a = (x) => x;
			a(3);
`;

		let result = transform(program);
		expect(interpret(result)).to.equal(3);
	});

	it('handles block form', function() {
		// language=JavaScript
		const program = `
			var a = (x) => { return x; };
			a(3);
`;

		let result = transform(program);
		expect(interpret(result)).to.equal(3);
	})
});
