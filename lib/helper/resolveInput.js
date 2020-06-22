/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-06-18 23:25:06
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 加载依赖
 *****************************************
 */
const fs = require('@ainc/fs');


/**
 *****************************************
 * 解析输入文件
 *****************************************
 */
module.exports = function resolveInput(input, loader) {
    let map = Object.create(null);

    // 添加依赖
    function add(file) {
        map[fs.filename(file).replace(/-/g, '').toLowerCase()] = file;
    }

    // 遍历入口
    input.forEach(dir => {
        if (dir && typeof dir === 'string') {
            let stats = fs.stat(dir);

            // 存在文件
            if (stats) {
                let { path } = stats;

                // 处理文件
                if (stats.isDirectory()) {
                    loader.addContextDependency(path);

                    // 添加【SVG】文件
                    fs.readdir(path).forEach(
                        ({ path }) => path.endsWith('.svg') && add(path)
                    );
                } else{
                    loader.addDependency(path);

                    // 添加指定文件
                    add(path);
                }
            }
        }
    });

    // 返回结果
    return map;
};
