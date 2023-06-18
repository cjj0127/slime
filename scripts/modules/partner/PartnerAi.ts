import BattleWorld from "../battle/BattleWorld";
import AiBase, { AI_EVENT, EAI_STATE } from "../battle/AiBase";
import Partner from "./Partner";
// import Partner from 'Partner';
const { ccclass, property } = cc._decorator;
@ccclass
export default class PartnerAi extends AiBase {
    private _follow: Partner = null;
    followOffset: cc.Vec2 = null;
    private _registerFollowEvent(): void {
        this._follow.node.on(AI_EVENT.EnterIdle, this.onTargetEnterIdleEvent, this);
        this._follow.node.on(AI_EVENT.EnterMove, this.onTargetMoveIdleEvent, this);
        this._follow.node.on(AI_EVENT.EnterAttack, this.onTargetAttackIdleEvent, this);
        this._follow.node.on(cc.Node.EventType.POSITION_CHANGED, this.onFollowPositionChange, this);
    }
    private _unregisterFollowEvent(): void {
        if (this._follow) {
            this._follow.node.targetOff(this);
        }
    }
    onEnterAttack(): void {
        this.target = BattleWorld.Instance.getNearEnemys(this.node.position);
    }
    onEnterIdle(): void {
        this.getEntity().view.playIdle();
        if (this._follow && this._follow.ai.attackEnable()) {
            this.fsm.changeState(EAI_STATE.Attack);
        }
    }
    onEnterMove(): void {
        this.getEntity().view.playMove();
    }
    onEnterNone(): void { }
    onExitAttack(): void { }
    onExitIdle(): void { }
    onExitMove(): void {
        this.getEntity().view.playIdle();
    }
    private onFollowPositionChange(): void {
        //@ts-ignore
        this.node.position = this.follow.node.position.add(this.followOffset);
    }
    private onTargetAttackIdleEvent(): void {
        if (!this.fsm.isInState(EAI_STATE.Attack)) {
            this.fsm.changeState(EAI_STATE.Attack);
        }
    }
    private onTargetEnterIdleEvent(): void {
        if (!this.fsm.isInState(EAI_STATE.Idle)) {
            this.fsm.changeState(EAI_STATE.Idle);
        }
    }
    private onTargetMoveIdleEvent(): void {
        if (!this.fsm.isInState(EAI_STATE.Move)) {
            this.fsm.changeState(EAI_STATE.Move);
        }
    }
    onUpdateAttack(e: number): void {
        this.atkRunningTime -= e;
        if (this.atkRunningTime <= 0) {
            this.atkRunningTime += this.atkFre;
            if (!this.target || !this.target.checkAlive()) {
                this.target = BattleWorld.Instance.getNearEnemys(this.node.position);
            }
            if (this.target && this.target.checkAlive()) {
                this.getEntity().doattack(this.target);
            }
        }
    }
    onUpdateIdle(): void { }
    onUpdateMove(): void { }
    get follow(): Partner {
        return this._follow;
    }
    set follow(value: Partner) {
        if (this._follow !== value) {
            this._unregisterFollowEvent();
            this._follow = value;
            this._registerFollowEvent();
        }
    }
}
