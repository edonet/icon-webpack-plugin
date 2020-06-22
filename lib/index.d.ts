/**
 *****************************************
 * 选项
 *****************************************
 */
type Options = string | Partial<{
    name: string;
    input: string | string[];
    format: string[];
}>;


/**
 *****************************************
 * 图标插件
 *****************************************
 */
declare class IconsWebpackPlugin {
    constructor(options: Options);
}


/**
 *****************************************
 * 抛出接口
 *****************************************
 */
export = IconsWebpackPlugin;
