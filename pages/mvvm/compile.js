/*
 * @Author: Hjm
 * @LastEditors: Hjm
 * @Date: 2020-10-22 11:52:26
 * @LastEditTime: 2020-10-23 17:31:35
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
    // 判断是否为dom元素
    isElement(el) {
        if (el.nodeType == 1) return true;
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
}