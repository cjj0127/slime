import BattleWorld from "./BattleWorld";
import { E_GAME_LEVEL_TYPE } from "../common/Const";
import BossLevelItemUI from "../boss/BossLevelItemUI";
// import BossLevelItemUI from "./BossLevelItemUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class GoldRushLevelItemUI extends BossLevelItemUI {
    calcRewardCount() {
        return BattleWorld.Instance.getBattleCtrl(E_GAME_LEVEL_TYPE.GoldRush).getReward();
    }
}
