import AsyncQueueTool from "../../ccstudio/utils/AsyncQueueTool";
import EntityBody from "./EntityBody";
import FSM from "./FSM";
import Fire from "./Fire";
import HpMgr from "./HpMgr";
import AiBase from "./AiBase";
// import EntityBaseRuningComs from "./EntityBaseRuningComs";
// import EntityViewBase from "./EntityViewBase";
import MoveBase from "./MoveBase";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import StateCustom from "./StateCustom";
import GameGMUI from "./GameGMUI";
import Utils_ from "../../ccstudio/utils/Utils";
import EntityBaseRuningComs from "./EntityBaseRuningComs";
import EntityViewBase from "./EntityViewBase";
export enum EEntityState {
    None = 0,
    Run = 1,
    Dead = 2,
    Disapear = 3,
    Remove = 4
}
export enum EEntityEvent {
    Dead = "EvemtDead",
    Remove = "EvemtRemove",
    Appear = "EvemtAppear",
    Disapear = "EvemtDisapear",
    Hurt = "EvemtHurt",
    HpChanged = "EvemtHpChanged",
    Reborn = "Evemtreborn"
}
;
const { ccclass, property } = cc._decorator;
@ccclass
export class EntityBase extends cc.Component {
    __fsm = null;
    _damage: any = 0;
    _hp = '0';
    _mHp = '0';
    _runningComponents = null;
    ai = null;
    body = null;
    bodySize = null;
    cfgId = -1;
    criticalChange = 0;
    criticalDamge: any = 100;
    deadtDuration = 0;
    dispearDuration = 0;
    enemyType: any;
    fireProxy = null;
    groupId = null;
    moveEngine = null;
    repeatQueue = new AsyncQueueTool();
    suicide = false;
    uid = -1;
    view: EntityViewBase = null;
    doattack(e: any, t: number = 1): void {
        this.view.playAttack(t);
        this.fireProxy.fire(e);
    }
    public doborn(e: {
        x: number;
        y: number;
        z: number;
    }, t: number, n: number, o: number): void {
        this.init(t, n, o);
        this.suicide = false;
        this.node.position = cc.v3(e.x, e.y, e.z);
        this.node.zIndex = -e.y;
        this.run();
    }
    public calcCriticalDamage_(e: number): {
        damage: number;
        critical: boolean;
    } {
        let t = false;
        if (this.criticalChange < 100) {
            if (Utils_.randomNumber(100) <= this.criticalChange) {
                t = true;
                e = NumberPlus.div(NumberPlus.mul(e, this.criticalDamge), 100);
            }
        }
        else {
            t = true;
            e = NumberPlus.div(NumberPlus.mul(e, this.criticalDamge), 100);
        }
        return {
            damage: e,
            critical: t
        };
    }
    public clear(): void {
        this.moveEngine.clear();
        this.__fsm?.enterState(EEntityState.None);
    }
    dodead(): void {
        if (!this.__fsm.isInState(EEntityState.Dead)) {
            this.__fsm.changeState(EEntityState.Dead);
        }
    }
    dodecHp(e: any, t: boolean = false): void {
        if (GameGMUI.isWudi) {
            e = 0;
        }
        if ("0" != this.hp) {
            if (NumberPlus.compare(e, this.hp)) {
                this.hp = "0";
            }
            else {
                this.hp = NumberPlus.sub(this.hp, e);
            }
            this.emitEntityEvent(EEntityEvent.Hurt, this.hp, e);
            if ("0" == this.hp) {
                this.dodead();
            }
            HpMgr.addHpDamage(this.body.node, e, t);
        }
    }
    public emitEntityEvent(e: string, ...args: any[]): void {
        this.node.emit(e, this, ...args);
    }
    protected fsmChangeState(e) {
        this.__fsm.changeState(e);
    }
    protected fsmPerform(e) {
        this.__fsm.perform(e);
    }
    init(e: any, t: any, n: any): void {
        this._hp = e;
        this._mHp = e;
        this.damage = t;
        this.fireProxy.bulletId = n;
        if (GameGMUI.isMiao) {
            this._mHp = "0";
        }
    }
    public initFsm(): void {
        const e = this.addComponent(FSM) as FSM;
        e.init(this);
        e.addState(new StateCustom(this, EEntityState.None), "EntityNone");
        e.addState(new StateCustom(this, EEntityState.Run, {
            enter: this.onRunEnter.bind(this),
            update: this.onRunUpdate.bind(this)
        }), "Entity Run");
        e.addState(new StateCustom(this, EEntityState.Dead, {
            enter: this.onDeadEnter.bind(this),
            update: this.onDeadUpdate.bind(this)
        }), "Entity Dead");
        e.addState(new StateCustom(this, EEntityState.Disapear, {
            enter: this.onDisapearEnter.bind(this),
            update: this.onUpdateDispear.bind(this),
            exit: this.onExitDispear.bind(this)
        }), "Entity Disapear");
        e.addState(new StateCustom(this, EEntityState.Remove, {
            enter: this.onRemoveEnter.bind(this)
        }), "Entity Remove");
        this.__fsm = e;
        this.__fsm.setRunning(true);
    }
    checkAlive(): boolean {
        return this.__fsm.curr.id == EEntityState.Run && NumberPlus.compare(this.hp, "0");
    }
    kill(): void {
        this.hp = "0";
        this.suicide = true;
        this.__fsm.changeState(EEntityState.Dead);
    }
    onActive() {
    }
    onDead_() { }
    private async onDeadEnter(): Promise<void> {
        this.moveEngine.setRunning(false);
        this.emitEntityEvent(EEntityEvent.Dead);
        this.repeatQueue && this.repeatQueue.clear();
        await this.onDead_();
        this.deadtDuration = this.view.playDead();
    }
    private onDeadUpdate(): void {
        if (this.__fsm.timeElapsed > this.deadtDuration) {
            this.__fsm.changeState(EEntityState.Disapear);
        }
    }
    private onDisapearEnter(): void {
        this.emitEntityEvent(EEntityEvent.Disapear);
        this.dispearDuration = this.view.playDisapearAction();
    }
    onExitDispear(): void { }
    onHpChanged(hp, t) { }
    public onLoad(): void {
        this.moveEngine = this.getComponent(MoveBase) as MoveBase;
        this.view = this.getComponentInChildren(EntityViewBase) as EntityViewBase;
        this.ai = this.getComponent(AiBase) as AiBase;
        this.fireProxy = this.getComponentInChildren(Fire) as Fire;
        this.fireProxy.owner = this;
        this._runningComponents = this.getComponents(EntityBaseRuningComs) as cc.Component[];
        this.body = this.getComponent(EntityBody) || this.getComponentInChildren(EntityBody) as EntityBody;
        this.bodySize = this.body.node.getContentSize();
        this.initFsm();
    }
    onRemove() { }
    onRemoveEnter(): void {
        this.onRemove();
        this.emitEntityEvent(EEntityEvent.Remove);
    }
    private onRunEnter(): void {
        this.onActive();
        this.view.playMove();
        window['_'].each(this._runningComponents, (e: any) => {
            if (e.onEnter)
                e.onEnter();
        });
    }
    private onRunUpdate(e: number): void {
        window['_'].each(this._runningComponents, (t: any) => {
            if (t.onUpdate)
                t.onUpdate(e);
        });
    }
    onUpdateDispear(): void {
        if (this.__fsm.timeElapsed > this.dispearDuration) {
            this.__fsm.changeState(EEntityState.Remove);
        }
    }
    pause(): void {
        this.moveEngine.pause();
        this.view.pause();
        this.ai.pause();
        this.__fsm.pause();
        if (this.repeatQueue) {
            this.repeatQueue.enable = false;
        }
    }
    remove(): void {
        this.node.emit("remove");
    }
    repeatAttack_(e: any, t: number, n: any, o: any = null): void {
        if (this.view.playAttack(n), 1 == t) {
            this.fireProxy.fire(e, o);
        }
        else {
            let r = e.node.position.add(cc.v3(15 * t, 0, 0));
            for (let i = 0; i < t; i++) {
                this.repeatQueue.push(function (t) {
                    this.fireProxy.fire(e, o);
                    this.subSelf(cc.v3(30, 0, 0));
                    this.scheduleOnce(t, .03);
                });
            }
            this.repeatQueue.play();
        }
    }
    public reset(): void {
        this.__fsm?.enterState(EEntityState.None);
    }
    resume(): void {
        this.moveEngine.resume();
        this.view.resume();
        this.ai.resume();
        this.__fsm.resume();
        if (this.repeatQueue) {
            this.repeatQueue.enable = true;
        }
    }
    run(): void {
        this.__fsm.enterState(EEntityState.Run);
    }
    public setViewScale(e: number): void {
        this.view.setViewScale(e);
        this.body.node.width = this.bodySize.width * e;
        this.body.node.height = this.bodySize.height * e;
    }
    get damage() {
        return this._damage;
    }
    set damage(val) {
        this._damage = val;
    }
    get hp(): string {
        return this._hp;
    }
    set hp(e: string) {
        let t = this._hp;
        if (NumberPlus.compare(e, this._mHp)) {
            e = this._mHp;
        }
        if (NumberPlus.compare(0, e)) {
            e = "0";
        }
        if (t != e) {
            this._hp = e;
            this.emitEntityEvent(EEntityEvent.HpChanged, e, t);
            this.onHpChanged(this.hp, t);
        }
    }
    get maxHp(): string {
        return this._mHp;
    }
    set maxHp(e: string) {
        this._mHp = e;
    }
    get runningComponents() {
        return this._runningComponents;
    }
    set runningComponents(val) {
        this._runningComponents = val;
    }
}
// n.default = T;
