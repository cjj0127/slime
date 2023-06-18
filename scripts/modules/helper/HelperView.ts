import EntityViewBase from "../battle/EntityViewBase";
// import { EntityViewBase } from "EntityViewBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class HelperView extends EntityViewBase {
    pause() { }
    playAttack() { }
    playDead() {
        return 0;
    }
    playHit() { }
    playIdle() { }
    playMove() { }
    resume() { }
    updateHp() { }
}
