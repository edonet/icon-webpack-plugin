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
 * 加载内容
 *****************************************
 */
module.exports = (plugin, options) => {
    return async function () {
        try {
            let bundle = await compile(options);

            // 设置缓存
            Object.keys(bundle).forEach(key => {
                if (key !== 'css' && key !== 'glyphs') {
                    plugin.$set(path.resolve(bundle[key].path), bundle[key].source);
                }
            });

            // 返回源码
            return bundle.css.source;
        } catch (err) {
            console.log(err);
            // do nothing;
        }

        // 添加依赖
        this.addContextDependency(options.input);

        // 返回空
        return '';
    };
};
