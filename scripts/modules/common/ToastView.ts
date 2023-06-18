const { ccclass, property } = cc._decorator;
export enum TipState {
    NONE,
    OPEN,
    DELAY,
    CLOSE
}
@ccclass()
export default class ToastView extends cc.Component {
    message: string = "";
    @property(cc.RichText)
    messageLabel: cc.RichText = null;
    originSize: cc.Size;
    running: boolean = false;
    runningTime: number = 0;
    state: TipState = TipState.NONE;
    error(e: string) {
        this.message = e;
        this.messageLabel.node.color = cc.Color.RED;
    }
    lateUpdate(e: number) {
        if (this.running) {
            switch (this.runningTime += e, this.state) {
                case TipState.OPEN:
                    this.runningTime >= 0.1 ? (this.runningTime = 0,
                        this.node.height = this.originSize.height,
                        this.state = TipState.DELAY,
                        this.messageLabel.string = this.message,
                        this.messageLabel.node.stopAllActions(),
                        this.messageLabel.node.opacity = 0,
                        cc.tween(this.messageLabel.node).to(0.1, { opacity: 255 }).start()) : this.node.height = cc.misc.lerp(0, this.originSize.height, this.runningTime / 0.1);
                    break;
                case TipState.DELAY:
                    this.runningTime >= 2.5 && (this.runningTime = 0,
                        this.state = TipState.CLOSE,
                        this.messageLabel.node.stopAllActions(),
                        cc.tween(this.messageLabel.node).to(0.1, { opacity: 0 }).start());
                    break;
                case TipState.CLOSE:
                    this.node.height = cc.misc.lerp(this.originSize.height, 0, this.runningTime / 0.12);
                    this.runningTime >= 0.12 && (this.runningTime = 0,
                        this.state = TipState.NONE,
                        this.running = false,
                        this.node.emit("remove", this));
            }
        }
    }
    onEnable() {
        this.messageLabel.string = "";
        this.node.height = 0;
        this.running = true;
        this.runningTime = 0;
        this.state = TipState.OPEN;
    }
    onLoad() {
        this.originSize = this.node.getContentSize();
    }
    tip(e: string) {
        this.message = e;
        this.messageLabel.node.color = cc.Color.GREEN;
    }
    warn(e: string) {
        this.message = e;
        this.messageLabel.node.color = cc.Color.ORANGE;
    }
}
