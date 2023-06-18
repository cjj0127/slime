import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import { E_GAME_LEVEL_TYPE } from "../common/Const";
import AddCoinLabel from "../common/AddCoinLabel";
import GoldRushBattle from "./GoldRushBattle";
import BossLevelTitleComp from "./BossLevelTitleComp";
import LevelModel from "../../ccstudio/data/LevelModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
const { ccclass, property } = cc._decorator;
const moment: any = window["moment"];
@ccclass
export default class GoldRushTitleBattle extends BossLevelTitleComp {
    @property(cc.Label)
    cdTimeLabel: cc.Label = null;
    @property(cc.Label)
    difficultyLabel: cc.Label = null;
    @property(AddCoinLabel)
    goldCountLabel: AddCoinLabel = null;
    maxGold: number = 0;
    formatGoldValue(value: number) {
        const maxGoldValue = NumberPlus.mul(this.maxGold, 100 * value);
        const goldValue = NumberPlus.div(maxGoldValue, 100);
        return NumberPlus.format(goldValue);
    }
    onBossHurt() {
        this.refreshProgress();
    }
    onDisable() {
        this.goldCountLabel.stop();
        cc.director.targetOff(this);
    }
    onEnable() {
        this.maxGold = GoldRushBattle.Instance.getReward();
        this.goldCountLabel.setValue(0);
        this.refreshTitle();
        cc.director.on(GlobalEventName.GoldRushBossHurt, this.onBossHurt, this);
    }
    onLoad() {
        this.goldCountLabel.setFormatFunc(this.formatGoldValue.bind(this));
    }
    refreshBossBattleTime() {
        this.cdTimeLabel.string = moment.utc(1000 * GoldRushBattle.Instance.battleDuration).format("mm:ss");
    }
    refreshProgress() {
        const progress = GoldRushBattle.Instance.getGoldProgress();
        this.goldCountLabel.playTo(progress, 0.5);
    }
    refreshTitle() {
        const levelType = E_GAME_LEVEL_TYPE.GoldRush;
        const difficulty = Model.level.getCurDifficulty(levelType);
        this.difficultyLabel.string = LanMgr.Instance.getLangByID("GOLD RUSH") + " " + difficulty;
    }
    updateDuration() {
        this.refreshBossBattleTime();
    }
}
