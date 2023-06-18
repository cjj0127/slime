import TrackMove from "./TrackMove";
// import TrackMove from "TrackMove";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TrackDrop extends TrackMove {
    init() {
        this.node.position = cc.v3(this.delegate.targetPos.x, this.delegate.targetPos.y + 550, 0);
    }
    moveDalte(e) {
        let t = this.delegate.targetPos.sub(this.node.position);
        this.node.angle = Math.atan2(t.y, t.x) * cc.macro.DEG;
        return t.normalize().mul(this.speed * e);
    }
    onStep(e) {
        let t = this.moveDalte(e);
        this.node.position = this.node.position.add(t);
        if (this.chackRange(this.delegate.targetPos, this.node.position, 10)) {
            this.delegate.bomb();
            this.setRunning(false);
        }
    }
}
