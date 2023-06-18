import { GlobalEventName } from "../common/Events";
import { E_GAME_LEVEL_TYPE, IMAGE_ICON_PATH_, GameConst, PrefabBossLevelItemHelperUI } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import AssetManager from "../asset/AssetManager";
import LanLabel from "../common/LanLabel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import BossLevelHelperUI from "./BossLevelHelperUI";
import UserData from "../user/UserData";
const { ccclass, property } = cc._decorator;
@ccclass
export default class BossLevelItemUI extends cc.Component {
    @property(cc.Label)
    adCount: cc.Label = null;
    @property(cc.Node)
    adInfo: cc.Node = null;
    @property(cc.Button)
    btnAdd: cc.Button = null;
    @property(cc.Button)
    btnEnter: cc.Button = null;
    @property(cc.Button)
    btnHelper: cc.Button = null;
    @property(cc.Button)
    btnSub: cc.Button = null;
    @property(cc.Label)
    difficultyLabel: cc.Label = null;
    @property(cc.Label)
    keyCount: cc.Label = null;
    @property(cc.Sprite)
    keyIcon: cc.Sprite = null;
    @property(cc.Node)
    keyInfo: cc.Node = null;
    @property({
        type: cc.Enum(E_GAME_LEVEL_TYPE)
    })
    levelType = E_GAME_LEVEL_TYPE.BossRush;
    @property(cc.Label)
    rewardLabel: cc.Label = null;
    calcRewardCount() {
        return 0;
    }
    onClicKAddHandler() {
        let e = Model.level.getCurDifficulty(this.levelType);
        const t = Model.level.getMaxDifficulty(this.levelType);
        if (e < t) {
            e++;
            Model.level.setCurDifficulty(this.levelType, e);
            this.btnSub.node.active = true;
            if (e == t) {
                this.btnAdd.node.active = false;
            }
            this.setDifficulty(e);
            this.refreshReward();
        }
    }
    onClicKEnterHandler() {
        Model.level.enterBossLevel(this.levelType);
    }
    onClicKSubHandler() {
        let e = Model.level.getCurDifficulty(this.levelType);
        if (e > 1) {
            Model.level.setCurDifficulty(this.levelType, --e);
            if (e == 1) {
                this.btnSub.node.active = false;
            }
            this.btnAdd.node.active = true;
            this.setDifficulty(e);
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
        const e = Model.level.getCurDifficulty(this.levelType);
        const t = Model.level.getMaxDifficulty(this.levelType);
        this.btnAdd.node.active = e < t;
        this.btnSub.node.active = e > 1;
        this.setDifficulty(e);
    }
    refreshKeyCount() {
        const e = Model.level.getGameTicket(this.levelType);
        const t = parseInt(UserData.Instance.getItem(e));
        this.adInfo.active = t <= 0;
        this.keyInfo.active = t > 0;
        this.setKeyCount(t);
        const n = Model.level.getAdCount(this.levelType);
        this.setAdCount(n);
    }
    refreshKeyIcon() {
        const e = Model.level.getGameTicket(this.levelType);
        const t = _AssetConfig.Instance.get(e);
        const n = IMAGE_ICON_PATH_ + "/" + t.icon;
        this.keyIcon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, n);
        this.keyIcon.node.scale = 30 / this.keyIcon.node.width;
    }
    refreshReward() {
        const e = this.calcRewardCount();
        this.setReward(e);
    }
    setAdCount(e) {
        const t = this.levelType == E_GAME_LEVEL_TYPE.LegionRush ? GameConst.LEGION_AD_REPLENISHED_COUNT : GameConst.BOSS_AD_REPLENISHED_COUNT;
        this.adCount.string = "(" + (t - e) + "/" + t + ")";
    }
    setDifficulty(e) {
        this.difficultyLabel.getComponent(LanLabel).setVars("difficulty", "" + e);
    }
    setKeyCount(e) {
        this.keyCount.string = "" + e;
    }
    setReward(e) {
        this.rewardLabel.string = NumberPlus.format(e);
    }
}
