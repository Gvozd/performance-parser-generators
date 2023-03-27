// https://habr.com/ru/post/224081/

var expect = require('chai').expect;

module.exports.calc = (() => {
    // Math -> Expression EOF;
    //
    // Expression -> Term (_ ("+" / "-") _ Term)*;
    //
    // Term -> Factor (_ ("*" / "/") _ Factor)*;
    //
    // Factor -> ("(" _ Expression _ ")") / Integer;
    //
    // Integer -> [0-9]+;
    //
    // _ -> [ \t\n\r]*;
    var Integer = rgx(/[0-9]+/);
    var _ = rgx(/[ \t\n\r]*/);
    function Expression() {
        var _Term;
        return new Pattern(function (str, pos) {
            _Term = _Term || Term();
            return seq(
                _Term,
                rep(seq(
                    _, any(txt('+'), txt('-')), _, _Term
                ))
            ).exec(str, pos);
        });
    }
    function Term() {
        var _Factor;
        return new Pattern(function (str, pos) {
            _Factor = _Factor || Factor();
            return seq(
                _Factor,
                rep(seq(
                    _, any(txt('*'), txt('/')), _, _Factor
                ))
            ).exec(str, pos);
        });
    }
    function Factor() {
        var _Expression;
        return new Pattern(function (str, pos) {
            _Expression = _Expression || Expression();
            return any(
                seq(txt('('), _Expression, txt(')')),
                Integer
            ).exec(str, pos);
        });
    }


    return {
        parse:(str) => Expression().exec(str, 0)
    };
})();

describe('habr', function() {
    it('simple', function() {
        // AST only
        console.log(JSON.stringify(module.exports.calc.parse('2 + 2 * 2'), null, '\t'))
        // expect(module.exports.calc.parse('2 + 2 * 2')).to.equal(6);
    });
});

function Pattern(exec) {
    this.exec = exec;
    this.then = function (transform) {
        // var exec = this.exec;
        return new Pattern(function (str, pos) {
            var r = exec(str, pos);
            // console.log('___ 1', r.end);
            return r && { res: transform(r.res), end: r.end };
        });
    }
}
function txt(text) {
    return new Pattern(function (str, pos) {
        if (str.substr(pos, text.length) == text) {
            // console.log('___ 2', pos + text.length);
            return {res: text, end: pos + text.length};
        }
    });
}
function rgx(regexp) {
    return new Pattern(function (str, pos) {
        var m = regexp.exec(str.slice(pos));
        if (m && m.index === 0) {
            // console.log('___ 3', pos, m, m[0], m[0].length, pos + m[0].length);
            return {res: m[0], end: pos + m[0].length};
        }
    });
}
function opt(pattern) {
    return new Pattern(function (str, pos) {
        // console.log('___ 4', pos);
        return pattern.exec(str, pos) || { res: void 0, end: pos };
    });
}
function exc(pattern, except) {
    return new Pattern(function (str, pos) {
        return !except.exec(str, pos) && pattern.exec(str, pos);
    });
}
function any(...patterns) {
    return new Pattern(function (str, pos) {
        for (var r, i = 0; i < patterns.length; i++)
            if (r = patterns[i].exec(str, pos))
                return r;
    });
}
function seq(...patterns) {
    return new Pattern(function (str, pos) {
        var i, r, end = pos, res = [];

        for (i = 0; i < patterns.length; i++) {
            r = patterns[i].exec(str, end);
            if (!r) return;
            res.push(r.res);
            end = r.end;
        }

        // console.log('___ 5', end);
        return { res: res, end: end };
    });
}
function rep(pattern, separator) {
    var separated = !separator ? pattern :
        seq(separator, pattern).then(r => r[1]);

    return new Pattern(function (str, pos) {
        var res = [], end = pos, r = pattern.exec(str, end);

        while (r && r.end > end) {
            res.push(r.res);
            end = r.end;
            r = separated.exec(str, end);
        }

        // console.log('___ 6', end);
        return { res: res, end: end };
    });
}
