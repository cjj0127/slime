import AnimViewBase from "./ViewAnimBase";
const { ccclass, property, disallowMultiple } = cc._decorator;
@ccclass
@disallowMultiple
export default class ViewAnimScale extends AnimViewBase {
    @property
    private _originScale: number = 0;
    tween: cc.Tween = null;
    public createInAction(e: number) {
        return cc.tween().parallel(cc.tween().to(e, { opacity: 255 }), cc.tween()
            .to(0.6 * e, { scale: 1.15 })
            .to(0.4 * e, { scale: this._originScale }));
    }
    public createOutAction(e: number) {
        return cc.tween().parallel(cc.tween().to(e, { scale: 0 }), cc.tween()
            .delay(0.4 * e)
            .set({ opacity: 255 })
            .to(e, { opacity: 0.6 }));
    }
    public initialize() {
        this._originScale = this.node.scale;
    }
    public runInAction_(e: number) {
        this.tween && this.tween.stop();
        this.node.active = true;
        this.node.opacity = 0;
        this.node.scale = 0;
        this.tween = cc.tween(this.node).then(this.createInAction(e)).start();
    }
    public runOutAction_(e: number) {
        const t = this;
        this.tween && this.tween.stop();
        this.tween = cc.tween(this.node)
            .then(this.createOutAction(e))
            .call(() => (t.node.active = false))
            .start();
    }
}
