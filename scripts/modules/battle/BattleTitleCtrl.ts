import BossRushTitleBattle from "./BossRushTitleBattle";
import CaveRushTitleBattle from "./CaveRushTitleBattle";
import DwarvenKingTitleBattle from "./DwarvenKingTitleBattle";
import GoldRushTitleBattle from "./GoldRushTitleBattle";
import NormallTitleBattle from "./NormallTitleBattle";
import BattleWorld from "./BattleWorld";
import { GlobalEventName } from "../common/Events";
import { E_GAME_LEVEL_TYPE } from "../common/Const";
// import NormallTitleBattle from 'NormallTitleBattle';
const { ccclass, property } = cc._decorator;
@ccclass
export default class BattleTitleCtrl extends cc.Component {
    @property(BossRushTitleBattle)
    bossRushTile = null;
    @property(CaveRushTitleBattle)
    caveRushTitle = null;
    currBossLevelTitle = null;
    currMode = E_GAME_LEVEL_TYPE.Normal;
    @property(DwarvenKingTitleBattle)
    dwarvenKingTitle = null;
    gameModeTitles = {};
    @property(GoldRushTitleBattle)
    goldRushTile = null;
    @property(NormallTitleBattle)
    normalTitle = null;
    changeMode(e) {
        this.currMode = e;
        this.currBossLevelTitle = this.gameModeTitles[e];
    }
    lateUpdate(e) {
        if (this.currBossLevelTitle) {
            this.currBossLevelTitle.updateDuration(e);
        }
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.normalTitle.open();
        this.bossRushTile.close();
        this.goldRushTile.close();
        this.dwarvenKingTitle.close();
        this.caveRushTitle.close();
        this.currBossLevelTitle = this.normalTitle;
        cc.director.on(GlobalEventName.SwitchGameMode, this.onSwitchGameMode, this);
    }
    onLoad() {
        this.gameModeTitles = {
            [E_GAME_LEVEL_TYPE.Normal]: this.normalTitle,
            [E_GAME_LEVEL_TYPE.BossRush]: this.bossRushTile,
            [E_GAME_LEVEL_TYPE.GoldRush]: this.goldRushTile,
            [E_GAME_LEVEL_TYPE.DwarvenKing]: this.dwarvenKingTitle,
            [E_GAME_LEVEL_TYPE.CaveRush]: this.caveRushTitle,
        };
    }
    onSwitchGameMode() {
        const n = BattleWorld.Instance.currGameModeType;
        if (this.currMode != n) {
            if (this.currBossLevelTitle) {
                this.currBossLevelTitle.close();
            }
            this.changeMode(n);
            if (this.currBossLevelTitle) {
                this.currBossLevelTitle.open();
            }
        }
    }
}
