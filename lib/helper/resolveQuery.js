/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-06-18 11:33:43
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 解析查询参数
 *****************************************
 */
module.exports = function resolveQuery(query) {
    let result = {};

    // 解析参数
    if (query) {
        if (query.charAt(0) === '?') {
            query = query.slice(1);
        }

        // 分割参数
        query.split('&').forEach(str => {
            let [key, value = true] = str.split('=');

            if (key) {
                result[key] = value;
            }
        });
    }

    // 返回结果
    return result;
};
