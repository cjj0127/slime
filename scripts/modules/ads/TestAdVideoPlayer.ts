const { ccclass, property } = cc._decorator;
@ccclass
export default class TestAdVideoPlayer extends cc.Component {
    @property(cc.Button)
    btnClose: cc.Button = null;
    callback = null;
    elapsed = 0;
    @property(cc.Label)
    label: cc.Label = null;
    close() {
        this.node.removeFromParent();
    }
    onBtnClose() {
        this.close();
        if (this.callback)
            this.callback(true);
    }
    onLoad() {
        this.btnClose.interactable = false;
    }
    setCallback(callback: any) {
        this.callback = callback;
    }
    update(deltaTime: number) {
        this.elapsed += 5 * deltaTime;
        const time = Math.floor(15 - this.elapsed);
        if (time >= 0) {
            const timerString = String(time);
            if (timerString != this.label.string)
                this.label.string = timerString;
        }
        else if (!this.btnClose.interactable) {
            this.btnClose.interactable = true;
        }
    }
}
