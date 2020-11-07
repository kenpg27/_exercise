class Dialog {
    constructor(option) {
        // 定义相关信息
        this.title = option.title ? option.title : '提示';
        this.content = option.content ? option.content : '确定要执行吗';
        this.btns = option.btns ? option.btns : ["确定", "取消"];
        this.confirmFn = option.confirm;
        this.cancelFn = option.cancel;
        this.uid = Math.random().toString().substr(3, 5);
    }
    // 按钮编译
    getBtnElement() {
        let btnsDom = '';
        this.btns.forEach((item, index) => {
            let className = index == 0 ? 'confirm' : 'cancel';
            let fn = index == 0 ? 'confirm' : 'cancel';
            btnsDom += `<button class="${className}">${item}</button>`;
        })
        //console.log(btnsDom);
        return btnsDom;
    }
    // 模板编译
    elementCompile() {
        let html = `<div class="dialog-box" id="dialog-${this.uid}">
        <div class="title">${this.title}</div>
        <div class="content">${this.content}</div>
        <div class="btns">
            ${this.getBtnElement()}
        </div>
      </div>`;
        //console.log(html);
        return html;
    }
    bindEvent() {
        let confirmBtn = document.querySelector('.confirm');
        let cancelBtn = document.querySelector('.cancel');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', (e) => {
                this.confirmFn(e);
                // 移除组件
                this.hide();
            });
        }
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.cancelFn();
                this.hide();
            });
        }
    }
    // 显示
    show() {
        let html = this.elementCompile();
        document.body.innerHTML += html;
        this.bindEvent();
    }
    // 隐藏
    hide() {
        console.log('hide');
        let ele = document.querySelector(`#dialog-${this.uid}`);
        ele.remove();
    }
}