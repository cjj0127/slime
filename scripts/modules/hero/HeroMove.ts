import MoveBase from "../battle/MoveBase";
// import { MoveBase } from './MoveBase';
const { ccclass, property } = cc._decorator;
@ccclass
export default class HeroMove extends MoveBase {
    @property
    moveMul: number = 1;
    getMoveMul() {
        return this.moveMul;
    }
    moveDelta(e: number): cc.Vec2 {
        return this.velocity.mul(e * this.speed * this.moveMul);
    }
    onStep(e: number): void {
        const t = this.moveDelta(e);
        this.node.setPosition(this.node.getPosition().add(t));
    }
    setMoveMul(e: number) {
        this.moveMul = e;
    }
}
