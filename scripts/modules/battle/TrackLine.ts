import TrackMove from "./TrackMove";
// import TrackMove from "TrackMove";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TrackLine extends TrackMove {
    public init() { }
    private moveDalte(e: number) {
        const t = this.delegate.targetPos.sub(this.node.position);
        this.node.angle = Math.atan2(t.y, t.x) * cc.macro.DEG;
        const n = t.normalize().mul(this.speed * e);
        return n.magSqr() > t.magSqr() ? t : n;
    }
    public onStep(e: number) {
        const t = this.moveDalte(e);
        this.node.position = this.node.position.add(t);
        if (this.chackRange(this.delegate.targetPos, this.node.position as any, 10)) {
            this.delegate.bomb();
            this.setRunning(false);
        }
    }
}
