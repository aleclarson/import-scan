Object.defineProperty(exports, "__esModule", { value: true });
function getImports(code) {
    var imports = [];
    var lexer = /(\/\/.*$)|(\/\*)|(?:^[ \t]*import(?: [^\n]+? from)?[ ]+["'`]([^"'`]+)["'`])|(?:(?<=[^\w.$])(?:require|import)\(\s*["'`]([^"'`]+)["'`]\s*\))/gm;
    while (true) {
        var match = lexer.exec(code);
        if (!match)
            return imports;
        // Line comment
        if (match[1])
            continue;
        // Block comment
        if (match[2]) {
            var start = match.index + 2;
            while (true) {
                var end = code.indexOf('*/', start);
                if (end < 0)
                    return imports;
                if (isEscaped(code, end)) {
                    start = end + 1;
                    continue;
                }
                lexer.lastIndex = end + 2;
                break;
            }
        }
        // Imported path
        else {
            var path = match[3] || match[4];
            if (imports.indexOf(path) < 0)
                imports.push(path);
        }
    }
}
exports.getImports = getImports;
// Returns true when the given string ends with an unescaped escape.
function isEscaped(str, fromIndex) {
    var ESCAPE = '\\'.charCodeAt(0), i = fromIndex, n = 0;
    while (i && str.charCodeAt(--i) === ESCAPE)
        n++;
    return n % 2 == 1;
}