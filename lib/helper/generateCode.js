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
function generateReactIcon({ ident, name, css, unicode }) {
    return `
import React from 'react';
import { cx } from ${JSON.stringify(css)};

export function ${ident}({ className, size, color, style, children }) {
    return (
        <i className={cx(${JSON.stringify(name)}, className)} style={{ ...style, color, fontSize: size }}>
            ${unicode}
            {children}
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
function generateVueIcon({ ident, name, css, unicode }) {
    return `
import { cx } from ${JSON.stringify(css)};

export const ${ident} = {
    name: 'Icon',
    functional: true,
    props: {
        size: Number,
        color: String,
    },
    render(createElement, { data, props, children }) {
        data.staticClass = cx(${JSON.stringify(name)}, data.staticClass);
        data.style = {
            ...data.style,
            color: props.color,
            fontSize: props.size + 'px',
        };

        return createElement('i', data, [${JSON.stringify(unicode)}, ...children])
    },
}`;
}


/**
 *****************************************
 * 生成图标
 *****************************************
 */
module.exports = function generateCode({ name, ident, type, css, icon }) {
    let unicode = '&#x' + icon.unicode.toString(16) + ';';

    // 生成代码
    if (type === 'vue') {
        return generateVueIcon({ name, ident, css, unicode });
    } else {
        return generateReactIcon({ name, ident, css, unicode });
    }
};
