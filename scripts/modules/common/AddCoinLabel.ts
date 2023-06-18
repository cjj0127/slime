import NumberPlus from "../../ccstudio/utils/NumberPlus";
import MyTools from "../../ccstudio/utils/MyTools";
const { ccclass, property } = cc._decorator;
@ccclass
export default class AddCoinLabel extends cc.Component {
    private _formatFunc: Function = MyTools.formatNumberToInt;
    private _maxTime: number;
    private _playCompleteCallback: Function;
    private _resultValue: number = 0;
    private _runTime: number;
    private _running: boolean;
    private _startValue: number = 0;
    @property(cc.Label)
    private _valueLabel: cc.Label = null;
    private curValue: number = 0;
    private preStr: string = "";
    finish() {
        if (this._playCompleteCallback) {
            const e = this._playCompleteCallback;
            this._playCompleteCallback = null;
            e();
        }
        this.node.emit("finished");
    }
    getCurrValue(): number {
        return this.curValue;
    }
    getLabel(): cc.Label {
        return this._valueLabel;
    }
    getRunning(): boolean {
        return this._running;
    }
    immediateStop() {
        this._running = false;
        this.setValue(this._resultValue);
        this.finish();
    }
    onLoad(): void {
        this._valueLabel = this.node.getComponent(cc.Label);
    }
    play(e: number, t: number, n: number, o: Function) {
        this._playCompleteCallback = o;
        this._startValue = e;
        this._resultValue = t;
        this._maxTime = n;
        this._runTime = 0;
        this._running = true;
    }
    playBy(e: number, t: number, n: Function) {
        if (this._running) {
            if (this._playCompleteCallback) {
                this._playCompleteCallback();
                this.node.emit("finished");
            }
            this._resultValue = NumberPlus.add(this._resultValue, e);
        }
        else {
            this._startValue = this.curValue;
            this._resultValue = NumberPlus.add(this.curValue, e);
        }
        this._playCompleteCallback = n;
        this._maxTime = t;
        this._runTime = 0;
        this._running = true;
    }
    playTo(e: number, t: number, n: Function = null) {
        this._playCompleteCallback = n;
        this._startValue = this.curValue;
        this._resultValue = e;
        this._maxTime = t;
        this._runTime = 0;
        this._running = true;
    }
    setFormatFunc(e: Function) {
        this._formatFunc = e;
    }
    setPreStr(e: string) {
        this.preStr = e;
    }
    setValue(e: any) {
        this.curValue = e;
        this._valueLabel.string = this.preStr + this._formatFunc(e);
    }
    stop() {
        this._running = false;
        this.setValue(this._resultValue);
    }
    update(e: number) {
        if (this._running) {
            this._runTime += e;
            let t = this._runTime / this._maxTime;
            t = Math.max(0, Math.min(1, t));
            const n = NumberPlus.lerp(this._startValue, this._resultValue, t);
            this.setValue(n);
            if (this._runTime >= this._maxTime) {
                this._running = false;
                this.finish();
            }
        }
    }
    // private curValue: number = 0;
    // private _formatFunc: Function = MyTools.formatNumberToInt;
    // private _running: boolean = false;
    // private _runTime: number = 0;
    // private _maxTime: number = 0;
    // private _startValue: number = 0;
    // private _resultValue: number = 0;
    // private _playCompleteCallback: Function = null;
    get string(): string {
        return "" + this.curValue;
    }
    set string(value: string) {
        this.setValue(value);
    }
}
