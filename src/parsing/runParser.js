// TODO: Remove this file before merging into master
const parser = require('./xPathParser.raw.js');

const input = `xquery version "1.0" encoding "utf-8";
module namespace test="prrt";
import module namespace test = "http://www.example.org/mainmodules.tests#1";`;

function print (what, indent, n) {
    const filler = Array(indent).fill(' ').join('');
    switch (typeof what) {
        case 'object': {
            if (Array.isArray(what))
                return what.map((w, i) => print(w, indent + 2, i)).join('\n');
            return Object.keys(what).map(k => filler + k + ': "' + what[k] + '"').join('\n');
        }
        default:
            if (n === 0) return filler + what
            return filler + '  "' + what + '"';
    }
}


console.log(print(parser.xPathParser.parse(input), 0, 0));
