/**
 * @file 入口文件
 */


// const add = require('./add');
// 一：实现文件导出export可运行
// require引入的是代码字符串，实现导出并且可执行 想让他执行 eval，new function，setTimeout
// 代码字符串是add里面的，意思是挂载到exports下面
// 模块化为了代码字符串中的代码不污染全局
// let exports = {};
// (function(){
//     eval(`exports.default = function add (a, b) {
//         return a + b;
//     }`);
// })(exports)
// console.log(exports.default(1, 2));
// console.log('exports', exports);

// 再进化通用
// let exports2 = {};
// (function(exports, code){
//     eval(code);
// })(exports2, code)



// 二：实现require
// 假设代码字符串已经全部获取
// require('./add'); // require(file)
(function(codeMap){
    // require的实现，把export的代码返回
    function require(file) {
        // export代码的实现
        let exports = {};
        (function(exports, code){
            eval(code);
        })(exports, codeMap[file])
        console.log('exports.default', exports.default);
        return exports.default
    }
    require('index.js');
})({
    './add.js': `exports.default = function add (a, b) {
        return a + b;
    }`,
    'index.js': `const add = require('./add.js'); console.log(add(1, 3));`
})


// 三：接下来只需要实现依赖加载(包括源码字符串的加载)和es6转es5
// 见webpack.js