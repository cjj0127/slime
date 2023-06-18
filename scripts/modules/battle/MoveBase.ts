import Game from "../Game";
// import Game from "Game";
const { ccclass, property, disallowMultiple } = cc._decorator;
@ccclass
@disallowMultiple
export default class MoveBase extends cc.Component {
    private _paused: boolean = false;
    private _running: boolean = true;
    private _speed: number = 0;
    private _velocity: cc.Vec2 = cc.v2(1, 0);
    public chackRange(e: cc.Vec2, t: cc.Vec2, n: number): boolean {
        return e.sub(t).magSqr() < n * n;
    }
    public clear(): void { }
    public isPause(): boolean {
        return this._paused;
    }
    public isStatic(e: number = 1): boolean {
        return this.velocity.mul(this.speed).fuzzyEquals(cc.Vec2.ZERO, e);
    }
    public lateUpdate(e: number): void {
        e *= Game.Instance.globalSpeed;
        this.step(e);
    }
    onStep(e: number): void { }
    public pause(): void {
        this._paused = true;
    }
    public resume(): void {
        this._paused = false;
    }
    public setRunning(flag: boolean): void {
        this._running = flag;
    }
    public step(e: number): void {
        if (!this._paused && this._running) {
            e > 0.2 && (e = 0.04);
            this.onStep(e);
        }
    }
    public get speed(): number {
        return this._speed;
    }
    public set speed(value: number) {
        if (this._speed !== value) {
            this._speed = value;
        }
    }
    public get velocity(): cc.Vec2 {
        return this._velocity;
    }
    public set velocity(v: cc.Vec2) {
        this._velocity = v.normalize();
    }
}
