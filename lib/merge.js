/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2019-07-19 20:38:06
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 合并入口
 *****************************************
 */
module.exports = function merge(entries, entry, embedded) {
    let type = typeof entries;

    // 处理字符串
    if (type === 'string') {
        return embedded ? [entries, entry] : { main: [entries, entry] };
    }

    // 处理对象
    if (type === 'object') {

        // 合并对象
        if (!Array.isArray(entries)) {
            let result = {};

            // 遍历属性
            Object.keys(entries).forEach(key => {
                result[key] = merge(entries[key], entry, true);
            });

            // 返回结果
            return result;
        }

        // 合并数组
        return (entries.push(entry), entries);
    }

    // 不合并
    return entries;
};
