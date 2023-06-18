const { ccclass, property } = cc._decorator;
@ccclass
export default class AnimViewBase extends cc.Component {
    _inited: boolean = false;
    _originOpacity: number = 0;

    initialize() { }

    onEnable() {
        this.node.opacity = 0;
        cc.director.once(cc.Director.EVENT_BEFORE_DRAW, this.refreshAfterScene_, this);
    }

    onLoad() {
        this._inited = false;
        this._originOpacity = this.node.opacity;
    }

    refreshAfterScene_() {
        if (!this._inited) {
            this._inited = true;
            this.initialize();
        }
    }

    runInAction_(t) {
    }

    runOutAction_(t) {
    }
}
