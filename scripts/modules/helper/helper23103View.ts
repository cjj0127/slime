import Utils_ from "../../ccstudio/utils/Utils";
import EntityViewBase from "../battle/EntityViewBase";
const { ccclass, property } = cc._decorator;
const p = ["mogu1_run", "mogu2_run", "mogu3_run"];
@ccclass
export default class helper23103View extends EntityViewBase {
    @property(sp.Skeleton)
    spine: sp.Skeleton = null;

    onEnable() {
        const e = Utils_.randomNumber(p.length);
        this.spine.setAnimation(0, p[e], true);
    }

    pause() {
        this.spine.paused = true;
    }

    playAttack() { }

    playDead() {
        return 0;
    }

    playHit() { }

    playIdle() { }

    playMove() { }

    resume() {
        this.spine.paused = false;
    }

    updateHp() { }
}
