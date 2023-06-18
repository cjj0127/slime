const { ccclass, property } = cc._decorator;
@ccclass
export default class BossLevelTitleComp extends cc.Component {
    close() {
        this.node.active = false;
    }
    open() {
        this.node.active = true;
    }
}
