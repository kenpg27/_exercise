/**
 * @description: 实现对模板的编译，提取指令并将vm与视图关联起来
 * @author: Hjm
 */
let $$id;
class Compile {
    constructor(fragment, vm) {
        this.$fragment = fragment;
        this.$vm = vm;
        this._compile(this.$fragment, vm);
        vm.$el.appendChild(this.$fragment);
    }
    _compile(node, scope) {
        let self = this;
        node.$id = $$id++;
        if (node.childNodes && node.childNodes.length) {
            [].slice.call(node.childNodes).forEach(function (child) {
                if (child.nodeType === 3) {
                    self.compileTextNode(child, scope);
                } else if (child.nodeType === 1) {
                    // 如果length大于0则继续递归
                    if (child.childNodes.length > 0) {
                        self._compile(child, scope);
                    } else {
                        self.compileElementNode(child, scope);
                    }

                }
            });
        }
    }
    // 编译节点元素，调用相应的指令处理方法或者调用compile继续编译
    compileElementNode(node, scope) {
        let attrs = [].slice.call(node.attributes); // attributes是动态的，要复制到数组里面去遍历
        let lazyCompileDir = '';
        let lazyCompileExp = '';
        let self = this;
        scope = scope || this.$vm;
        attrs.forEach(function (attr) {
            let attrName = attr.name;
            let exp = attr.value;
            let dir = checkDirective(attrName);
            if (dir.type) {
                if (dir.type === 'for' || dir.type === 'if') {
                    lazyCompileDir = dir.type;
                    lazyCompileExp = exp;
                } else {
                    if (self[dir.type + 'Handler']) {
                        let handler = self[dir.type + 'Handler'].bind(self); // 不要漏掉bind(this)，否则其内部this指向会出错
                        handler(node, scope, exp, dir.prop);
                    } else {
                        console.error('找不到' + dir.type + '指令');
                    }
                }
                node.removeAttribute(attrName);
            }
        });
    }
    // 编译文本元素，解析表达式
    compileTextNode(node, scope) {
        let text = node.textContent.trim();
        if (!text) {
            return;
        }
        let exp = parseTextExp(text);
        this.textHandler(node, scope, exp);
    }
    modelHandler(node, scope, exp, prop) {
        console.log('model');
    }
    onHandler(node, scope, exp, prop) {
        console.log('on');
    }
    // 文本处理
    textHandler(node, scope, exp) {
        this.bindWatcher(node, scope, exp, 'text');
    }
    // 绑定监听者
    bindWatcher(node, scope, exp, dir, prop) {
        //添加一个Watcher，监听exp相关的所有字段变化，如果变化则执行updteFn
        let updateFn = updater[dir];
        let watcher = new Watcher(exp, scope, function (newVal) {
            // console.log(newVal);
            updateFn && updateFn(node, newVal, prop);
        });
    }
}

let updater = {
    text: (node, newVal) => {
        // console.log(newVal);
        node.textContent = typeof newVal === 'undefined' ? '' : newVal;
    }
}


/**
 * @description: 检查属性，返回指令类型
 * @return {*}
 * @author: Hjm
 */
function checkDirective(attrName) {
    var dir = {};
    if (attrName.indexOf('v-') === 0) {
        var parse = attrName.substring(2).split(':');
        dir.type = parse[0];
        dir.prop = parse[1];
    } else if (attrName.indexOf('@') === 0) {
        dir.type = 'on';
        dir.prop = attrName.substring(1);
    } else if (attrName.indexOf(':') === 0) {
        dir.type = 'bind';
        dir.prop = attrName.substring(1);
    }
    return dir;
}
/**
 * @description: 解析文本表达式
 * @return {*}
 * @author: Hjm
 * @param {*} text
 */
function parseTextExp(text) {
    let regText = /\{\{(.+?)\}\}/g;
    let pieces = text.split(regText); //数组 text.value  total
    let matches = text.match(regText); //数组 ["{{text.value}}", "{{total}}"]
    // 文本节点转化为常量和变量的组合表达式，PS：表达式中的空格不管，其他空格要保留
    // 如果没有匹配则返回
    if (matches.length == 0) {
        return text;
    }
    let tokens = [];
    pieces.forEach((item) => {
        if (matches.indexOf("{{" + item + "}}") > -1) {
            tokens.push(item);
        } else if (item) {
            tokens.push('`' + item + '`');
        }
    });
    return tokens.join('+');

}