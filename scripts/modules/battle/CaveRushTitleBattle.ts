import CaveRushBattle from "./CaveRushBattle";
import BossLevelTitleComp from "./BossLevelTitleComp";
import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import { E_GAME_LEVEL_TYPE } from "../common/Const";
import LevelModel from "../../ccstudio/data/LevelModel";
import Model from "../../ccstudio/data/Model";
const moment: any = window["moment"];
// import { BossLevelTitleComp } from "./BossLevelTitleComp";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CaveRushTitleBattle extends BossLevelTitleComp {
    @property(cc.Label)
    private cdTimeLabel: cc.Label = null;
    @property(cc.Label)
    private progressLabel: cc.Label = null;
    @property(cc.Label)
    private titleLabel: cc.Label = null;
    init() { }
    onBossHurt() { }
    onChangeWave() {
        this.refreshProgress();
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.refreshTitle();
        this.refreshProgress();
        cc.director.on(GlobalEventName.CaveRushLevelChangeWave, this.onChangeWave, this);
    }
    onLoad() { }
    refreshProgress() {
        const maxWave = CaveRushBattle.Instance.maxWave;
        const curWave = CaveRushBattle.Instance.curWave;
        this.progressLabel.string = curWave + 1 + "/" + maxWave;
    }
    refreshTitle() {
        const difficulty = Model.level.getCurDifficulty(E_GAME_LEVEL_TYPE.CaveRush);
        this.titleLabel.string = LanMgr.Instance.getLangByID("cave_Rush") + " " + difficulty;
    }
    timeUpdate() { }
    updateDuration() {
        this.cdTimeLabel.string = moment.utc(1000 * CaveRushBattle.Instance.battleDuration).format("mm:ss");
    }
}
