/*
 * @Author: Suifeng 
 * @Date: 2018-01-15 23:06:12 
 * @Desc: string工具类
 */

export class StringUtil {

    /**
     * 格式化字符串
     * @example 
     * Format("My name is {0}. I'm {1} years old.","John",15) =>My name is John. I'm 15 years old.
     */
    static Format (formatSrt: string, ...args: any[]) {
        if (arguments.length == 0) {
            return null;
        }
        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            str = str.replace(re, arguments[i]);
        }
        return str;
    }
}