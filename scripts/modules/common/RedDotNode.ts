const { ccclass, property } = cc._decorator;
@ccclass
export default class RedDotNode extends cc.EventTarget {
    calculateFunc: Function = null;
    calculateParam: any = null;
    children: Map<any, any> = new Map();
    parent: RedDotNode = null;
    redId: number = 0;
    redPoint: number = 0;
    addChild(e) {
        if (e && !this.children.has(e.redId)) {
            e.setParent(this);
            this.children.set(e.redId, e);
        }
    }
    calculate(e) {
        if (this.calculateFunc) {
            this.redPoint = this.calculateFunc(e);
        }
        else {
            let t = 0;
            this.children.forEach((e) => {
                t += e.getResult();
            });
            this.redPoint = t;
        }
        return this.redPoint;
    }
    clearChildren() {
        this.children.forEach((e) => {
            e.clearResult();
            e.clearChildren();
        });
    }
    clearParent() {
        if (this.parent) {
            this.parent.clearResult();
            this.parent.clearParent();
        }
    }
    clearResult() {
        this.redPoint = null;
    }
    getResult() {
        if (!this.redPoint) {
            if (this.calculateFunc) {
                this.redPoint = this.calculateFunc();
            }
            else {
                let e = 0;
                this.children.forEach((t) => {
                    e += t.getResult();
                });
                this.redPoint = e;
            }
        }
        return this.redPoint;
    }
    removeChild(e) {
        if (e && this.children.has(e.redId)) {
            this.children.delete(e.redId);
        }
    }
    setCalcFunc(Func: Function, param: any) {
        this.calculateFunc = Func;
        this.calculateParam = param;
    }
    setParent(e) {
        const t = this.parent;
        if (t) {
            t.removeChild(e);
        }
        this.parent = e;
    }
}
