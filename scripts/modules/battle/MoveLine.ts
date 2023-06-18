import MoveBase from "./MoveBase";
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("Move/MoveLine")
export default class MoveLine extends MoveBase {
    private moveDelta(dt: number): cc.Vec2 {
        return this.velocity.mul(dt * this.speed);
    }
    public onStep(dt: number): void {
        const delta = this.moveDelta(dt);
        this.node.setPosition(this.node.getPosition().add(delta));
    }
}
