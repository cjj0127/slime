import { COLOR_RED, COLOR_WHITE, GamePrefabs_ } from "../common/Const";
import AssetPool from "../asset/AssetPool";
import HurtView from "../battle/HurtView";
import EntityViewBase from "../battle/EntityViewBase";
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("Custom Components/EntityView")
export class HeroView extends EntityViewBase {
    lvupBehid: HurtView = null;
    lvupFront: HurtView = null;
    sp: sp.Skeleton = null;
    onLoad() {
        super.onLoad();
        this.sp = this.getComponent(sp.Skeleton);
    }
    pause() {
        this.sp.paused = true;
    }
    playAttack(e: number) {
        this.sp?.setAnimation(0, "play", false);
        const duration = this.sp?.findAnimation("play").duration || 0;
        this.sp.timeScale = duration > e ? duration / e : 1;
        this.sp.setCompleteListener(() => this.playIdle());
    }
    playDead(): number {
        this.sp?.setAnimation(0, "dodead", false);
        this.sp?.setCompleteListener(null);
        return this.sp?.findAnimation("dodead").duration || 0;
    }
    playHit(e: cc.Color = COLOR_RED) {
        this.sp?.setAnimation(0, "be_hit", false);
        const duration = this.sp?.findAnimation("be_hit").duration || 0;
        this.node.stopAllActions();
        cc.tween(this.node)
            .to(0.4 * duration, { color: e })
            .to(0.4 * duration, { color: COLOR_WHITE })
            .start();
    }
    playIdle() {
        this.sp?.setAnimation(0, "standby", true);
        this.sp?.setCompleteListener(null);
    }
    playLvup() {
        if (this.lvupBehid) {
            this.lvupBehid.resetPlay("behind");
        }
        else {
            const t = AssetPool.Instance.createObject(GamePrefabs_.LvUp) as cc.Node;
            t.parent = this.node.parent;
            t.setSiblingIndex(0);
            const n = t.getComponent(HurtView);
            n?.play("behind", () => {
                AssetPool.Instance.put(t);
                this.lvupBehid = null;
            });
            this.lvupBehid = n;
        }
        if (this.lvupFront) {
            this.lvupFront.resetPlay("front");
        }
        else {
            const o = AssetPool.Instance.createObject(GamePrefabs_.LvUp) as cc.Node;
            o.parent = this.node.parent;
            o.setSiblingIndex(this.node.getSiblingIndex() + 1);
            const r = o.getComponent(HurtView);
            r?.play("front", () => {
                AssetPool.Instance.put(o);
                this.lvupFront = null;
            });
            this.lvupFront = r;
        }
    }
    playMove() {
        this.sp?.setAnimation(0, "run", true);
    }
    resume() {
        this.sp.paused = false;
    }
    updateHp() { }
}
