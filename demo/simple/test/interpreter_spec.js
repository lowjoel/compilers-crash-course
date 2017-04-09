const expect = require('chai').expect;
const parse = require('../parser').parse;
const interpreter = require('../interpreter');

function interpret(program, environment) {
	return interpreter(parse(program), environment);
}

describe('interpreter', function() {
	describe('environment', function() {
		it('implements variable shadowing', function () {
			// language=JavaScript
			const program = `
				var k = 3;
				function a(x) {
					return x + k;
				}

				function b(x) {
					return a(x + 1);
				}

				b;
`;
			let b = interpret(program);
			expect(b(-3)).to.equal(1);
		});
	});

	describe('control flow', function() {
		describe('if', function() {
			it('supports empty alternates', function() {
				// language=JavaScript
				const program=`
					if (false) {
						boom();
					}
					true;
`;
				expect(interpret(program)).to.be.true;
			});

			it('takes the alternative', function() {
				// language=JavaScript
				const program=`
					if (false) {
						boom();
					} else {
						3;
					}
`;
				expect(interpret(program)).to.equal(3)
			})
		})
	});

	describe('functions', function() {
		it('allows external function call injections', function() {
			// language=JavaScript
			const program=`
				validate(3*4);
`;
			let calls = 0;
			function validator(x) {
				expect(x).to.equal(12);
				calls++;
			}

			interpret(program, {validate: validator});
			expect(calls).to.equal(1);
		});

		it('allows external function call invocations', function() {
			// language=JavaScript
			const program=`
				function square(x) {
					return x * x;
				}
				square;
`;
			let square = interpret(program);
			expect(square(3)).to.equal(9);
		});

		it('returns `undefined` by default', function() {
			// language=JavaScript
			const program=`
				function a() {
				}

				a();
`;
			expect(interpret(program)).to.be.undefined;
		});

		it('returns early', function() {
			// language=JavaScript
			const program=`
				function a() {
					return;
					return 6;
				}

				a();
`;
			expect(interpret(program)).to.be.undefined;
		})
	});

	describe('binary operators', function() {
		it('implements arithmetic', function() {
			// language=JavaScript
			const program=`(15%12 * 5 + 1 - 4) / 4`;
			expect(interpret(program)).to.equal(3);
		});

		describe('logical operators', function() {
			describe('short-circuiting', function() {
				it('short-circuits &&', function() {
					// language=JavaScript
					const program = `
						false && boom();
					`;
					expect(interpret(program)).to.be.false;
				});

				it('short-circuits ||', function() {
					// language=JavaScript
					const program = `
						true || boom();
					`;
					expect(interpret(program)).to.be.true;
				});
			});
		});
	});

	describe('unary operators', function() {
		it('implements logical negation', function() {
			// language=JavaScript
			const program=`!true`;
			expect(interpret(program)).to.be.false;
		})
	})
});
