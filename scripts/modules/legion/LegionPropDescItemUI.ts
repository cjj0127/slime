const { ccclass, property } = cc._decorator;
@ccclass
export default class LegionPropDescItemUI extends cc.Component {
    @property(cc.Sprite)
    bg: cc.Sprite = null;
    @property(cc.Label)
    desc: cc.Label = null;
    init(e: boolean, t: string) {
        this.setText(t);
        this.showBg(e);
        this.desc.node.color = e ? cc.color().fromHEX("#FFCA59") : cc.color().fromHEX("#FFFFFF");
        this.showBgBlink();
    }
    setColor(e: string) {
        this.desc.node.color = cc.color().fromHEX(e);
    }
    setText(e: string) {
        this.desc.string = e;
    }
    showBg(e: boolean) {
        this.bg.node.active = e;
    }
    showBgBlink() {
        if (this.bg.node.active) {
            this.bg.node.stopAllActions();
            cc.tween(this.bg.node).to(.5, { opacity: 255 }).to(.5, { opacity: 0 }).union().repeatForever().start();
        }
    }
}
