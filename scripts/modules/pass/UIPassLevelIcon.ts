import IconUI from "../common/IconUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class UIPassLevelIcon extends cc.Component {
    @property(cc.Label)
    countLabel = null;
    @property(IconUI)
    iconSprite = null;
    @property(cc.Node)
    lightNode = null;
    @property(cc.Node)
    lockNode = null;
    @property(cc.Node)
    receivedNode = null;
    @property(cc.Node)
    unactiveNode = null;
    setActive(e) {
        this.unactiveNode.active = !e;
    }
    setCount(e) {
        this.countLabel.string = e > 1 ? e.toString() : "";
    }
    setIcon(e) {
        this.iconSprite.icon = e;
    }
    setLight(e) {
        this.lightNode.active = !e;
    }
    setLocked(e) {
        if (this.lockNode) {
            this.lockNode.active = e;
        }
    }
    setReceived(e) {
        this.receivedNode.active = e;
    }
}
