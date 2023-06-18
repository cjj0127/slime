export enum WheelState {
    IDLE = 0,
    Other,
    STARTUP,
    RUNNING,
    CATCH_STOP,
    SUB_SPEED,
    CATCH_RESULT,
    BACK,
    Stop
}
const { ccclass, property } = cc._decorator;
@ccclass
export class WheelBase extends cc.Component {
    _backAngle = 0;
    _beStop = false;
    _result = -1;
    _resultAngle = 0;
    _startSubAngle = 0;
    private _state = WheelState.IDLE;
    acceleration = 0;
    @property
    addSpeedTime = 1;
    @property
    backAngle = 0;
    @property
    backTime = 0;
    @property
    displayCount = 9;
    intervalAngle = 0;
    @property
    maxSpeed = 60;
    @property
    minSpeed = 60;
    running = false;
    runningAngle = 0;
    @property
    runningTime = 1;
    speed = 0;
    stateTime = 0;
    @property
    subSpeedTime = 1;
    enterBack() {
        if (this.backAngle <= 0 || this.backTime <= 0) {
            this.enterStop();
        }
        else {
            this.state = WheelState.BACK;
            this.stateTime = 0;
            this.speed = -this.backAngle / this.backTime;
            this.onEnterBack();
        }
    }
    enterCatchResult() {
        this.state = WheelState.CATCH_RESULT;
        this.speed = this.minSpeed;
    }
    enterCatchStop() {
        let e = (this.minSpeed - this.maxSpeed) / this.subSpeedTime;
        let t = this.subSpeedTime;
        let n = this.maxSpeed * t + 0.5 * e * t * t;
        n %= 360;
        if (n < 0) {
            n += 360;
        }
        this._startSubAngle = this._backAngle - n;
        if (this._startSubAngle <= 0) {
            this._startSubAngle += 360;
        }
        this.state = WheelState.CATCH_STOP;
    }
    enterRunningState() {
        this.speed = this.maxSpeed;
        this.stateTime = 0;
        this.state = WheelState.RUNNING;
    }
    enterStartUp() {
        this.running = true;
        this.state = WheelState.STARTUP;
        this.speed = 0;
        this.stateTime = 0;
        this.acceleration = this.maxSpeed / this.addSpeedTime;
        this.runningAngle = null;
        this.onStartup();
        if (this.runningAngle == null) {
            cc.error("在方法 [ onEnterStartup ]中初始化 runningAngle!!!!!!!!!!!");
        }
    }
    enterStop() {
        let e = this;
        this.state = WheelState.Stop;
        this.speed = 0;
        this.runningAngle = this._resultAngle;
        this.running = false;
        this.refresh(this.runningAngle);
        this.onRunDone(this._result, function () {
            e.state = WheelState.IDLE;
        });
    }
    enterSubSpeed() {
        this.acceleration = (this.minSpeed - this.maxSpeed) / this.subSpeedTime;
        this.stateTime = 0;
        this.runningAngle = this._startSubAngle;
        this.refresh(this.runningAngle);
        this.speed = this.maxSpeed;
        this.state = WheelState.SUB_SPEED;
    }
    hasResult() {
        return this._beStop == true;
    }
    initToResult(e) {
        this._result = e;
        this.refresh(this._result * this.intervalAngle);
    }
    lateUpdate(dt) {
        if (this.running) {
            this.stateTime += dt;
            switch (this.state) {
                case WheelState.STARTUP:
                    this.speed += dt * this.acceleration;
                    if (this.stateTime >= this.addSpeedTime) {
                        this.enterRunningState();
                    }
                    break;
                case WheelState.RUNNING:
                    if (this.stateTime >= this.runningTime && this._beStop) {
                        this.enterCatchStop();
                    }
                    break;
                case WheelState.CATCH_STOP:
                    {
                        let n = this.runningAngle % 360;
                        let t = n + this.speed * dt;
                        if (n < this._startSubAngle && t >= this._startSubAngle || t > 360 && t % 360 >= this._startSubAngle) {
                            this.enterSubSpeed();
                        }
                    }
                    break;
                case WheelState.SUB_SPEED:
                    this.speed += this.acceleration * dt;
                    if (this.stateTime >= this.subSpeedTime) {
                        this.enterCatchResult();
                    }
                    break;
                case WheelState.CATCH_RESULT:
                    {
                        let n;
                        let t = (n = this.runningAngle % 360) + this.speed * dt;
                        if (n < this._backAngle && t >= this._backAngle || t > 360 && t % 360 >= this._backAngle) {
                            this.enterBack();
                        }
                    }
                    break;
                case WheelState.BACK:
                    if (this.stateTime >= this.backTime) {
                        this.enterStop();
                    }
            }
            this.runningAngle += this.speed * dt;
            this.refresh(this.runningAngle);
        }
    }
    onEnterBack() {
    }
    onRunDone(r, f) {
    }
    onStartup() {
    }
    // displayCount = 0;
    // addSpeedTime = 0;
    // runningTime = 0;
    // subSpeedTime = 0;
    // maxSpeed = 0;
    // minSpeed = 0;
    // backAngle = 0;
    // backTime = 0;
    // _result = 0;
    // _resultAngle = 0;
    // _backAngle = 0;
    // _beStop = false;
    // intervalAngle = 0;
    // running = false;
    // state = 0;
    // speed = 0;
    // stateTime = 0;
    // acceleration = 0;
    // runningAngle = null;
    // _startSubAngle = 0;
    play() {
        this.intervalAngle = 360 / this.displayCount;
        this._beStop = false;
        this.enterStartUp();
    }
    refresh(e) {
    }
    setResult(e) {
        this._result = e;
        this._resultAngle = this.intervalAngle * e;
        this._backAngle = this._resultAngle + this.backAngle;
        if (this._resultAngle == 0) {
            this._resultAngle = 360;
        }
        this._beStop = true;
    }
    public get state() {
        return this._state;
    }
    public set state(value) {
        this._state = value;
    }
}
