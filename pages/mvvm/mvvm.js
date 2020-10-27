/*
 * @Author: Hjm
 * @LastEditors: Hjm
 * @Date: 2020-10-22 09:26:09
 * @LastEditTime: 2020-10-27 16:40:51
 */
class Mvvm {
    constructor(options) {
        this.$el = options.el;
        this.$data = options.data;
        // 判断是否有el 有的话则编译
        if (this.$el) {
            // compile
            new Observer(this.$data);
            new Compile(this.$el, this);

        }
    }

}