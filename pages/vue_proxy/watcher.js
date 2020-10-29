/*
 * @Author: Hjm
 * @LastEditors: Hjm
 * @Date: 2020-10-29 15:03:34
 * @LastEditTime: 2020-10-29 15:52:45
 */

var $uid = 0;
class Watcher {
    constructor(exp, scope, fn) {
        this.exp = exp;
        this.scope = scope;
        this.fn = fn || function () {};
        this.value = null;
        this.uid = $uid++;
        this.update();
    }
    get() {
        console.log(this.exp);
        console.log(this.scope);
    }
    update() {

    }
}