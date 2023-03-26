var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var SPEG = require("simplepeg").SPEG;

module.exports.calc = (() => {
    let code = fs.readFileSync(path.join(__dirname, './calc.peg'), {encoding: 'utf8'});
    let parser = new SPEG();
    parser.parse_grammar(code);
    return {
        parse:(str) => parser.parse_text(str)
    };
})();

describe('simplepeg', function() {
    it('simple', function() {
        // only AST generated
        // expect(module.exports.calc.parse('2 + 2 * 2')).to.equal(6);
    });
});
