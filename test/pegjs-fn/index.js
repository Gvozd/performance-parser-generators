var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var peg = require("pegjs-fn");

module.exports.calc = peg.buildParser(fs.readFileSync(path.join(__dirname, './calc.pegjs'), {encoding: 'utf8'}));

describe('peg.js-fn', function() {
    it('simple', function() {
        expect(module.exports.simple.parse('2 + 2 * 2')).to.equal(6);
    });
});
