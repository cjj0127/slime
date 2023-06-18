import MoveBase from "./MoveBase";
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("Move/MoveGravity")
export default class MoveGravity extends MoveBase {
    private acc: cc.Vec2 = cc.Vec2.ZERO;
    @property(cc.Vec2)
    gravity = new cc.Vec2(0, -10);
    private originDir: number = 0;
    @property
    rotateByVelocity = false;
    applyForce(force: cc.Vec2) {
        this.acc.addSelf(force);
    }
    moveDalte(deltaTime: number) {
        this.applyForce(this.gravity);
        let velocity = this.velocity.add(this.acc);
        let deltaPos = velocity.mul(deltaTime * this.speed);
        this.acc.set(cc.Vec2.ZERO);
        return cc.v3(deltaPos.x, deltaPos.y, 0);
    }
    onEnable() { }
    onLoad() {
        this.originDir = this.node.scaleX;
    }
    onStep(deltaTime: number) {
        this.applyForce(this.gravity);
        let velocity = this.velocity.add(this.acc);
        let currentPos = this.node.position;
        let newPos = currentPos.add(cc.v3(velocity.x * deltaTime, velocity.y * deltaTime, 0));
        this.node.position = newPos;
        this.acc.set(cc.Vec2.ZERO);
        if (this.rotateByVelocity) {
            this.node.angle = -velocity.signAngle(cc.Vec2.RIGHT) * cc.macro.DEG;
        }
    }
}
