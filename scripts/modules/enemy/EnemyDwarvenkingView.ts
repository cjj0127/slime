import { COLOR_RED, COLOR_WHITE } from "../common/Const";
import EntityViewBase from "../battle/EntityViewBase";
const { ccclass, property } = cc._decorator;
// n.default = p
@ccclass
export default class EnemyDwarvenkingView extends EntityViewBase {
    @property
    private _animName: string = "";
    @property
    private _dirty: boolean = false;
    @property
    private _spine: sp.Skeleton = null;
    @property
    public animTimeScale: number = 1;
    @property
    public completeHandler: any = null;
    @property
    public loop: boolean = false;
    lateUpdate() {
        if (this._dirty) {
            this._dirty = false;
            this.spine.timeScale = this.animTimeScale;
            this.spine.setAnimation(0, this.animName, this.loop);
            this.spine.setCompleteListener(this.completeHandler);
        }
    }
    pause() {
        this.spine.paused = true;
    }
    playAnimInfo(e, t = true, n = 1, o = null) {
        this.loop = t;
        this.animTimeScale = n;
        this.completeHandler = o;
        this.animName = e;
    }
    playAttack(e) {
        const t = this.spine.findAnimation(this.animName).duration;
        if (t > e) {
            this.spine.timeScale = e / t;
        }
        this.playAnimInfo("play", false, 1, this.playIdle.bind(this));
    }
    playDead() {
        const e = this.spine.findAnimation("dodead").duration;
        this.playAnimInfo("dodead", false, 1);
        return e;
    }
    playHit(e = COLOR_RED) {
        this.node.stopAllActions();
        cc.tween(this.node).to(0.05, { color: e })
            .to(0.05, { color: COLOR_WHITE })
            .start();
    }
    playIdle() {
        this.playAnimInfo("run");
    }
    playMove() {
        this.playAnimInfo("run");
    }
    resume() {
        this.spine.paused = false;
    }
    updateHp() { }
    get animName() {
        return this._animName;
    }
    set animName(e) {
        if (this._animName != e) {
            this._animName = e;
            this._dirty = true;
        }
    }
    get spine() {
        if (!this._spine) {
            this._spine = this.getComponent(sp.Skeleton);
        }
        return this._spine;
    }
}
