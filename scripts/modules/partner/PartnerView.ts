import EntityViewBase from "../battle/EntityViewBase";
// import EntityViewBase from "EntityViewBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class PartnerView extends EntityViewBase {
    sp: sp.Skeleton = null;
    onLoad() {
        super.onLoad();
        this.sp = this.getComponent(sp.Skeleton);
    }
    pause() {
        this.sp.paused = true;
    }
    playAttack(e) {
        this.sp.setAnimation(0, "action", false);
        let t = this.sp.findAnimation("action").duration;
        this.sp.timeScale = t > e ? t / e : 1;
        this.sp.setCompleteListener(this.playIdle.bind(this));
    }
    playDead() {
        return 0;
    }
    playHit() { }
    playIdle() {
        this.sp.setAnimation(0, "idle", true);
        this.sp.setCompleteListener(null);
    }
    playMove() {
        this.sp.setAnimation(0, "run", true);
        this.sp.setCompleteListener(null);
    }
    resume() {
        this.sp.paused = false;
    }
    updateHp() { }
}
