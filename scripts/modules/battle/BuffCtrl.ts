import Buff from "./Buff";
import Game from "../Game";
const { ccclass, property } = cc._decorator;
@ccclass
export default class BuffCtrl extends cc.Component {
    private _pause: boolean = false;
    private _running: boolean = false;
    private buffs: Buff[] = [];
    private pool: Buff[] = [];
    public addBuff(e: any, t: any, n: any, o: any): Buff {
        const r = this.get();
        r.initialize(e, t, n, o);
        this.buffs.push(r);
        return r;
    }
    public clear(): void {
        this.buffs.forEach((t) => {
            t.clear();
            t.setDisable();
            this.put(t);
        });
        this.buffs.length = 0;
    }
    public fixedUpdate(e: number): void {
        if (!this._pause && this._running && (e *= Game.Instance.globalSpeed, this.buffs.length > 0)) {
            const n: number[] = [];
            this.buffs.forEach((o, r) => {
                o.execute(e);
                if (!o.isValid) {
                    o.setDisable();
                    this.put(o);
                    n.push(r);
                }
            });
            if (n.length > 0) {
                for (let i = n.length - 1; i >= 0; i--) {
                    this.buffs.splice(n[i], 1);
                }
            }
        }
    }
    public get(): Buff {
        return this.pool.length > 0 ? this.pool.pop()! : new Buff();
    }
    public onDisable(): void {
        this.unschedule(this.fixedUpdate);
    }
    public onEnable(): void {
        this.schedule(this.fixedUpdate, 0.033, cc.macro.REPEAT_FOREVER);
    }
    public pause(): void {
        this._pause = true;
    }
    public put(e: Buff): void {
        this.pool.push(e);
    }
    public resume(): void {
        this._pause = false;
    }
    public setRunning(e: boolean): void {
        this._running = e;
    }
}
