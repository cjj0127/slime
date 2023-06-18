const { ccclass, property } = cc._decorator;
@ccclass
export default class GlobalNotifyView extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;
    play(e: string) {
        this.label.string = e;
        //@ts-ignore
        this.label._forceUpdateRenderData();
        const n = 0.5 * cc.view.getVisibleSize().width + 0.5 * this.label.node.width + 100;
        this.label.node.x = n;
        this.label.node.stopAllActions();
        cc.tween(this.label.node).to(16, {
            x: -n
        })
            .call(() => {
            this.node.emit("remove", this);
        }).start();
    }
}
