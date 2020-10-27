/*
 * @Author: Hjm
 * @LastEditors: Hjm
 * @Date: 2020-10-22 11:52:26
 * @LastEditTime: 2020-10-27 15:51:09
 */
class Compile {
    constructor(el, vm) {
        this.$el = this.isElement(el) ? el : document.querySelector(el);
        this.$vm = vm;
        if (this.$el) {
            // 如果这个元素能获取到 我们才开始编译
            // 1.先把这些真实的DOM移入到内存中 fragment
            let fragment = this.node2fragment(this.$el);
            // 2.编译 => 提取想要的元素节点 v-model 和文本节点 {{}}
            this.compileAction(fragment);
            // 3.把编译号的fragment在塞回到页面里去
            this.$el.appendChild(fragment);
        }

    }
    compileAction(fragment) {
        //console.log(fragment.childNodes);
        Array.from(fragment.childNodes).forEach((node) => {
            // 判断是否为node
            if (this.isElement(node)) {
                // 是元素节点，还需要继续深入的检查
                // 这里需要编译元素
                this.compileElement(node);
                this.compileAction(node);
            } else {
                // 文本节点
                // 这里需要编译文本
                this.compileText(node);
            }
        })
    }
    // 编译dom
    compileElement(node) {
        // 判断属性是否包含指定的指令
        //console.log(node.attributes);
        let attrs = node.attributes;
        Array.from(attrs).forEach((attr) => {
            //console.log(attr.name);
            let attrname = attr.name;
            if (this.isDiretive(attrname)) {
                // v-model v-click @click 等等
                // console.log(attrname);
                // 截取指令
                attrname = attrname.slice(2);
                // console.log(attrname);
                this.compileUtils[attrname](node, this.$vm, attr.value);
            }
        });
    }
    // 编译文本
    compileText(node) {
        let expr = node.textContent; // 取文本中的内容
        // 获取{{}}的内容
        let reg = /\{\{([^}]+)\}\}/g;
        if (reg.test(expr)) {
            // 这里要求将data的数据替换指令
            // console.log(expr);
            this.compileUtils['text'](node, this.$vm, expr);
        }
    }
    // 编译方法（按类型区分）
    compileUtils = {
        getVal(vm, expr) {
            // 通过 “.” 分割字符串
            let keyArr = expr.split(".");
            return keyArr.reduce((pre, next) => {
                return pre[next];
            }, vm.$data);
            // console.log(key);
        },
        getTextVal(vm, expr) {
            return expr.replace(/\{\{([^}]+)\}\}/g, (...args) => {
                //console.log(args);
                return this.getVal(vm, args[1]);
            });
        },
        text(node, vm, expr) {
            // 这里要求将data的数据替换指令
            // 这里的expr是包含{{}} ，先要过滤{{}}
            let value = this.getTextVal(vm, expr);
            this.updater.textUpdater(node, value);
            // console.log(value);
        },
        model(node, vm, expr) {
            // console.log(expr);
            let value = this.getVal(vm, expr);
            this.updater.modelUpdater(node, value);
        },
        updater: {
            // 文本更新
            textUpdater(node, value) {
                node.textContent = value
            },
            // 输入框更新
            modelUpdater(node, value) {
                node.value = value;
            }
        }
    }
    // 判断是否为dom元素
    isElement(el) {
        if (el.nodeType == 1) return true;
    }
    // 判断是否为自定义指令
    isDiretive(attrname) {
        let index = attrname.indexOf('v-');
        return index === 0;
    }
    // 添加到fragment
    node2fragment(el) {
        // 文档碎片 内存中的dom节点
        let fragment = document.createDocumentFragment();
        let firstChild;
        while (firstChild = el.firstChild) {
            fragment.appendChild(firstChild);
        }
        return fragment; // 内存中的节点
    }


}