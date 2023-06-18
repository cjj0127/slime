import BossRushBattle from "./BossRushBattle";
import BossLevelTitleComp from "./BossLevelTitleComp";
import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import { E_GAME_LEVEL_TYPE } from "../common/Const";
import LevelModel from "../../ccstudio/data/LevelModel";
import Model from "../../ccstudio/data/Model";
// import { BossLevelTitleComp } from "BossLevelTitleComp";
const { ccclass, property } = cc._decorator;
const moment: any = window['moment'];
@ccclass
export default class BossRushTitleBattle extends BossLevelTitleComp {
    @property(cc.Label)
    cdTimeLabel: cc.Label = null;
    @property(cc.Label)
    progressLabel: cc.Label = null;
    @property(cc.Label)
    titleLabel: cc.Label = null;
    onChangeWave() {
        this.refreshProgress();
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.refreshTitle();
        this.refreshProgress();
        cc.director.on(GlobalEventName.BossRushLevelChangeWave, this.onChangeWave, this);
    }
    refreshBossBattleTime() {
        this.cdTimeLabel.string = moment.utc(1000 * BossRushBattle.Instance.battleDuration).format("mm:ss");
    }
    refreshProgress() {
        const maxWave = BossRushBattle.Instance.maxWave;
        const currWave = BossRushBattle.Instance.currWave;
        this.progressLabel.string = `${currWave + 1}/${maxWave}`;
    }
    refreshTitle() {
        const difficulty = Model.level.getCurDifficulty(E_GAME_LEVEL_TYPE.BossRush);
        this.titleLabel.string = `${LanMgr.Instance.getLangByID("BOSS RUSH")} ${difficulty}`;
    }
    updateDuration() {
        this.refreshBossBattleTime();
    }
}
