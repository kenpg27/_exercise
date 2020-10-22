/*
 * @Author: Hjm
 * @LastEditors: Hjm
 * @Date: 2020-10-22 09:26:09
 * @LastEditTime: 2020-10-22 11:53:06
 * @FilePath: \_exercise\pages\mvvm\mvvm.js
 */
class Mvvm {
    constructor(options) {
        this.$el = options.el;
        this.$data = option.data;
        // 判断是否有el 有的话则编译
        if (this.$el) {
            // compile
            new Compile(this.$el, this);
        }
    }

}