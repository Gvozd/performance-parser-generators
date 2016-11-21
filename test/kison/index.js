var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var Grammar = require("kison").Grammar;

module.exports.calc = eval(new Grammar(
    eval(fs.readFileSync(path.join(__dirname, './calc.kison'), {encoding: 'utf8'}))
).genCode({}) + ';parser');
describe('kison', function() {
    it('simple', function() {
        expect(module.exports.calc.parse('2 + 2 * 2')).to.equal(6);
    });
});
