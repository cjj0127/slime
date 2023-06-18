const { ccclass, property } = cc._decorator;
@ccclass
export default class LoadingView extends cc.Component {
    private _prgoressMessage: string = "";
    private _progressPercent: number = 0;
    private _progressPercentMax: number = 0;
    @property(cc.Label)
    messageLabel: cc.Label = null;
    @property(cc.ProgressBar)
    progressBar: cc.ProgressBar = null;
    @property(cc.Label)
    progresslabel: cc.Label = null;
    private repeat: number = 0;
    lateUpdate() {
        if (this._progressPercent < this._progressPercentMax) {
            if (this._progressPercent < 0.6) {
                this._progressPercent += 0.006;
            }
            if (this._progressPercent < 0.8) {
                this._progressPercent += 0.003;
            }
            else {
                this._progressPercent += 0.001;
            }
            this._progressPercent = Math.min(this._progressPercent, this._progressPercentMax);
            this.progresslabel.string = `${Math.min(Math.ceil(100 * this._progressPercent), 100)}%`;
            this.progressBar.progress = this._progressPercent;
        }
        this.repeat++;
        if (this.messageLabel) {
            const dots = new Array(Math.floor(this.repeat / 30) % 4).fill(".").join("");
            this.messageLabel.string = `${this._prgoressMessage}${dots}`;
        }
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.progresslabel.string = "";
        this.progressBar.progress = 0;
        this._progressPercent = 0;
        this._progressPercentMax = 0;
        this.repeat = 0;
    }
    onProgressMessage(e: string) {
        this._prgoressMessage = e;
        if (this.messageLabel) {
            this.messageLabel.string = e;
        }
    }
    onProgressUpdate(e: number, t: number) {
        if (t > 0) {
            const n = e / t;
            this._progressPercent = Math.max(n, this._progressPercent);
            this._progressPercentMax = this._progressPercent;
            this.progresslabel.string = `${Math.min(Math.ceil(100 * this._progressPercent), 100)}%`;
            this.progressBar.progress = this._progressPercent;
        }
    }
    registerTransitionProgress() {
        this.progresslabel.string = "0%";
        this.progressBar.progress = 0;
        this._progressPercent = 0;
        this._progressPercentMax = 0.99;
        this._prgoressMessage = "正在加载资源";
        if (this.messageLabel) {
            this.messageLabel.string = this._prgoressMessage;
        }
        cc.director.on("transition-progress", this.onProgressUpdate, this);
        if (this.messageLabel) {
            cc.director.on("transition-message", this.onProgressMessage, this);
        }
    }
}
