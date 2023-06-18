import { eEntityDir } from "../battle/EntityViewBase";
import AiBase, { EAI_STATE } from "../battle/AiBase";
// import EnemyEntity from "EnemyEntity";
const { ccclass, property } = cc._decorator;
@ccclass
export default class EnemyAIRunAway extends AiBase {
    onEnterAttack() { }
    onEnterIdle() {
        this.getEntity().view.playIdle();
        this.moveEngine.setRunning(false);
    }
    onEnterMove() {
        const dir = this.target.node.x > this.node.x ? eEntityDir.Left : eEntityDir.Right;
        this.moveEngine.velocity = cc.v2(dir, 0);
        const entity = this.getEntity();
        entity.view.setViewDir(dir);
        entity.view.playMove();
        this.moveEngine.setRunning(true);
    }
    onEnterNone() {
        this.getEntity().view.playIdle();
        this.moveEngine.setRunning(false);
    }
    onExitAttack() { }
    onExitIdle() { }
    onExitMove() {
        this.getEntity().view.playIdle();
        this.moveEngine.setRunning(false);
    }
    onUpdateAttack() { }
    onUpdateIdle() {
        this.fsm.changeState(EAI_STATE.Move);
    }
    onUpdateMove() { }
}
