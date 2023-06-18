import TrackMove from "./TrackMove";
import Utils_ from "../../ccstudio/utils/Utils";
// import TrackMove from "TrackMove";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TrackJump extends TrackMove {
    controlPos: cc.Vec2 = null;
    @property
    duration: number = 0;
    jumpHeight: number = 80;
    runningTime: number = 0;
    startPos: cc.Vec2 = null;
    init() {
        this.startPos = this.node.position as any;
        let distance = this.delegate.targetPos.sub(this.startPos).mag();
        let jumpHeight = this.jumpHeight + Utils_.randomNumber(this.jumpHeight);
        if (distance < 260) {
            jumpHeight = jumpHeight * distance / 260;
        }
        this.controlPos = this.startPos.lerp(this.delegate.targetPos, 0.5);
        this.controlPos.y += jumpHeight;
        let time = distance / this.speed;
        this.duration = time;
        this.runningTime = 0;
        this.setRunning(true);
    }
    onStep(dt: number) {
        this.runningTime += dt;
        if (this.runningTime >= this.duration) {
            this.node.position = this.delegate.targetPos;
            this.delegate.bomb();
            this.setRunning(false);
        }
        else {
            let ratio = cc.misc.clampf(this.runningTime / this.duration, 0, 1);
            let start = this.startPos.lerp(this.controlPos, ratio);
            let end = this.controlPos.lerp(this.delegate.targetPos, ratio);
            let oldPos: any = this.node.position;
            let newPos = start.lerp(end, ratio);
            this.node.position = newPos as any;
            let delta = newPos.sub(oldPos);
            this.node.angle = Math.atan2(delta.y, delta.x) * cc.macro.DEG;
        }
    }
}
