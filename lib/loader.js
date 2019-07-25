/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2019-07-19 20:29:49
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const path = require('path');
const { compile } = require('@airb/iconfont');


/**
 *****************************************
 * 定义输出字体格式
 *****************************************
 */
const format = ['svg', 'ttf', 'eot', 'woff', 'woff2'];


/**
 *****************************************
 * 加载内容
 *****************************************
 */
module.exports = (plugin, options) => {
    return async function () {
        let source = '',
            bundle = await compile(options);

        // 存在输出
        if (bundle.css) {

            // 遍历格式
            format.forEach(key => {
                if (key in bundle) {
                    plugin.$set(path.resolve(bundle[key].path), bundle[key].source);
                }
            });

            // 返回源码
            source = bundle.css.source;
        }

        // 添加依赖
        this.addContextDependency(options.input);

        // 返回空
        return source;
    };
};
