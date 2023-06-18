const { ccclass, property } = cc._decorator;
@ccclass
export default class ShakeComp extends cc.Component {
    private _initial_x = 0;
    private _initial_y = 0;
    private _running = false;
    private _strength_x = 0;
    private _strength_y = 0;
    private duration = 0;
    @property({ tooltip: '震动频率' })
    frequency = 0.05;
    fgRangeRand(e: number, t: number) {
        return e + Math.random() * (t - e);
    }
    fixedUpdate(e: number) {
        if (this._running) {
            this.duration -= e;
            if (this.duration <= 0) {
                this.stop();
                this.node.emit('ShakeComp-finish');
            }
            else {
                this.node.x = this._initial_x + this.fgRangeRand(-this._strength_x, this._strength_x);
                this.node.y = this._initial_y + this.fgRangeRand(-this._strength_y, this._strength_y);
            }
        }
    }
    onDisable() {
        this.unscheduleAllCallbacks();
    }
    onEnable() {
        this.schedule(this.fixedUpdate, this.frequency, cc.macro.REPEAT_FOREVER);
    }
    play(e: number, t: number, n?: number) {
        this._running && this.stop();
        this.duration = e;
        this._strength_x = t || 0;
        this._strength_y = n !== undefined ? n : t;
        this._running = true;
    }
    start() {
        this._initial_x = this.node.x;
        this._initial_y = this.node.y;
    }
    stop() {
        this.node.x = this._initial_x;
        this.node.y = this._initial_y;
        this._running = false;
    }
}
