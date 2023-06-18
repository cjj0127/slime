import AnimViewBase from "./ViewAnimBase";
const { ccclass, disallowMultiple, menu, property } = cc._decorator;
@ccclass
@disallowMultiple
@menu("ViewAnim/ViewAnimCCAnim")
export default class ViewAnimCCAnim extends AnimViewBase {
    private _clips: cc.AnimationClip[] = [];
    @property(cc.Animation)
    anim: cc.Animation = null;
    @property({ displayName: "入场动画序号" })
    animInIdx: number = -1;
    @property({ displayName: "出场动画序号" })
    animOutIdx: number = -1;
    initialize() {
        this._clips = this.anim.getClips();
    }
    runInAction_() {
        if (this.animInIdx >= 0 && this.animInIdx < this._clips.length) {
            this.anim.play(this._clips[this.animInIdx].name);
        }
        this.node.runAction(cc.fadeIn(0.1));
    }
    runOutAction_() {
        if (this.animOutIdx >= 0 && this.animOutIdx < this._clips.length) {
            this.anim.play(this._clips[this.animOutIdx].name);
        }
    }
}
