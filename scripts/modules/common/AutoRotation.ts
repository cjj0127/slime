const { ccclass, property } = cc._decorator;
@ccclass
export default class AutoRotation extends cc.Component {
    update() {
        this.node.angle += 1;
    }
}
