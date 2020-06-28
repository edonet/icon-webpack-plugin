/**
 *****************************************
 * Created by edonet@163.com
 * Created on 2020-06-22 22:08:09
 *****************************************
 */
'use strict';


/**
 *****************************************
 * 生成【react】图标
 *****************************************
 */
function generateReactCode({ ident, name, css, unicode }) {
    return `
import React from 'react';
import { cx } from ${JSON.stringify(css)};

export function ${ident}({ className, size, color, style }) {
    return (
        <i className={cx(${JSON.stringify(name)}, className)} style={{ ...style, color, fontSize: size }}>
            ${unicode}
        </i>
    );
}
`;
}


/**
 *****************************************
 * 生成【Vue】图标
 *****************************************
 */
function generateVueCode({ ident, name, css, unicode }) {
    return `
import { cx } from ${JSON.stringify(css)};

export const ${ident} = {
    name: 'Icon',
    functional: true,
    props: {
        size: Number,
        color: String,
    },
    render(createElement, { data, props }) {
        data.staticClass = cx(${JSON.stringify(name)}, data.staticClass);
        data.style = {
            ...data.style,
            color: props.color,
            fontSize: props.size + 'px',
        };

        data.domProps = {
            ...data.domProps,
            innerHTML: '${unicode}',
        };

        return createElement('i', data)
    },
}`;
}


/**
 *****************************************
 * 生成图标
 *****************************************
 */
module.exports = function generateCode({ name, query, css, icon }) {
    let unicode = '&#x' + icon.unicode.toString(16) + ';';

    // 生成代码
    if (query.type === 'vue') {
        return generateVueCode({ name, css, unicode, ident: query.name });
    } else {
        return generateReactCode({ name, css, unicode, ident: query.name });
    }
};
