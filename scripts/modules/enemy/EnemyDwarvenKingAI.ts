import { GameConst } from "../common/Const";
import { eEntityDir } from "../battle/EntityViewBase";
import AiBase, { EAI_STATE } from "../battle/AiBase";
// import { EnemyEntity } from "EnemyEntity";
const { ccclass, property, menu } = cc._decorator;
@ccclass
export default class EnemyDwarvenKingAI extends AiBase {
    atkRunningTime: number;
    delayAtkTime: number = 0;
    onEnterAttack() {
        this.moveEngine.setRunning(false);
        this.atkRunningTime = 0;
    }
    onEnterIdle() {
        this.getEntity().view.playIdle();
        this.moveEngine.setRunning(false);
    }
    onEnterMove() {
        const dir = this.target.node.x < this.node.x ? eEntityDir.Left : eEntityDir.Right;
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
    onExitAttack() {
        this.delayAtkTime = 0;
    }
    onExitIdle() { }
    onExitMove() {
        this.getEntity().view.playIdle();
        this.moveEngine.setRunning(false);
    }
    onUpdateAttack(dt: number) {
        this.atkRunningTime -= dt;
        this.delayAtkTime += dt;
        if (this.atkRunningTime <= 0) {
            if (this.delayAtkTime < GameConst.DWARVENKING_ATTACK_CD) {
                return;
            }
            if (!this.target || !this.target.checkAlive()) {
                this.fsm.changeState(EAI_STATE.None);
            }
            else if (this.chackRange(this.target)) {
                this.getEntity().doattack(this.target, this.atkFre);
            }
            else {
                this.fsm.changeState(EAI_STATE.Move);
            }
            this.atkRunningTime += this.atkFre;
        }
    }
    onUpdateIdle(dt: number) {
        this.delayAtkTime += dt;
        if (this.delayAtkTime >= GameConst.DWARVENKING_ATTACK_CD) {
            this.fsm.changeState(EAI_STATE.Attack);
        }
        else {
            this.fsm.changeState(EAI_STATE.Move);
        }
    }
    onUpdateMove(dt: number) {
        this.delayAtkTime += dt;
        if (this.target && this.target.checkAlive()) {
            if (this.chackRange(this.target)) {
                if (this.delayAtkTime >= GameConst.DWARVENKING_ATTACK_CD) {
                    this.fsm.changeState(EAI_STATE.Attack);
                }
                else {
                    this.fsm.changeState(EAI_STATE.Idle);
                }
            }
            else {
                this.fsm.changeState(EAI_STATE.Move);
            }
        }
        else {
            this.fsm.changeState(EAI_STATE.None);
        }
    }
}
