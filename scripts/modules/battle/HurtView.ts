import AsyncQueueTool from "../../ccstudio/utils/AsyncQueueTool";
import BattleWorld from "./BattleWorld";
import Game from "../Game";
// import BattleWorld from "BattleWorld";
const { ccclass, property } = cc._decorator;
@ccclass
export default class HurtView extends cc.Component {
    private _logicQueue: AsyncQueueTool = new AsyncQueueTool();
    private completeCallback: Function;
    @property(sp.Skeleton)
    sp: sp.Skeleton = null;
    private spTrack: any = null;
    clear() {
        this._logicQueue.clear();
        this._logicQueue.complete = null;
        this.sp.setCompleteListener(null);
    }
    private complete() {
        this.spTrack = null,
            this.completeCallback && this.completeCallback();
    }
    getAnimationDuration(e: string) {
        return this.sp.findAnimation(e).duration;
    }
    getOwner() {
        return BattleWorld.Instance.hero;
    }
    play(e: string, t: Function) {
        this.completeCallback = t;
        this._logicQueue.clear();
        this._logicQueue.push((t: Function) => { this.playHurt(e, t); });
        this._logicQueue.complete = this.complete;
        this._logicQueue.play();
    }
    playHurt(e: string, t: Function) {
        this.sp.setCompleteListener(t);
        this.sp.timeScale = Game.Instance.globalSpeed;
        this.spTrack = this.sp.setAnimation(0, e, false);
    }
    resetPlay(e: string) {
        this.spTrack ? this.spTrack.trackTime = 0 : this.spTrack = this.sp.setAnimation(0, e, false);
    }
    stop() {
        this._logicQueue.step();
    }
}
