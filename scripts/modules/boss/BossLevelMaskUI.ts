import { EOpenUIType } from "../common/ViedioType";
import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import { E_GAME_LEVEL_TYPE, E_MenuToggleType } from "../common/Const";
import BattleWorld from "../battle/BattleWorld";
import Model from "../../ccstudio/data/Model";
const { ccclass, property } = cc._decorator;
const LEVEL_DESCRIPTION = {
    [E_GAME_LEVEL_TYPE.BossRush]: "boss_rush_desc",
    [E_GAME_LEVEL_TYPE.GoldRush]: "gold_rush_desc",
    [E_GAME_LEVEL_TYPE.DwarvenKing]: "snow_monster_desc",
    [E_GAME_LEVEL_TYPE.CaveRush]: "cave_Rush_desc",
    [E_GAME_LEVEL_TYPE.LegionRush]: "legion_Rush_desc"
};
@ccclass
export default class BossLevelMaskUI extends cc.Component {
    @property(cc.Button)
    btnRunAway = null;
    @property(cc.Label)
    descLabel = null;
    onClickRunAway() {
        if (BattleWorld.Instance.exitBossLevelEnable()) {
            BattleWorld.Instance.exitBossLevel();
        }
    }
    onDisable() {
        cc.director.targetOff(this);
        Model.ad.hideBanner();
    }
    onEnable() {
        const gameModeType = BattleWorld.Instance.currGameModeType;
        const levelDescription = LEVEL_DESCRIPTION[gameModeType];
        this.descLabel.string = LanMgr.Instance.getLangByID(levelDescription);
        cc.director.on(GlobalEventName.SwitchGameMode, this.onSwitchGameMode, this);
        Model.ad.showBanner(EOpenUIType.Rush);
    }
    onLoad() {
        this.btnRunAway.node.on("click", this.onClickRunAway, this);
    }
    onSwitchGameMode() {
        if (BattleWorld.Instance.currGameModeType == E_GAME_LEVEL_TYPE.Normal) {
            this.node.emit("remove", this);
            cc.director.emit(GlobalEventName.ShowPageView, E_MenuToggleType.Battle);
        }
    }
}
