import StateCustom from "./StateCustom";
import { EEntityEvent, EntityBase } from "./EntityBase";
import FSM from "./FSM";
import TrackFactory from "./TrackFactory";
import { E_BULLET_TRACK } from "../common/Const";
export enum EBullet_Event {
    ERun = "run",
    EBomb = "bomb",
    ERemove = "Remove",
    EDisapear = "Disapear"
}
export enum EBulletState {
    None = 0,
    Run = 1,
    Bomb = 2,
    Disapear = 3,
    Remove = 4
}
const { ccclass, property } = cc._decorator;
@ccclass
export class Bullet extends cc.Component {
    private __fsm: FSM = null;
    private _deletage = null;
    private _target: EntityBase = null;
    bombView = "";
    critical = false;
    damage = "0";
    range = 0;
    speed = 0;
    targetId = 0;
    targetLastPos = null;
    track = null;
    trackType = E_BULLET_TRACK.Line;
    uid = -1;
    bomb() {
        this.__fsm.changeState(EBulletState.Bomb);
    }
    emitEvent(e: string, t?: any, n?: any, o?: any, r?: any, i?: any) {
        this.node.emit.apply(this.node, [e, this].concat(Array.from(arguments).splice(1)));
    }
    initFsm() {
        const e = this.addComponent(FSM);
        e.init(this);
        e.addState(new StateCustom(this, EBulletState.None), "BulletState.None");
        e.addState(new StateCustom(this, EBulletState.Run, {
            enter: this.onEnterRun,
            update: this.onUpdateRun,
            exit: this.onExitRun
        }), "BulletState.Run");
        e.addState(new StateCustom(this, EBulletState.Bomb, {
            enter: this.onEnterBomb
        }), "BulletState.Bomb");
        e.addState(new StateCustom(this, EBulletState.Remove, {
            enter: this.onEnterRemove
        }), "BulletState.Remove");
        e.addState(new StateCustom(this, EBulletState.Disapear, {
            enter: this.onEnterDisapear
        }), "BulletState.Disapear");
        this.__fsm = e;
    }
    checkAlive(): boolean {
        return this.__fsm.curr.id == EBulletState.Run;
    }
    kill(): void {
        this.emitEvent(EBullet_Event.ERemove);
    }
    onDisable() {
        this._target?.node.targetOff(this);
        this._target = null;
    }
    async onEnterBomb() {
        this.emitEvent(EBullet_Event.EBomb);
        const e = this._deletage;
        if (e)
            await e.onBulletBomb(this);
        this.__fsm.changeState(EBulletState.Remove);
    }
    onEnterDisapear() {
        this.emitEvent(EBullet_Event.EDisapear);
    }
    onEnterRemove() {
        this._target?.node.targetOff(this);
        this._target = null;
        this.emitEvent(EBullet_Event.ERemove);
    }
    onEnterRun() {
        this.track = TrackFactory.Instance.create(this.node, this.trackType);
        this.track.delegate = this;
        this.track.speed = this.speed;
        this.track.init();
        this.__fsm.resume();
        this.track.resume();
        this.emitEvent(EBullet_Event.ERun);
        this.track.setRunning(true);
    }
    onExitRun() {
        this.track.setRunning(false);
    }
    onLoad() {
        this.initFsm();
    }
    //    private _target: any = null;
    //    private targetLastPos: cc.Vec2 = cc.Vec2.ZERO;
    onTargetDead() {
        this._target.node.targetOff(this);
        const e = this._target.body.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        this.targetLastPos = this.node.parent.convertToNodeSpaceAR(e);
        this._target = null;
    }
    onUpdateRun() { }
    pause() {
        this.__fsm.pause();
        this.track.pause();
    }
    resume() {
        this.__fsm.resume();
        this.track.resume();
    }
    run() {
        this.__fsm.enterState(EBulletState.Run);
    }
    public set delegate(value) {
        this._deletage = value;
    }
    public set target(value) {
        if (this._target) {
            this._target.node.targetOff(this);
        }
        this._target = value;
        if (this._target) {
            this._target.node.on(EEntityEvent.Dead, this.onTargetDead, this);
            this._target.node.on(EEntityEvent.Remove, this.onTargetDead, this);
        }
    }
    public get target() {
        return this._target;
    }
    get targetPos(): cc.Vec2 {
        if (this._target) {
            const e = this._target.body.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
            return this.node.parent.convertToNodeSpaceAR(e);
        }
        return this.targetLastPos;
    }
}
// enum BulletEvent {
//     None,
//     Run,
//     Bomb,
//     Remove,
//     Disapear
// }
// export enum BulletEvent {
//     Run = "run",
//     Bomb = "bomb",
//     Remove = "remove",
//     Disapear = "disapear"
// }
// class f {
//     static default: any;
//     init(e: any) { }
//     addState(e: any, t: string) { }
// }
// class d {
//     constructor(e: any, t: l, n?: any) { }
// }
// class h {
//     static default: any;
//     delegate: any;
//     speed: number;
//     init() { }
//     resume() { }
//     pause() { }
//     setRunning(e: boolean) { }
// } "
// class T extends cc.Component {
//     kill(): void {
//         this.emitEvent(BulletEvent.Remove);
//     }
//     @i([y])
//     private _(): void { }
// }
