import AnimViewBase from "./ViewAnimBase";
const { ccclass, property, disallowMultiple, menu } = cc._decorator;
export enum eVIEW_ANIM_EVENT {
    Show = "Show",
    Close = "Close"
}
@ccclass
@disallowMultiple
@menu("ViewAnimCtrl/ViewAnimCtrl")
export default class ViewAnimCtrl extends AnimViewBase {
    static VIEW_ANIM_EVENT = {
        Show: "Show",
        Close: "Close"
    };
    @property([AnimViewBase])
    animComponents: AnimViewBase[] = [];
    @property(cc.Float)
    logicInDuration = 0.12;
    @property(cc.Float)
    logicOutDuration = 0.1;
    @property(cc.Boolean)
    playOnLoad = true;
    @property(cc.Float)
    playOnLoadDelay = 0;
    _runInAction(e) {
        for (let t = 0; t < this.animComponents.length; t++) {
            this.animComponents[t].runInAction_(this.logicInDuration);
        }
        cc.tween(this.node).delay(this.logicInDuration).call(e).start();
    }
    _runOutAction(e) {
        for (let t = 0; t < this.animComponents.length; t++) {
            this.animComponents[t].runOutAction_(this.logicOutDuration);
        }
        cc.tween(this.node).delay(this.logicOutDuration).call(e).start();
    }
    onClose() {
        this._runOutAction(() => {
            this.node.emit("anim-out-done");
            this.node.emit("remove", this);
        });
        this.node.emit("anim-out-start");
    }
    onEnable() {
        this.node.stopAllActions();
        if (this.playOnLoad) {
            this.playOnLoadDelay = this.playOnLoadDelay ?? 0;
            this.scheduleOnce(this.onShow.bind(this), this.playOnLoadDelay);
        }
    }

    onLoad() {
        if (this.animComponents.length == 0) {
            this.animComponents = this.node.getComponentsInChildren(AnimViewBase);
        }
        this.node.on(eVIEW_ANIM_EVENT.Show, this.onShow, this);
        this.node.on(eVIEW_ANIM_EVENT.Close, this.onClose, this);
    }
    onShow() {
        this._runInAction(() => {
            this.node.emit("anim-in-done");
        });
        this.node.emit("anim-in-start");
    }
}
