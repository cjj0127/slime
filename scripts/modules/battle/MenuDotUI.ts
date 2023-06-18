const { ccclass, property } = cc._decorator;
@ccclass
export default class MenuDotUI extends cc.Component {
    @property(cc.Node)
    redDotNode: cc.Node = null;
    calcDotActive(): boolean {
        // to be implemented
        return false;
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.refreshDot();
        this.registerDotEvents();
    }
    refreshDot() {
        this.redDotNode.active = this.calcDotActive();
    }
    registerDotEvents() {
        // to be implemented
    }
}
