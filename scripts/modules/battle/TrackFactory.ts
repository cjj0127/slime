import BattleWorld from "./BattleWorld";
import TrackMove from "./TrackMove";
import TrackDrop from "./TrackDrop";
import TrackFlyCoins from "./TrackFlyCoins";
import TrackJump from "./TrackJump";
import TrackLine from "./TrackLine";
import { E_BULLET_TRACK } from "../common/Const";
const { ccclass, property } = cc._decorator;
@ccclass
class TrackFactory {
    private static instance: TrackFactory;
    public create(node: cc.Node, trackType: number): TrackMove | null {
        let track = node.getComponent<TrackMove>(TrackMove);
        if (track)
            return track;
        switch (trackType) {
            case E_BULLET_TRACK.Line:
                return node.addComponent(TrackLine);
            case E_BULLET_TRACK.Jump:
                return node.addComponent(TrackJump);
            case E_BULLET_TRACK.Drop:
                return node.addComponent(TrackDrop);
            case E_BULLET_TRACK.Fly:
                let flyTrack = node.addComponent(TrackFlyCoins);
                flyTrack.owner = BattleWorld.Instance.hero;
                return flyTrack;
        }
        return null;
    }
    public static get Instance(): TrackFactory {
        if (!this.instance) {
            this.instance = new TrackFactory();
        }
        return this.instance;
    }
}
export default TrackFactory;
