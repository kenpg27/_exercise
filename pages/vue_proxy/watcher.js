/**
 * @description: 订阅Observer的变更消息，获取最新值计算表达式，通过回调函数（updater函数）将计算结果更新到视图上
 * @author: Hjm
 */
var $uid = 0;
class Watcher {
    constructor(exp, scope, fn) {
        this.exp = exp;
        this.scope = scope;
        this.fn = fn || function () { };
        this.value = null;
        this.uid = $uid++;
        this.update();
    }
    get() {
        Dep.target = this;
        var value = computeExpression(this.exp, this.scope);  //执行的时候添加监听
        // 在parseExpression的时候，with + eval会将表达式中的变量绑定到vm模型中，在求值的时候会调用相应变量的getter事件。
        // 由于设置了Dep.target，所以会执行observer的add.sub方法，从而创建了一个依赖链。
        Dep.target = null;
        return value;
    }
    update(options) {
        let newValue = this.get();
        console.log(newValue);
        console.log(this.value);
        // 这里有可能是对象/数组，所以不能直接比较，可以借助JSON来转换成字符串对比
        if (!isEqual(this.value, newValue)) {
            this.fn && this.fn(newValue, this.value, options);
            this.value = deepCopy(newValue);
        }
    }
}
/**
 * @description: 解析表达式，with+eval会将表达式中的变量绑定到vm模型中，从而实现对表达式的计算
 * @param {*} exp
 * @param {*} scope
 * @return {*}
 * @author: Hjm
 */
function computeExpression(exp, scope) {
    try {
        with (scope) {
            return eval(exp);
        }
    } catch (error) {
        console.error('ERROR', error);
    }
};

/**
 * 是否相等，包括基础类型和对象/数组的对比
 */
function isEqual(a, b) {
    return a == b || (
        isObject(a) && isObject(b)
            ? JSON.stringify(a) === JSON.stringify(b)
            : false
    )
}

/**
 * 是否为对象(包括数组、正则等)
 */
function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}

/**
 * 复制对象，若为对象则深度复制
 */
function deepCopy(from) {
    var r;
    if (isObject(from)) {
        r = JSON.parse(JSON.stringify(from));
    } else {
        r = from;
    }
    return r;
}