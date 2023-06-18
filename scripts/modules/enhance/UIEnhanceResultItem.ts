import ItemUIBase from "../common/ItemUIBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class UIEnhanceResultItem extends ItemUIBase {
    @property(cc.Node)
    arrow: cc.Node = null;
    @property(cc.Label)
    currLabel: cc.Label = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    prevLabel: cc.Label = null;
    private prevOriginX: number = 0;
    onEnable() {
        this.prevLabel.node.x = 0;
        this.currLabel.node.opacity = 0;
        this.arrow.opacity = 0;
    }
    onLoad() {
        this.prevOriginX = this.prevLabel.node.x;
    }
    playAnim() {
        this.prevLabel.node.x = 0;
        this.prevLabel.node.stopAllActions();
        cc.tween(this.prevLabel.node)
            .delay(0.1)
            .to(0.1, { x: this.prevOriginX })
            .call(() => {
            this.currLabel.node.opacity = 255;
            this.arrow.opacity = 255;
            this.currLabel.node.scale = 1.2;
            this.currLabel.node.stopAllActions();
            cc.tween(this.currLabel.node)
                .to(0.1, { scale: 1 })
                .start();
        })
            .start();
    }
    setEnhanceInfo(prev: number, curr: number) {
        this.prevLabel.string = `${prev}`;
        this.currLabel.string = `${curr}`;
    }
    setNameStr(e) { }
}
