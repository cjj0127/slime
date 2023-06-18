import AiBase from "./AiBase";
// n.default = l
const { ccclass, property } = cc._decorator;
@ccclass
export default class Ai extends AiBase {
    onEnterAttack() { }
    onEnterIdle() {
        this.node.zIndex = -1000;
    }
    onEnterMove() { }
    onEnterNone() { }
    onExitAttack() { }
    onExitIdle() { }
    onExitMove() { }
    onUpdateAttack() { }
    onUpdateIdle() { }
    onUpdateMove() { }
}
