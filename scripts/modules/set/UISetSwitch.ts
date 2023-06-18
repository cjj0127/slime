const { ccclass, property } = cc._decorator;
@ccclass
export default class UISetSwitch extends cc.Component {
    @property(cc.Node)
    off: cc.Node = null;
    @property(cc.Node)
    on: cc.Node = null;
    setState(e) {
    }
    setSwitch(e: boolean) {
        this.on.active = e;
        this.off.active = !e;
    }
}
