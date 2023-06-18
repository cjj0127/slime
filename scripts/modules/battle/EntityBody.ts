const { ccclass, property } = cc._decorator;
@ccclass
export default class ScriptName extends cc.Component {
    getWorldPosition() {
        return this.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
    }
}
