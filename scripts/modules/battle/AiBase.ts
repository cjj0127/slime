import MoveBase from './MoveBase';
import StateCustom from './StateCustom';
import { EEntityEvent, EntityBase } from './EntityBase';
import FSM from './FSM';
export enum EAI_STATE {
    None,
    Idle,
    Move,
    Attack,
    Delay
}
export const AI_EVENT = {
    EnterAttack: "enter-doattack",
    EnterIdle: "enter-idle",
    EnterMove: "enter-move",
    ExitAttack: "exit-doattack",
    ExitIdle: "exit-idle",
    ExitMove: "exit-move"
};
const { ccclass, property } = cc._decorator;
@ccclass
export default class AiBase extends cc.Component {
    private __isPause = false;
    private _target = null;
    atkFre: any = 0;
    atkRange: any = 0;
    atkRunningTime = 0;

    private entity: EntityBase;
    fsm: FSM = null;
    moveEngine = null;

    public attackEnable(): boolean {
        return this.fsm.isInState(EAI_STATE.Attack);
    }

    public chackRange(e: any): boolean {
        if (!e)
            return false;
        if (e.checkAlive()) {
            const t = e.node.position;
            const n = this.node.position;
            const o = this.entity.body;
            const r = e.body;
            const i = this.atkRange + 0.5 * o.node.width + 0.5 * r.node.width;
            return Math.abs(t.x - n.x) <= i;
        }
    }

    public changeRealRange(e: any): boolean {
        if (!e)
            return false;
        if (e.checkAlive()) {
            const t = e.node.position;
            const n = this.node.position;
            const o = this.entity.body;
            const r = e.body;
            const i = this.atkRange + 0.5 * o.node.width + 0.5 * r.node.width;
            return t.sub(n).magSqr() <= i * i;
        }
    }

    public dodead() {
        this.fsm.setRunning(false);
        this.fsm.changeState(EAI_STATE.None);
    }

    public getEntity(): EntityBase {
        return this.entity;
    }

    private onDeadEvent() {
        this.dodead();
    }

    public onEnable() {
        this.fsm.enterState(EAI_STATE.None);
    }

    onEnterAttack() {
    }

    onEnterIdle() {
    }

    onEnterMove() {
    }

    onEnterNone() {
    }

    onExitAttack() {
    }

    onExitIdle() {
    }

    onExitMove() {
    }

    public onLoad() {
        this.moveEngine = this.getComponent(MoveBase);
        this.entity = this.node.getComponent(EntityBase);
        this.entity.node.on(EEntityEvent.Dead, this.onDeadEvent, this);
        const fsm = this.addComponent(FSM);
        fsm.init(this);
        fsm.addState(new StateCustom(this, EAI_STATE.None, {
            enter: this.onEnterNone
        }), "AiBase None");
        fsm.addState(new StateCustom(this, EAI_STATE.Idle, {
            enter: this.onEnterIdle,
            update: this.onUpdateIdle,
            exit: this.onExitIdle
        }), "AiBase Idle");
        fsm.addState(new StateCustom(this, EAI_STATE.Move, {
            enter: this.onEnterMove,
            update: this.onUpdateMove,
            exit: this.onExitMove
        }), "AiBase Move");
        fsm.addState(new StateCustom(this, EAI_STATE.Attack, {
            enter: this.onEnterAttack,
            update: this.onUpdateAttack,
            exit: this.onExitAttack
        }), "AiBase Attack");
        this.fsm = fsm;
    }

    onUpdateAttack(dt) {
    }

    onUpdateIdle(dt) {
    }

    onUpdateMove(dt) {
    }

    public pause() {
        this.__isPause = true;
        this.fsm.pause();
    }

    public resume() {
        this.__isPause = false;
        this.fsm.resume();
    }

    public revive() {
        this.fsm.setRunning(true);
    }

    public startup() {
        this.fsm.setRunning(true);
        this.fsm.enterState(EAI_STATE.Idle);
    }
    get isPause(): boolean {
        return this.__isPause;
    }
    get target() {
        return this._target;
    }
    set target(value) {
        this._target = value;
    }
    get targetPos() {
        return this._target.node.position;
    }
}
