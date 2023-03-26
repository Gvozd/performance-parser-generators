var fs = require('fs');
var path = require('path');
var expect = require('chai').expect;
var Suite = new require('benchmark').Suite;
require('./jison/index');
require('./pegjs/index');
require('./pegjs-fn/index');
require('./kison/index');
require('./packrattle/index');
require('./simplepeg/index');

describe('benchmark', function() {
    // TODO https://www.npmjs.com/package/parsly
    // TODO подсмотреть грамматику JS в https://habrahabr.ru/post/191858/
    // TODO http://neerc.ifmo.ru/wiki/index.php?title=%D0%A3%D1%81%D1%82%D1%80%D0%B0%D0%BD%D0%B5%D0%BD%D0%B8%D0%B5_%D0%BB%D0%B5%D0%B2%D0%BE%D0%B9_%D1%80%D0%B5%D0%BA%D1%83%D1%80%D1%81%D0%B8%D0%B8
    // https://habrahabr.ru/post/224081/
    var jisonParser = require('./jison/index').calc;
    var pegjsParser = require('./pegjs/index').calc;
    var pegjsFnParser = require('./pegjs-fn/index').calc;
    var kisonParser = require('./kison/index').calc;
    var packrattleParser = require('./packrattle/index').calc;
    var simplepegParser = require('./simplepeg/index').calc;
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
            .add('simplepegParser', function() {
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
            .add('simplepegParser', function() {
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
