import { GlobalEventName } from "../common/Events";
import { E_GAME_LEVEL_TYPE, IMAGE_ICON_PATH_, GameConst, PrefabBossLevelItemHelperUI } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import AssetManager from "../asset/AssetManager";
import _CaveRushConfig from "../../ccstudio/config/_CaveRushConfig";
import LanLabel from "../common/LanLabel";
import LevelModel from "../../ccstudio/data/LevelModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import BossLevelHelperUI from "../boss/BossLevelHelperUI";
import UserData from "../user/UserData";
// import * as _CaveRushConfig from "_CaveRushConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CaveRushtemUI extends cc.Component {
    @property(cc.Label)
    adCount = null;
    @property(cc.Node)
    adInfo = null;
    @property(cc.Button)
    btnAdd = null;
    @property(cc.Button)
    btnEnter = null;
    @property(cc.Button)
    btnHelper = null;
    @property(cc.Button)
    btnSub = null;
    @property(cc.Label)
    difficultyLabel = null;
    @property(cc.Label)
    keyCount = null;
    @property(cc.Sprite)
    keyIcon = null;
    @property(cc.Node)
    keyInfo = null;
    @property({ type: cc.Enum(E_GAME_LEVEL_TYPE) })
    levelType = E_GAME_LEVEL_TYPE.BossRush;
    @property(cc.Label)
    rewardLabel = null;
    calcRewardCount() {
        const curDifficulty = Model.level.getCurDifficulty(this.levelType);
        return _CaveRushConfig.Instance.get(curDifficulty).reward;
    }
    onClicKAddHandler() {
        let curDifficulty = Model.level.getCurDifficulty(this.levelType);
        let maxDifficulty = Model.level.getMaxDifficulty(this.levelType);
        if (curDifficulty < maxDifficulty) {
            ++curDifficulty;
            Model.level.setCurDifficulty(this.levelType, curDifficulty);
            this.btnSub.node.active = true;
            if (curDifficulty == maxDifficulty) {
                this.btnAdd.node.active = false;
            }
            this.setDifficulty(curDifficulty);
            this.refreshReward();
        }
    }
    onClicKEnterHandler() {
        Model.level.enterBossLevel(this.levelType);
    }
    onClicKSubHandler() {
        let curDifficulty = Model.level.getCurDifficulty(this.levelType);
        if (curDifficulty > 1) {
            --curDifficulty;
            Model.level.setCurDifficulty(this.levelType, curDifficulty);
            if (curDifficulty == 1) {
                this.btnSub.node.active = false;
            }
            this.btnAdd.node.active = true;
            this.setDifficulty(curDifficulty);
            this.refreshReward();
        }
    }
    onClickHelperHandler() {
        Model.ui.openViewAsync(PrefabBossLevelItemHelperUI, {
            data: this.levelType,
            viewComp: BossLevelHelperUI
        });
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.refreshReward();
        this.refresh();
        this.refreshKeyCount();
        this.refreshKeyIcon();
        cc.director.on(GlobalEventName.BossLevelUnlockDifficulty, this.onLevelUnlockDifficulty, this);
        cc.director.on(GlobalEventName.AssetItemChange + Model.level.getBossLevelKey(this.levelType), this.onKeyItemCountChange, this);
    }
    onKeyItemCountChange() {
        this.refreshKeyCount();
    }
    onLevelUnlockDifficulty(e) {
        if (this.levelType == e) {
            this.refresh();
            this.refreshReward();
        }
    }
    onLoad() {
        this.btnAdd.node.on("click", this.onClicKAddHandler, this);
        this.btnSub.node.on("click", this.onClicKSubHandler, this);
        this.btnEnter.node.on("click", this.onClicKEnterHandler, this);
        this.btnHelper.node.on("click", this.onClickHelperHandler, this);
    }
    refresh() {
        const curDifficulty = Model.level.getCurDifficulty(this.levelType);
        const maxDifficulty = Model.level.getMaxDifficulty(this.levelType);
        this.btnAdd.node.active = curDifficulty < maxDifficulty;
        this.btnSub.node.active = curDifficulty > 1;
        this.setDifficulty(curDifficulty);
    }
    refreshKeyCount() {
        const gameTicket = Model.level.getGameTicket(this.levelType);
        const t = parseInt(UserData.Instance.getItem(gameTicket));
        this.adInfo.active = t <= 0;
        this.keyInfo.active = t > 0;
        this.setKeyCount(t);
        const adCount = Model.level.getAdCount(this.levelType);
        this.setAdCount(adCount);
    }
    refreshKeyIcon() {
        const gameTicket = Model.level.getGameTicket(this.levelType);
        const ticketTemplate = _AssetConfig.Instance.get(gameTicket);
        const iconPath = `${IMAGE_ICON_PATH_}/${ticketTemplate.icon}`;
        this.keyIcon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, iconPath);
        this.keyIcon.node.scale = 30 / this.keyIcon.node.width;
    }
    refreshReward() {
        const rewardCount = this.calcRewardCount();
        this.setReward(rewardCount);
    }
    setAdCount(adCount) {
        const replenishedCount = this.levelType == E_GAME_LEVEL_TYPE.LegionRush ? GameConst.LEGION_AD_REPLENISHED_COUNT : GameConst.BOSS_AD_REPLENISHED_COUNT;
        this.adCount.string = `(${replenishedCount - adCount}/${replenishedCount})`;
    }
    setDifficulty(e) {
        this.difficultyLabel.getComponent(LanLabel).setVars("difficulty", "" + e);
    }
    setKeyCount(keyCount) {
        this.keyCount.string = "" + keyCount;
    }
    setReward(rewardCount) {
        this.rewardLabel.string = NumberPlus.format(rewardCount);
    }
}
