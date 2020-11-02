/**
 * @description: 数据劫持
 * @author: Hjm
 */
class Observer {
    constructor(data, vm) {
        this.$data = data;
        this.$vm = vm;
        if (this.$data) {
            this._observer(this.$data, vm);
        }
    }

    // 数据劫持方法
    _observer(data, vm) {
        // 先判断data是否为对象
        if (!data || typeof data !== 'object') {
            return;
        }
        vm.$data = this.proxyHandle(data);
        // Object.defineProperty()使用如下
        // Object.keys(data).forEach(function (key) {
        // 	self.observeObject(data, key, data[key]);
        // });
    }
    /**
     * @description: Proxy的代理针对的是整个对象，而不是像Object.defineProperty针对某个属性。只需做一层代理就可以监听同级结构下的所有属性变化，包括新增属性和删除属性
     * @param {*} data
     * @param {*} key
     * @param {*} data
     * @return {*} proxy
     * @author: Hjm
     */
    proxyHandle(data) {
        let dep = new Dep();
        let handler = {
            get(target, key) {
                //console.log(key);
                if (target[key] === 'object' && target[key] !== null) {
                    // 嵌套子对象也需要进行数据代理
                    return new Proxy(target[key], hanlder)
                }
                // 由于需要在闭包内添加watcher，所以通过Dep定义一个全局target属性，暂存watcher, 添加完移除
                Dep.target && dep.addSub(Dep.target);
                //console.log(Reflect.get(target, key));
                return Reflect.get(target, key)
            },
            set(target, key, value) {
                // console.log(key);
                // console.log(value);
                if (key === 'length') return true
                dep.notify(); // 通知订阅者更新
                return Reflect.set(target, key, value);
            }
        }
        let proxy = new Proxy(data, handler);
        return proxy;
    }
}