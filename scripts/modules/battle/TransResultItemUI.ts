import ItemUIBase from "../common/ItemUIBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TransResultItemUI extends ItemUIBase {
    @property(cc.Label)
    countLabel: cc.Label = null;
    @property(cc.Node)
    maxNode: cc.Node = null;
    playAnim(): void {
        this.node.stopAllActions();
        this.node.scale = 1.2;
        cc.tween(this.node).to(0.2, { scale: 1 }).start();
    }
    setCount(e: number): void {
        this.maxNode.active = false;
        this.countLabel.string = `${e}`;
    }
    setMax(): void {
        this.maxNode.active = true;
        this.countLabel.string = "Max";
    }
}
