var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var Parser = require("jison").Parser;

module.exports.calc = new Parser(fs.readFileSync(path.join(__dirname, './calc.jison'), {encoding: 'utf8'}));

describe('jison', function() {
    it('simple', function() {
        expect(module.exports.simple.parse('2 + 2 * 2')).to.equal(6);
    });
});
