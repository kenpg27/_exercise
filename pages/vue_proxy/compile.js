/*
 * @Author: Hjm
 * @LastEditors: Hjm
 * @Date: 2020-10-28 16:39:51
 * @LastEditTime: 2020-10-29 15:21:23
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
        var self = this;
        node.$id = $$id++;
        if (node.childNodes && node.childNodes.length) {
            [].slice.call(node.childNodes).forEach(function (child) {
                if (child.nodeType === 3) {
                    self.compileTextNode(child, scope);
                } else if (child.nodeType === 1) {
                    self.compileElementNode(child, scope);
                }
            });
        }
    }
    compileElementNode(node, scope) {
        // console.log(node);
        // 
    }
    compileTextNode(node, scope) {
        let text = node.textContent.trim();
        if (!text) {
            return;
        }
        let exp = parseTextExp(text);
        this.textHandler(node, scope, exp);
    }
    textHandler(node, scope, exp) {
        this.bindWatcher(node, scope, exp, 'text');
    }
    // 绑定监听者
    bindWatcher(node, scope, exp, dir, prop) {
        //添加一个Watcher，监听exp相关的所有字段变化
        let updateFn = updater[dir];
        let watcher = new Watcher(exp, scope, function (newVal) {
            updateFn && updateFn(node, newVal, prop);
        });
    }
}

let updater = {
    text: (node, newVal) => {
        console.log(newVal);
        node.textContent = typeof newVal === 'undefined' ? '' : newVal;
    }
}
/**
 * @description: 解析文本表达式
 * @return {*}
 * @author: Hjm
 * @param {*} text
 */
function parseTextExp(text) {
    let regText = /\{\{(.+?)\}\}/g;
    var pieces = text.split(regText); //数组 text.value  total
    var matches = text.match(regText); //数组 ["{{text.value}}", "{{total}}"]
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