import LanMgr from "./Language";
// import Language from "Language";
const { ccclass, property } = cc._decorator;
enum State {
    NONE,
    OPEN,
    DELAY,
    CLOSE
}
@ccclass
export default class ToastSummonLvup extends cc.Component {
    @property(cc.RichText)
    messageLabel: cc.RichText = null;
    @property(cc.RichText)
    nextLvLabel: cc.RichText = null;
    @property(cc.RichText)
    preLvLabel: cc.RichText = null;
    private running: boolean = false;
    private runningTime: number = 0;
    private state: State = State.NONE;
    lateUpdate(dt: number) {
        if (this.running) {
            this.runningTime += dt;
            switch (this.state) {
                case State.OPEN:
                    this.state = State.DELAY;
                    this.node.stopAllActions();
                    this.node.opacity = 0;
                    cc.tween(this.node).to(0.1, { opacity: 255 }).start();
                    break;
                case State.DELAY:
                    if (this.runningTime >= 2) {
                        this.runningTime = 0;
                        this.state = State.CLOSE;
                        this.messageLabel.node.stopAllActions();
                    }
                    break;
                case State.CLOSE:
                    this.state = State.NONE;
                    this.running = false;
                    this.node.emit("remove", this);
                    break;
            }
        }
    }
    onEnable() {
        this.messageLabel.string = "";
        this.node.height = 0;
        this.running = true;
        this.runningTime = 0;
        this.state = State.OPEN;
    }
    setLevel(preLv: number, nextLv: number, message?: string) {
        this.preLvLabel.string = LanMgr.Instance.getLangByID("LevelUp") + " " + preLv;
        this.nextLvLabel.string = nextLv.toString();
        if (message) {
            this.messageLabel.string = message;
            this.messageLabel.node.active = true;
        }
        else {
            this.messageLabel.string = "";
            this.messageLabel.node.active = false;
        }
    }
}
