import BattleWorld from "../battle/BattleWorld";
import HeroMember from "./HeroMember";
import AiBase, { AI_EVENT, EAI_STATE } from "../battle/AiBase";
// n.default = p
const { ccclass, property } = cc._decorator;
@ccclass
export default class HeroMemberAi extends AiBase {
    private _follow: HeroMember = null;
    followOffset: cc.Vec2 = null;
    _registerFollowEvent(): void {
        this._follow.node.on(AI_EVENT.EnterIdle, this.onTargetEnterIdleEvent, this);
        this._follow.node.on(AI_EVENT.EnterMove, this.onTargetMoveIdleEvent, this);
        this._follow.node.on(AI_EVENT.EnterAttack, this.onTargetAttackIdleEvent, this);
        this._follow.node.on(cc.Node.EventType.POSITION_CHANGED, this.onFollowPositionChange, this);
    }
    _unregisterFollowEvent(): void {
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
    onEnterNone() { }
    onExitAttack() { }
    onExitIdle() { }
    onExitMove(): void {
        this.getEntity().view.playIdle();
    }
    private onFollowPositionChange(): void {
        this.node.position = this._follow.node.position.add(this.followOffset as any);
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
    onUpdateIdle() { }
    onUpdateMove() { }
    get follow(): HeroMember {
        return this._follow;
    }
    set follow(value: HeroMember) {
        if (this._follow !== value) {
            this._unregisterFollowEvent();
            this._follow = value;
            this._registerFollowEvent();
        }
    }
}
