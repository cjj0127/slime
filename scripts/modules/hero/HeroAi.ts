import { E_ENEMY_TYPE } from "../common/Const";
import { eEntityDir } from "../battle/EntityViewBase";
import { EEntityEvent, EntityBase } from "../battle/EntityBase";
import BattleWorld from "../battle/BattleWorld";
import EnemyAIRunAway from "../enemy/EnemyAIRunAway";
import AiBase, { AI_EVENT, EAI_STATE } from "../battle/AiBase";
import Utils_ from "../../ccstudio/utils/Utils";

const { ccclass, property } = cc._decorator;
@ccclass
export default class HeroAi extends AiBase {
    attackFollow: boolean = false;
    checkFre: number = 0.06;
    doubleShot: number = 0;
    followPosition: cc.Vec2 | null = null;
    tripleShot: number = 0;
    dodead(): void {
        this.fsm.setRunning(false);
    }
    onEnterAttack(): void {
        this.atkRunningTime = 0;
        this.moveEngine.setRunning(false);
        this.node.emit(AI_EVENT.EnterAttack);
        if (this.target) {
            this.target.node.once(EEntityEvent.Dead, this.onTargetDead, this);
            const e = this.target.node.getComponent(EnemyAIRunAway);
            this.attackFollow = e !== null;
            if (e) {
                this.followPosition = this.target.node.position;
            }
        }
    }
    onEnterIdle(): void {
        this.moveEngine.setRunning(false);
        this.getEntity().view.playIdle();
        this.node.emit(AI_EVENT.EnterIdle);
    }
    onEnterMove(): void {
        let e = eEntityDir.Right;
        if (this.target) {
            e = this.target.node.x < this.node.x ? eEntityDir.Left : eEntityDir.Right;
        }
        this.moveEngine.velocity = cc.v2(e, 0);
        const t = this.getEntity();
        t.view.setViewDir(e);
        t.view.playMove();
        this.moveEngine.setRunning(true);
        this.checkFre = 0.06;
        this.node.emit(AI_EVENT.EnterMove);
    }
    onEnterNone(): void {
        this.fsm.setRunning(false);
        this.moveEngine.setRunning(false);
    }
    onExitAttack(): void {
        if (this.target) {
            this.target.node.targetOff(this);
        }
        this.node.emit(AI_EVENT.ExitAttack);
    }
    onExitIdle(): void {
        this.node.emit(AI_EVENT.ExitIdle);
    }
    onExitMove(): void {
        this.getEntity().view.playIdle();
        this.moveEngine.setRunning(false);
        this.node.emit(AI_EVENT.ExitMove);
    }
    onLoad() {
        super.onLoad();
    }
    onTargetDead(): void {
        if (this.fsm.isInState(EAI_STATE.Attack)) {
            this.target.node.targetOff(this);
            this.target = BattleWorld.Instance.getNearEnemys(this.node.position);
            if (!this.target) {
                this.fsm.changeState(EAI_STATE.Idle);
            }
        }
    }
    onUpdateAttack(e: number): void {
        this.atkRunningTime -= e;
        if (this.atkRunningTime <= 0) {
            this.atkRunningTime += this.atkFre;
            if (!this.target || !this.target.checkAlive()) {
                this.fsm.changeState(EAI_STATE.Idle);
                return;
            }
            if (this.chackRange(this.target)) {
                const t = this.getEntity();
                const n = this.randomSequenceShot();
                t.repeatAttack_(this.target.getComponent(EntityBase), n, this.atkFre);
            }
            else {
                this.atkRunningTime = 0;
                this.fsm.changeState(EAI_STATE.Idle);
            }
            if (this.target.enemyType == E_ENEMY_TYPE.House) {
                this.target = BattleWorld.Instance.getNearEnemys(this.node.position);
            }
        }
        this.syncRunawayTarget();
    }
    onUpdateIdle(): void {
        this.target = BattleWorld.Instance.getNearEnemys(this.node.position);
        if (this.target && this.target.checkAlive() && this.chackRange(this.target)) {
            this.fsm.changeState(EAI_STATE.Attack);
        }
        else {
            this.fsm.changeState(EAI_STATE.Move);
        }
    }
    onUpdateMove(e: number): void {
        if (!this.target) {
            this.target = BattleWorld.Instance.getNearEnemys(this.node.position);
        }
        this.checkFre -= e;
        if (this.checkFre < 0 && this.target) {
            const t = this.target.node.position;
            const n = this.node.position;
            if (Math.abs(t.x - n.x) <= this.atkRange) {
                this.fsm.changeState(EAI_STATE.Attack);
            }
        }
    }
    randomSequenceShot(): number {
        const e = Utils_.randomNumber(100);
        if (this.tripleShot > 0 && e < this.tripleShot) {
            return 3;
        }
        else if (this.doubleShot > 0 && e < this.doubleShot) {
            return 2;
        }
        else {
            return 1;
        }
    }
    revive(): void {
        this.fsm.setRunning(true);
    }
    syncRunawayTarget(): void {
        if (this.attackFollow && this.target) {
            const e = this.target.node.position;
            this.node.x = this.node.x + e.x - this.followPosition.x;
            this.followPosition = e;
        }
    }
}
