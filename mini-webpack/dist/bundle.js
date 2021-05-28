(function(depMap){
        function require(entry) {
            // 封装require
            function asbRequire(relPath) {
                return require(depMap[entry].deps[relPath])
            }
            const exports = {};
            (function(require, exports, code){
                eval(code)
            })(asbRequire, exports, depMap[entry]['code'])
            return exports.default;
        }
        require('./index.js');
    })({"./index.js":{"deps":{"./add.js":"./add.js"},"code":"\"use strict\";\n\nvar _add = _interopRequireDefault(require(\"./add.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { \"default\": obj }; }\n\nconsole.log((0, _add[\"default\"])(3, 4));"},"./add.js":{"deps":{},"code":"\"use strict\";\n\n/**\n * @file add 方法函数\n */\nexports[\"default\"] = function add(a, b) {\n  return a + b;\n};"}})