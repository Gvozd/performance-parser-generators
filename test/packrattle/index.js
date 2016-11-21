var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var packrattle = require("packrattle");

module.exports.calc = (function() {
    var number = packrattle.regex(/\d+/).map(match => parseInt(match[0], 10));
    var whitespace = packrattle(/[ \t]+/).optional().drop();

    var grouped = packrattle([
        packrattle.drop("("),
        whitespace,
        () => add,
        whitespace,
        packrattle.drop(")")
    ]).map(match => match[0]);

    var multiplyOrDivide = packrattle([ whitespace, packrattle.alt("*", "/"), whitespace ]).map(match => match[0]);
    var multiply = packrattle.reduce(number.or(grouped), multiplyOrDivide, {
        first: n => n,
        next: (total, operator, n) => {
            switch (operator) {
                case "*": return total * n;
                case "/": return total / n;
            }
        }
    });

    var addOrSubtract = packrattle([ whitespace, packrattle.alt("+", "-"), whitespace ]).map(match => match[0]);
    var add = packrattle.reduce(multiply, addOrSubtract, {
        first: n => n,
        next: (total, operator, n) => {
            switch (operator) {
                case "+": return total + n;
                case "-": return total - n;
            }
        }
    });
    return add;
})();

describe('packrattle', function() {
    it('simple', function() {
        expect(module.exports.calc.run('2 + 2 * 2')).to.equal(6);
    });
});
