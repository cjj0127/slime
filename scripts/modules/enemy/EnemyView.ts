import { COLOR_RED, COLOR_WHITE } from "../common/Const";
import EntityViewBase from "../battle/EntityViewBase";
// import EntityViewBase from "EntityViewBase";
const { ccclass, property, menu } = cc._decorator;
@ccclass
export default class EnemyView extends EntityViewBase {
    public _animName: string = "";
    public _dirty: boolean = false;
    public _spine: sp.Skeleton = null;
    public animTimeScale: number = 1;
    public completeHandler: Function = null;
    public loop: boolean = false;
    public lateUpdate(): void {
        if (this._dirty) {
            this._dirty = false;
            this.spine.timeScale = this.animTimeScale;
            this.spine.setAnimation(0, this.animName, this.loop);
            this.spine.setCompleteListener(this.completeHandler);
        }
    }
    public pause(): void {
        this.spine.paused = true;
    }
    public playAnimInfo(e: string, t: boolean = true, n: number = 1, o: Function = null): void {
        this.loop = t;
        this.animTimeScale = n;
        this.completeHandler = o;
        this.animName = e;
    }
    public playAttack(e: number) {
        let t = this.spine.findAnimation(this.animName).duration;
        if (t > e) {
            this.spine.timeScale = e / t;
        }
        this.playAnimInfo("SkillAttack", false, 1, this.playIdle.bind(this));
    }
    public playDead(): number {
        let e = this.spine.findAnimation("Die").duration;
        this.playAnimInfo("Die", false, 1);
        return e;
    }
    //     t.prototype.playHit = function(e) {
    //         var t = this;
    //         void 0 == e && (e = a.COLOR_RED);
    //         var n = this.spine.findAnimation("be_hit").duration;
    //         if (this.node.stopAllActions(), cc.tween(this.node).to(.5 * n, {
    //             color: e
    //         }).to(.5 * n, {
    //             color: a.COLOR_WHITE
    //         }).start(), "be_hit" != this.animName) {
    //             var o = this.animName,
    //             r = this.loop,
    //             i = this.completeHandler;
    //             this.playAnimInfo("be_hit", !1, 1,
    //             function() {
    //                 t.playAnimInfo(o, r, 1, i)
    //             })
    //         }
    //     },
    playHit(e: cc.Color) {
        if (!e)
            e = COLOR_RED;
        // const n = this.spine.findAnimation("be_hit").duration;
        // this.node.stopAllActions();
        // if (!e) {
        //     debugger;
        // }
        let n=1
        cc.tween(this.node).to(.5 * n, { color: e }).to(.5 * n, { color: COLOR_WHITE }).start();
        // if ("be_hit" != this.animName) {
        //     const o = this.animName;
        //     let r = this.loop;
        //     let i = this.completeHandler;
        //     this.playAnimInfo("be_hit", !1, 1, () => {
        //         this.playAnimInfo(o, r, 1, i);
        //     });
        // }
    }
    public playIdle() {
        this.playAnimInfo("Run");
    }
    public playMove() {
        this.playAnimInfo("Run");
    }
    public resume(): void {
        this.spine.paused = false;
    }
    // public updateAnim(e: string): void {
    //     if (e == this._animName) return;
    //     this._animName = e;
    //     if (this._spine && p.isSpine(this._spine)) {
    //         const t = this._spine.getComponent(sp.Skeleton);
    //         t.timeScale = this.animTimeScale;
    //         if (t.isAnimationCached(e)) {
    //             t.setCompleteListener((function () {
    //                 if (this.loop) {
    //                     t.setAnimation(0, this._animName, this.loop);
    //                 } else {
    //                     this.completeHandler && this.completeHandler()
    //                 }
    //             }).bind(this));
    //             t.setAnimation(0, this._animName, this.loop);
    //         } else if (!this._dirty) {
    //             this._dirty = true;
    //             let n = cc.resources.get(this._spine.getComponent(sp.Skeleton).skeletonJsonUrl, sp.SkeletonData);
    //             if (n) {
    //                 t.skeletonData = n;
    //                 t.setCompleteListener((function () {
    //                     if (this.loop) {
    //                         t.setAnimation(0, this._animName, this.loop);
    //                     } else {
    //                         this.completeHandler && this.completeHandler()
    //                     }
    //                 }).bind(this));
    //                 t.setAnimation(0, this._animName, this.loop);
    //             } else {
    //                 cc.resources.load(this._spine.getComponent(sp.Skeleton).skeletonJsonUrl, sp.SkeletonData, (function (e, n) {
    //                     if (!e) {
    //                         t.skeletonData = n;
    //                         t.setCompleteListener((function () {
    //                             if (this.loop) {
    //                                 t.setAnimation(0, this._animName, this.loop);
    //                             } else {
    //                                 this.completeHandler && this.completeHandler()
    //                             }
    //                         }).bind(this));
    //                         t.setAnimation(0, this._animName, this.loop);
    //                     }
    //                 }).bind(this))
    //             }
    //         }
    //     }
    // }
    // // public _spine: sp.Skeleton | null = null;
    // // public _animName: string = '';
    // // public _dirty: boolean = false;
    // // public loop: boolean = true;
    // // public animTimeScale: number = 1;
    // // public completeHandler: (() => void) | null = null;
    public updateHp(): void { }
    get animName(): string {
        return this._animName;
    }
    set animName(e: string) {
        if (this._animName != e) {
            this._animName = e;
            this._dirty = true;
        }
    }
    get spine(): sp.Skeleton {
        if (!this._spine)
            this._spine = this.getComponent(sp.Skeleton);
        return this._spine;
    }
}
