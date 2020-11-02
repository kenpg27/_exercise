/**
 * @description: 依赖链
 * @author: Hjm
 */
class Dep {
    constructor() {
        this.subs = [];
    }

    addSub(target) {
        if (!this.subs[target.uid]) {
            this.subs[target.uid] = target;
            console.log(this.subs);
        }
    }

    notify(options) {
        console.log(this.subs);
        for (var uid in this.subs) {
            this.subs[uid].update(options);
        }
    }
}