/**
 * @file mini版的webpack
 */

// node webpack 就可以把入口文件打包成一个bundle.js

const fs = require('fs');; // 读取文件
const path = require('path'); // 路径配置
// @babel/parser (string=> ast) @babel/traverse (遍历ast)
// @babel/core (加预设解析) @babel/preset-env (预设)
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require("@babel/core");


// 分析当前模块
function getModuleInfo(filePath) {
    // getModuleInfo(filePath)
    const file = fs.readFileSync(filePath, 'utf-8');
    const ast = parser.parse(file, {sourceType: "module"});
    // 依赖收集
    const deps = {};
    traverse(ast, {
        // 解析import得到文件路径
        ImportDeclaration({node}) {
            // 根目录的路径
            const dirname = path.dirname(filePath);
            // import 文件的绝对路径
            const abspath = './' + path.join(dirname, node.source.value);
            deps[node.source.value] = abspath;
        }
    });
    // 从AST从处理es6-es5
    const {code} = babel.transformFromAst(ast, null, {
        presets: ["@babel/preset-env"]
    })
    const moduleInfo = {
        filePath,
        deps,
        code
    }

    return moduleInfo || {};
}

// 收集依赖图
function getDeps(moduleArr, deps) {
    (Object.keys(deps)).forEach(path => {
        const module = getModuleInfo(path);
        moduleArr.push(module);
        // 获取子依赖
        getDeps(moduleArr, module.deps);
    })

}
// 解析文件
function parseModule(file) {
    const depsGraph = {};
    const {filePath, deps, code} = getModuleInfo(file);
    const moduleArr = [{filePath, deps, code}];

    // 收集依赖放到数组中，平铺展示
    getDeps(moduleArr, deps)


    // 解析塞入depsGraph
    moduleArr.forEach(moduleInfo => {
        depsGraph[moduleInfo.filePath] = {
            deps: moduleInfo.deps,
            code: moduleInfo.code
        }
    })

    return depsGraph;
}

// 测试
// const res = parseModule('./index.js');
// console.log(res);
// 生成bundle.js 就是将执行文件 和 依赖封装成一个js文件输出
const entry = './index.js';
function bundle(entry) {
    const depMap = JSON.stringify(parseModule(entry));
    // 创建dist下面bundle.js,将下面内容输出
    // 对应非入口require的需要从deps找相对路径名
    return `(function(depMap){
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
        require('${entry}');
    })(${depMap})`;
}

const res = bundle('./index.js') // 返回的字符串，写入新文件
!fs.existsSync('./dist') && fs.mkdirSync('./dist')
fs.writeFileSync('./dist/bundle.js', res);

