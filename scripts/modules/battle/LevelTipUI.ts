import NormalBattle from "./NormalBattle";
import LanMgr from "../common/Language";
import { LEVEL_DIFFICULTY_NAME, LEVEL_DIFFICULTY_COLOR, LEVEL_NAME_NUM } from "../common/Const";
const _: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class LevelTipUI extends cc.Component {
    @property(cc.Label)
    levelIdLabel: cc.Label = null;
    @property(cc.Label)
    levelNameLabel: cc.Label = null;
    onEnable() {
        this.refreshLevelName();
        this.playAnim();
    }
    playAnim() {
        this.node.stopAllActions();
        this.node.x = 400;
        this.node.y = 380;
        cc.tween(this.node).to(0.25, { x: 40 }, { easing: cc.easing.sineOut })
            .to(0.8, { x: -40 })
            .to(0.25, { x: -400 }, { easing: cc.easing.sineIn })
            .call(() => {
            this.node.emit("remove", this);
        })
            .start();
    }
    refreshLevelName() {
        const levelCfg = NormalBattle.Instance.getCurrLevelCfg();
        const difficulty = levelCfg.difficulty;
        const level = levelCfg.level;
        let difficultyName = "";
        let difficultyColor = null;
        if (difficulty <= LEVEL_DIFFICULTY_NAME.length) {
            difficultyName = LEVEL_DIFFICULTY_NAME[difficulty - 1];
            difficultyColor = LEVEL_DIFFICULTY_COLOR[difficulty - 1];
        }
        else {
            difficultyName = _.last(LEVEL_DIFFICULTY_NAME);
            difficultyColor = _.last(LEVEL_DIFFICULTY_COLOR);
        }
        let langId = LanMgr.Instance.getLangByID(difficultyName);
        if (difficulty >= LEVEL_DIFFICULTY_NAME.length) {
            langId += LEVEL_NAME_NUM[difficulty - LEVEL_DIFFICULTY_NAME.length];
        }
        this.levelNameLabel.node.color = difficultyColor;
        this.levelNameLabel.string = `${langId}`;
        this.levelIdLabel.string = `${level}`;
    }
}
