/*
 * @Author: Hjm
 * @LastEditors: Hjm
 * @Date: 2020-10-27 11:22:51
 * @LastEditTime: 2020-10-27 17:23:22
 */
class Observer {
    constructor(data) {
        this.observer(data);
    }
    observer(data) {
        // 要对这个data数据将原有的属性改成set和get的形式
        if (!data || typeof data !== 'object') {
            return;
        }
        // 要将数据 一一劫持 先获取取到data的key和value
        Object.keys(data).forEach(key => {
            // 劫持
            this.defineReactive(data, key, data[key]);
            this.observer(data[key]); // 深度递归劫持
        });

    }

    defineReactive(obj, key, value) {
        let that = this;
        let handler = {
            enumerable: true,
            configurable: true,
            get: () => {
                //console.log(key, value);
                return value;
            },
            set: (newValue) => {
                if (newValue != value) {
                    // 这里的this不是实例 
                    that.observe(newValue); // 如果是对象继续劫持
                    value = newValue;
                }
            }
        }
        Object.defineProperty(obj, key, handler);
    }
}