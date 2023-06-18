import AnimViewBase from "./ViewAnimBase";
// import ViewAnimBase from "ViewAnimBase";
const { ccclass, property, menu, disallowMultiple } = cc._decorator;
@ccclass
@menu("ViewAnim/ViewAnimFade")
@disallowMultiple
export default class ViewAnimFade extends AnimViewBase {
    private tween: cc.Tween = null;
    createInAction(time: number) {
        return cc.tween().set({
            opacity: 0
        }).to(time, {
            opacity: this._originOpacity
        });
    }
    createOutAction(time: number) {
        return cc.tween().to(time, {
            opacity: 0
        });
    }
    initialize() { }
    runInAction_(time: number) {
        this.tween && this.tween.stop();
        this.node.active = true;
        this.node.opacity = 0;
        this.tween = cc.tween(this.node).then(this.createInAction(time)).start();
    }
    runOutAction_(time: number) {
        let t = this;
        this.tween && this.tween.stop();
        this.tween = cc.tween(this.node).then(this.createOutAction(time)).call(() => t.node.active = false).start();
    }
}
