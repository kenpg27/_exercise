/*
 * @Author: Hjm
 * @LastEditors: Hjm
 * @Date: 2020-10-22 09:26:09
<<<<<<< HEAD
 * @LastEditTime: 2020-10-23 16:47:48
=======
 * @LastEditTime: 2020-10-22 17:00:04
>>>>>>> 55589e6dfe26a539dac888ae8780b6117372ee0e
 */
class Mvvm {
    constructor(options) {
        this.$el = options.el;
        this.$data = options.data;
        // 判断是否有el 有的话则编译
        if (this.$el) {
            // compile
            new Compile(this.$el, this);
        }
    }

}
