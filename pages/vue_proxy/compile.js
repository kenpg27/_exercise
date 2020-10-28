/*
 * @Author: Hjm
 * @LastEditors: Hjm
 * @Date: 2020-10-28 16:39:51
 * @LastEditTime: 2020-10-28 17:28:56
 */
class Compile {
    constructor(fragment, vm) {
        this.$fragment = fragment;
        this.$vm = vm;
        this._compile(this.$fragment);
        vm.$el.appendChild(this.$fragment);
    }
    _compile(fragment) {
        console.log(fragment222);
    }
}