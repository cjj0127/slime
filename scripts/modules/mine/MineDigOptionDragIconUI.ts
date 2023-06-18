import Draggable from "../common/Draggable";
const { ccclass, property } = cc._decorator;
@ccclass
export default class MineDigOptionDragIconUI extends Draggable {
    deletage = null;
    onDestroy() {
        super.onDestroy();
        this.deletage = null;
    }
    onDragEnd() {
        const worldPos = this.node.convertToWorldSpaceAR(cc.v3(0, 0, 0));
        if (this.deletage)
            this.deletage.onDragEnd(worldPos);
        this.node.stopAllActions();
        cc.tween(this.node).to(0.1, { scale: 1 }).start();
    }
    onDragMove() {
        const worldPos = this.node.convertToWorldSpaceAR(cc.v3(0, 0, 0));
        if (this.deletage)
            this.deletage.onDragMove(worldPos);
    }
    onDragStart() {
        const worldPos = this.node.convertToWorldSpaceAR(cc.v3(0, 0, 0));
        if (this.deletage)
            this.deletage.onDragStart(worldPos);
        this.node.stopAllActions();
        cc.tween(this.node).to(0.1, { scale: 1.2 }).start();
    }
}
