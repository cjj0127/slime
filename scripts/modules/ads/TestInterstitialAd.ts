const { ccclass, property } = cc._decorator;
@ccclass
export default class TestInterstitialAd extends cc.Component {
    @property
    closeCallback: Function = null;
    close() {
        this.node.removeFromParent();
    }
    onBtnClose() {
        this.close();
        if (this.closeCallback) {
            this.closeCallback(true);
        }
    }
    onLoad() {
    }
    setCallback(callback: Function) {
        this.closeCallback = callback;
    }
    start() {
    }
}
