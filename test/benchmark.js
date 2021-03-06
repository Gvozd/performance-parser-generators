var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var Suite = new require('benchmark').Suite;
require('./jison/index');
require('./pegjs/index');
require('./pegjs-fn/index');
require('./kison/index');
require('./packrattle/index');

describe('benchmark', function() {
    var jisonParser = require('./jison/index').calc;
    var pegjsParser = require('./pegjs/index').calc;
    var pegjsFnParser = require('./pegjs-fn/index').calc;
    var kisonParser = require('./kison/index').calc;
    var packrattleParser = require('./packrattle/index').calc;
    expect(jisonParser.parse('2 + 2 * 2')).to.equal(6);
    expect(pegjsParser.parse('2 + 2 * 2')).to.equal(6);
    expect(pegjsFnParser.parse('2 + 2 * 2')).to.equal(6);
    expect(kisonParser.parse('2 + 2 * 2')).to.equal(6);
    expect(packrattleParser.run('2 + 2 * 2')).to.equal(6);
    this.timeout(100 * 1000);
    it('simple', function(done) {
        new Suite()
            .add('jisonParser', function() {
                jisonParser.parse('2 + 2 * 2');
            })
            .add('pegjsParser', function() {
                pegjsParser.parse('2 + 2 * 2');
            })
            .add('pegjsFnParser', function() {
                pegjsFnParser.parse('2 + 2 * 2');
            })
            .add('kisonParser', function() {
                kisonParser.parse('2 + 2 * 2');
            })
            .add('packrattleParser', function() {
                packrattleParser.run('2 + 2 * 2');
            })
            .on('cycle', function(event) {
                console.log(String(event.target));
            })
            .on('complete', function() {
                console.log('Fastest is ' + this.filter('fastest').map('name'));
                done();
            })
            .run({ 'async': true });
    });
    it('recursive', function(done) {
        new Suite()
            .add('jisonParser', function() {
                jisonParser.parse('2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 4))))))))))))');
            })
            .add('pegjsParser', function() {
                pegjsParser.parse('2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 4))))))))))))');
            })
            .add('pegjsFnParser', function() {
                pegjsFnParser.parse('2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 4))))))))))))');
            })
            .add('kisonParser', function() {
                kisonParser.parse('2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 4))))))))))))');
            })
            .add('packrattleParser', function() {
                packrattleParser.run('2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 2 * (3 + 4))))))))))))');
            })
            .on('cycle', function(event) {
                console.log(String(event.target));
            })
            .on('complete', function() {
                console.log('Fastest is ' + this.filter('fastest').map('name'));
                done();
            })
            .run({
                'async': true
            });
    });
});
