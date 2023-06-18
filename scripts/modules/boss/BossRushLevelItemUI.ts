import BossLevelItemUI from "./BossLevelItemUI";
import { E_GAME_LEVEL_TYPE } from "../common/Const";
import BattleWorld from "../battle/BattleWorld";
// import BossLevelItemUI from "BossLevelItemUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class BossRushLevelItemUI extends BossLevelItemUI {
    calcRewardCount() {
        return BattleWorld.Instance.getBattleCtrl(E_GAME_LEVEL_TYPE.BossRush).calcRewardCount().toString();
    }
}
