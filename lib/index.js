/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-06-16 20:28:18
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const fs = require('@ainc/fs');
const { Iconfont } = require('@ainc/iconfont');
const MemoryWebpackPlugin = require('memory-webpack-plugin');
const generateCode = require('./helper/generateCode');
const resolveQuery = require('./helper/resolveQuery');
const resolveInput = require('./helper/resolveInput');
const resolveSpecifiers = require('./helper/resolveSpecifiers');


/**
 *****************************************
 * 默认配置
 *****************************************
 */
const defaultOptions = {
    name: 'iconfont',
    input: ['icons', 'icon'],
    format: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
};


/**
 *****************************************
 * 图标插件
 *****************************************
 */
class IconsWebpackPlugin extends MemoryWebpackPlugin {

    /* 初始化组件 */
    constructor(options) {
        super();

        // 定义描述
        this.descriptor = { name: 'icons-webpack-plugin' };

        // 配置
        if (typeof options === 'string' || Array.isArray(options)) {
            this.options = { ...defaultOptions, input: [].concat(options) };
        } else {
            this.options = { ...defaultOptions, ...options };
        }
    }

    /* 准备就绪 */
    ready(compiler) {
        let { name, input, format } = this.options,
            id = fs.cwd('node_modules', name),
            css = fs.cwd(id, './index.css'),
            dep = fs.cwd(id, './dep.js'),
            fonts = new Map(),
            icons = Object.create(null),
            iconfont = new Iconfont({ name, format });

        // 设置主入口
        this.set(id + '.js', async loader => {
            let query = resolveQuery(loader.resourceQuery);

            // 处理图标
            if (query.name) {
                let key = query.name.toLowerCase();

                // 加载依赖
                await new Promise((resolve, reject) => {
                    loader.loadModule(dep, err => err ? reject(err) : resolve());
                });

                // 添加依赖
                loader.addDependency(dep);

                // 存在资源
                if (icons[key]) {
                    let file = icons[key];

                    // 添加依赖
                    loader.addDependency(file);

                    // 添加图标
                    iconfont.add(key, file);

                    // 返回代码
                    return generateCode({
                        type: query.type,
                        ident: query.name,
                        name,
                        css,
                        icon: iconfont.icons.get(key),
                    });
                }
            }

            // 默认为空
            return '';
        });

        // 设置图标依赖
        this.set(dep, loader => {

            // 缓存资源
            icons = resolveInput(input, loader);

            // 返回代码
            return '';
        });

        // 设置样式文件
        this.set(css, iconfont.generateCSS({ classList: [`.${name}`] }));

        // 添加字体资源
        format.forEach(ext => {
            let path = fs.cwd(id, `./fonts/${name}.${ext}`);

            // 添加资源映射
            fonts.set(path, { path, ext, source: '' });

            // 设置字体模块
            this.set(path, () => fonts.get(path).source);
        });

        // 完成编译监听
        compiler.hooks.thisCompilation.tap(this.descriptor, compilation => {
            compilation.hooks.finishModules.tapPromise(this.descriptor, async (modules) => {
                if (iconfont.icons.size) {
                    let assets = await iconfont.compile(),
                        deferred = [];

                    // 生成映射
                    fonts.forEach(
                        file => file.source = assets.get(file.ext) || ''
                    );

                    // 替换代码
                    modules.forEach(x => {
                        if (fonts.has(x.resource)) {
                            deferred.push(
                                new Promise(resolve => compilation.rebuildModule(x, resolve))
                            );
                        }
                    });

                    // 等待完成
                    await Promise.all(deferred);
                }
            });
        });

        // 解析图标加载
        compiler.hooks.normalModuleFactory.tap(this.descriptor, nmr => {
            let withQuery = name + '?';

            // 更新请求地址
            nmr.hooks.beforeResolve.tap(this.descriptor, resolver => {
                if (resolver.request.startsWith(withQuery)) {
                    if (resolver.contextInfo.issuer && resolver.contextInfo.issuer.endsWith('.vue')) {
                        resolver.request += '&type=vue';
                    }
                } else if (resolver.request === name) {
                    if (resolver.contextInfo.issuer && resolver.contextInfo.issuer.endsWith('.vue')) {
                        resolver.request += '?type=vue';
                    }
                }
            });

            // 解析载入模块
            nmr.hooks.parser.for('javascript/auto').tap(this.descriptor, parser => {
                parser.hooks.program.tap(this.descriptor, ast => {
                    let idx = ast.body.length;

                    // 遍历节点
                    while (idx --) {
                        let statement = ast.body[idx];

                        // 匹配节点
                        if (statement.type === 'ImportDeclaration' && statement.source.value === name) {
                            ast.body.splice(idx, 1, ...resolveSpecifiers(statement));
                        }
                    }
                });
            });
        });
    }
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = IconsWebpackPlugin;
