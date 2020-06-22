/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-06-18 10:43:56
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 解析引用对象
 *****************************************
 */
module.exports = function resolveSpecifiers(statement) {
    return statement.specifiers.map(specifier => {
        let name = specifier.imported && specifier.imported.name;

        // 更新资源名
        if (name) {
            return {
                ...statement,
                specifiers: [specifier],
                source: {
                    ...statement.source,
                    value: statement.source.value + '?name=' + name
                },
            };
        }

        // 返回对象
        return statement;
    });
};
