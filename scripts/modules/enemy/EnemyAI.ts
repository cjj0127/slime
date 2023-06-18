import { eEntityDir } from "../battle/EntityViewBase";
import AiBase, { EAI_STATE } from "../battle/AiBase";
// import EnemyEntity from "EnemyEntity";
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("Enemy/EnemyAI")
export default class EnemyAI extends AiBase {
    onEnterAttack() {
        this.moveEngine.setRunning(false);
        this.atkRunningTime = 0;
    }
    onEnterIdle() {
        this.getEntity().view.playIdle();
        this.moveEngine.setRunning(false);
    }
    onEnterMove() {
        const e = this.target.node.x < this.node.x ? eEntityDir.Left : eEntityDir.Right;
        this.moveEngine.velocity = cc.v2(e, 0);
        const t = this.getEntity();
        t.view.setViewDir(e);
        t.view.playMove();
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
    onUpdateAttack(e) {
        if (this.atkRunningTime -= e, this.atkRunningTime <= 0) {
            if (!this.target || !this.target.checkAlive()) {
                this.fsm.changeState(EAI_STATE.None);
                return;
            }
            if (this.chackRange(this.target)) {
                this.getEntity().doattack(this.target, this.atkFre);
            }
            else {
                this.fsm.changeState(EAI_STATE.Move);
            }
            this.atkRunningTime += this.atkFre;
        }
    }
    onUpdateIdle() {
        this.fsm.changeState(EAI_STATE.Move);
    }
    onUpdateMove() {
        if (this.target && this.target.checkAlive()) {
            if (this.chackRange(this.target)) {
                this.fsm.changeState(EAI_STATE.Attack);
                return;
            }
        }
        else {
            this.fsm.changeState(EAI_STATE.None);
        }
    }
}
