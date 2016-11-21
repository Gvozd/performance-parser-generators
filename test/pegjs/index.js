var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var peg = require("pegjs");

module.exports.simple = peg.generate(fs.readFileSync(path.join(__dirname, './calc.pegjs'), {encoding: 'utf8'}));

describe('peg.js', function() {
    it('simple', function() {
        expect(module.exports.simple.parse('2 + 2 * 2')).to.equal(6);
    });
});
