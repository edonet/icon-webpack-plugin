/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2019-07-19 17:42:01
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const fs = require('@airb/fs');
const path = require('path');
const MemoryWebpackPlugin = require('memory-webpack-plugin');
const loader = require('./loader');
const merge = require('./merge');


/**
 *****************************************
 * 定义插件
 *****************************************
 */
class IconsWebpackPlugin extends MemoryWebpackPlugin {

    /* 初始化插件 */
    constructor(options) {
        super();

        // 兼容配置
        if (typeof options === 'string') {
            options = { input: options };
        }

        // 设置描述
        this.descriptor = { name: 'icons-webpack-plugin' };

        // 生成字体字体
        this.options = options;
    }

    /* 执行插件 */
    ready(compiler) {

        // 生成入口文件
        this.entry = this.generateEntry(compiler, this.options);

        // 添加入口
        if (this.entry) {
            compiler.options.entry = merge(compiler.options.entry, this.entry);
        }
    }

    /* 生成字体入口 */
    generateEntry({ context }, options) {

        // 生成配置
        options = this.generateOptions(context, options);

        // 生成入口资源
        if (options) {
            let entry = path.resolve(options.output, options.name + '.css');

            // 设置入口
            this.$set(entry, loader(this, options));

            // 返回入口
            return entry;
        }
    }

    /* 生成配置 */
    generateOptions(context, options) {

        // 兼容配置
        if (typeof options === 'string') {
            options = { input: options };
        }

        // 校验配置
        if (!options || typeof options !== 'object') {
            throw new Error(`${ options } is not a object.`);
        }

        // 校验入口文件
        if (typeof options.input !== 'string') {
            throw new Error(`'${ options.input }' is not a string.`);
        }

        // 格式化入口
        options.input = path.relative(process.cwd(), path.resolve(context, options.input));

        // 判断是否为目录
        if (!(fs.isDirectory(options.input))) {
            throw new Error(`'${ options.input }' is not a directory.`);
        }

        // 返回配置
        return {
            ...options,
            name: options.name || path.basename(options.input),
            output: options.output || options.input,
            write: false
        };
    }
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
module.exports = IconsWebpackPlugin;
