import Game from "../Game";
import StateCustom from "./StateCustom";
const { ccclass, property } = cc._decorator;
@ccclass
export default class FMS extends cc.Component {
    private _fsmName: string;
    private _isPaused: boolean = false;
    private _running: boolean;
    private _target: any;
    public curr: any;
    private prev: any;
    private states: {
        [key: string]: any;
    } = {};
    private timeElapsed: number = 0;
    public addState(e: StateCustom, t: string): void {
        this.states[e.id] = e;
        this._fsmName = t;
    }
    public changeState(e: any): void {
        const t = this.states[e];
        if (t == undefined) {
            console.warn(`[FSM] invalid state for stateId: ${e} of : ${this._target.__classname__}`);
        }
        else {
            if (!this.curr) {
                cc.error("curr state is nil!!", e, this.curr);
            }
            if (e !== this.curr.id) {
                this.timeElapsed = 0;
                this.curr.onExit();
                this.prev = this.curr;
                this.curr = t;
                this.curr.onEnter();
            }
        }
    }
    public enterState(e: any, t: any = null): void {
        this.timeElapsed = 0;
        const n = this.states[e];
        this.curr = n;
        n.onEnter(t);
    }
    public fixedUpdate(e: number): void {
        if (this._running) {
            if (!this._isPaused) {
                Game.Instance.globalSpeed;
                if (e > .2) {
                    e = .04;
                }
                this.timeElapsed += e;
                if (this.curr !== undefined) {
                    this.curr.onUpdate(e);
                }
            }
        }
    }
    public getCurrState(): any {
        return this.curr;
    }
    public getPrevState(): any {
        return this.prev;
    }
    public getState(e: string): any {
        return this.states[e];
    }
    public init(e: any): void {
        this._target = e;
        this.timeElapsed = 0;
    }
    public isInState(e: any): boolean {
        return this.curr == this.states[e];
    }
    public onDisable(): void {
        this.unscheduleAllCallbacks();
    }
    public onEnable(): void {
        const delay: number = 1 * Math.random() / 30;
        const interval: number = 1 / 15;
        this.schedule(this.fixedUpdate.bind(this), interval, cc.macro.REPEAT_FOREVER, delay);
    }
    public pause(): void {
        this._isPaused = true;
    }
    public resetCurrState(): void {
        this.timeElapsed = 0;
        this.curr.onExit();
        this.curr.onEnter();
    }
    public resume(): void {
        this._isPaused = false;
    }
    public revertState(): void {
        this.changeState(this.prev.id);
    }
    public setRunning(e: boolean): void {
        this._running = e;
    }
    get target() {
        return this._target;
    }
}
