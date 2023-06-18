import { E_GAME_LEVEL_TYPE, MapUIPrefabs } from "../common/Const";
import BattleWorld from "../battle/BattleWorld";
import LanMgr from "../common/Language";
import LevelModel from "../../ccstudio/data/LevelModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import BossLevelItemUI from "../boss/BossLevelItemUI";
// exports.default = BossLevelSelect;
const { ccclass, property } = cc._decorator;
@ccclass
export default class LegionRushLevelItemUI extends BossLevelItemUI {
    calcRewardCount(): number {
        return BattleWorld.Instance.getBattleCtrl(E_GAME_LEVEL_TYPE.LegionRush).getReward();
    }
    async onClicKEnterHandler(): Promise<void> {
        if (await Model.level.enterBossLevel(E_GAME_LEVEL_TYPE.LegionRush)) {
            BattleWorld.Instance.pause();
            Model.ui.openViewAsync(MapUIPrefabs.LegionAddHeroView);
        }
    }
    refreshReward(): void {
        this.scheduleOnce(() => {
            this.setReward(this.difficultyLabel.string);
        }, 0.1);
    }
    setReward(str): void {
        this.rewardLabel.string = LanMgr.Instance.getLangByID("Level") + Model.level.getCurDifficulty(this.levelType);
    }
}
