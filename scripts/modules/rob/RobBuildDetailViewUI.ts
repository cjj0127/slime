import { SpecialGuideEnum } from "../guide/GuideEnums";
import { GlobalEventName } from "../common/Events";
import { E_ASSET_TYPE, ROB_BUILDTYPE_, IMAGE_ICON_PATH_, ROB_BUILDTYPE_COLOR_, MapUIPrefabs } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import AssetManager from "../asset/AssetManager";
import _BuildingLevelConfig from "../../ccstudio/config/_BuildingLevelConfig";
import GuideMgr from "../guide/GuideMgr";
import _HeroConfig from "../../ccstudio/config/_HeroConfig";
import LanMgr from "../common/Language";
import RobModel from "../../ccstudio/data/RobModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import ShakeComp from "../common/ShakeComp";
import MsgHint from "../common/MsgHint";
import UserData from "../user/UserData";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const { ccclass, property } = cc._decorator;
@ccclass
export default class RobBuildDetailViewUI extends cc.Component {
    _levelInterval = 1;
    _touchInterval = 0.1;
    _touchStartInterval = 0.5;
    _touchTime = 0;
    _touched = false;
    @property(cc.Button)
    addHeroBtn: cc.Button = null;
    @property(cc.Label)
    buildDescLabel: cc.Label = null;
    buildingId = -1;
    @property(cc.Button)
    closeBtn: cc.Button = null;
    @property(cc.Sprite)
    coinIcon1: cc.Sprite = null;
    @property(cc.Sprite)
    coinIcon2: cc.Sprite = null;
    curHeroId = -1;
    @property(cc.Sprite)
    heroBuff: cc.Sprite = null;
    @property([cc.SpriteFrame])
    heroBuffFrames: cc.SpriteFrame[] = [];
    @property(cc.Sprite)
    heroIcon: cc.Sprite = null;
    @property(cc.Label)
    heroLvLabel: cc.Label = null;
    @property(cc.Label)
    heroNameLabel: cc.Label = null;
    @property(cc.Node)
    heroNode: cc.Node = null;
    @property(cc.Node)
    heroSuoNode: cc.Node = null;
    @property(cc.Sprite)
    heroTypeIcon: cc.Sprite = null;
    @property(cc.Button)
    lvUpBtn: cc.Button = null;
    @property(cc.Sprite)
    lvUpPriceIcon: cc.Sprite = null;
    @property(cc.Label)
    lvUpPriceLabel: cc.Label = null;
    @property(cc.Label)
    maxLvDescLabel: cc.Label = null;
    @property(cc.Label)
    maxStorageLabel: cc.Label = null;
    @property(cc.Label)
    perSpeedDesc: cc.Label = null;
    @property(cc.Label)
    perSpeedLabel: cc.Label = null;
    @property(cc.Label)
    titleLabel: cc.Label = null;
    @property(cc.Sprite)
    typeIcon: cc.Sprite = null;
    @property(cc.Label)
    typeName: cc.Label = null;
    changHeroCallBack(e: number, t: number): void {
        if (e == this.curHeroId) {
            this.curHeroId = -1;
        }
        else if (t == this.buildingId && this.curHeroId !== -1) {
            const n = _HeroConfig.Instance.get(e);
            this.heroIcon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, `${IMAGE_ICON_PATH_}/${n.icon}`);
            this.curHeroId = e;
        }
        this.refresh();
    }
    checkBtn(): void {
        this.lvUpBtn.node.targetOff(this);
        if (GuideMgr.instance.isCompleteSpecialGuide(SpecialGuideEnum.TouchRobLevelButton)) {
            this.lvUpBtn.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartHandler, this);
            this.lvUpBtn.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveHandler, this);
            this.lvUpBtn.node.on(cc.Node.EventType.TOUCH_END, this.onTouchCancelHandler, this);
            this.lvUpBtn.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancelHandler, this);
        }
        else {
            this.lvUpBtn.node.on("click", this.tryLvup, this);
        }
    }
    lateUpdate(e: number) {
        if (this._touched) {
            this._touchTime -= e;
            if (this._touchTime <= 0) {
                this.tryLvup();
                this._touchTime += this._touchInterval;
                if (this._touchInterval > 0.05) {
                    this._touchInterval *= 0.9;
                }
                else {
                    this._levelInterval += 0.03;
                }
            }
        }
    }
    lvupEnd() {
        if (this._touched) {
            this._touched = false;
        }
    }
    onAddHeroClick(): void {
        if (Model.rob.getBuildInfo(this.buildingId).level == 0) {
            const e = LanMgr.Instance.getLangByID("RobBuildingLevel");
            MsgHint.tip(e);
            this.lvUpBtn.node.getComponent(ShakeComp)?.play(.2, 15, 15);
        }
        else {
            Model.ui.openViewAsync(MapUIPrefabs.RobAddHeroViewUI, {
                data: {
                    enterType: 1,
                    heroId: this.curHeroId,
                    buildingId: this.buildingId
                }
            });
        }
    }
    onClose() {
        this.node.getComponent(ViewAnimCtrl).onClose();
        cc.director.emit(GlobalEventName.RobDetailClose);
    }
    onDisable(): void {
        cc.director.targetOff(this);
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchBuildReward);
    }
    onEnable(): void {
        this.refresh();
        cc.director.on(GlobalEventName.AddRobHero, this.changHeroCallBack, this);
        cc.director.on(GlobalEventName.RemoveRobHero, this.changHeroCallBack, this);
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.RobCoin1, this.refreshBuild, this);
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.RobCoin2, this.refreshBuild, this);
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.RobCoin3, this.refreshBuild, this);
        this.checkBtn();
        this.scheduleOnce(() => {
            if (Model.rob.getBuildInfo(4001).level > 0) {
                GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchBuildLevelUp);
                GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchPutHeroButton);
            }
            else {
                GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchBuildLevelUp);
            }
        });
    }
    onLoad(): void {
        this.addHeroBtn.node.on("click", this.onAddHeroClick, this);
        this.closeBtn.node.on("click", this.onClose, this);
    }
    onTouchCancelHandler() {
        this.lvupEnd();
    }
    onTouchMoveHandler(e: cc.Event.EventTouch) {
        //@ts-ignore
        if (!this.lvUpBtn.node._hitTest(e.getLocation())) {
            this.lvupEnd();
        }
    }
    onTouchStartHandler() {
        this._touched = true;
        this._touchTime = this._touchStartInterval;
        this._touchInterval = 0.1;
        this._levelInterval = 1;
        this.tryLvup();
    }
    refresh(): void {
        this.refreshBuild();
        this.refreshHero();
    }
    refreshBuild(): void {
        const t = Model.rob.getBuildInfo(this.buildingId);
        const n = Model.rob.getBuildingCfg(this.buildingId);
        const o = ROB_BUILDTYPE_[n.buildingType];
        this.typeName.string = LanMgr.Instance.getLangByID(o);
        this.typeIcon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, `${IMAGE_ICON_PATH_}/${o}`);
        this.typeIcon.node.color = cc.color().fromHEX(ROB_BUILDTYPE_COLOR_[n.buildingType]);
        this.titleLabel.string = `LV${t.level.toString()} ${LanMgr.Instance.getLangByID(n.name)}`;
        this.buildDescLabel.string = LanMgr.Instance.getLangByID(n.desc);
        this.perSpeedDesc.string = LanMgr.Instance.getLangByID("per_time_produce").replace("%{value}", `${n.time}`);
        this.perSpeedLabel.string = NumberPlus.format(Model.rob.getBaseOutCoin(t));
        this.maxStorageLabel.string = NumberPlus.format(Model.rob.getBaseMaxStock(t));
        const r = n.levelUpId;
        const i = _AssetConfig.Instance.get(r);
        this.lvUpPriceIcon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, `${IMAGE_ICON_PATH_}/${i.icon}`);
        this.lvUpPriceLabel.string = NumberPlus.format(_BuildingLevelConfig.Instance.getCfg(t.id, t.level)?.levelCost);
        const s = t.level >= Model.rob.getBuildMaxLevel(this.buildingId);
        this.lvUpBtn.node.active = !s;
        this.maxLvDescLabel.node.active = s;
        this.heroLvLabel.string = `LV${n.goodLevel.toString()}`;
        this.coinIcon1.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, `${IMAGE_ICON_PATH_}/${i.icon}`);
        this.coinIcon2.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, `${IMAGE_ICON_PATH_}/${i.icon}`);
        const u = Model.rob.canLvUpBuild(this.buildingId);
        this.lvUpPriceLabel.node.color = u ? cc.color().fromHEX("FFFFFF") : cc.color().fromHEX("#E91120");
        this.lvUpBtn.interactable = u;
        if (s) {
            this.lvupEnd();
        }
    }
    refreshHero(): void {
        const e = Model.rob.getHeroAddRate(this.buildingId) >= 1;
        if (this.curHeroId !== -1) {
            const t = _HeroConfig.Instance.get(this.curHeroId);
            const n = Model.rob.getBuildingCfg(this.buildingId);
            this.heroIcon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, `${IMAGE_ICON_PATH_}/${t.icon}`);
            const o = ROB_BUILDTYPE_[t.heroType];
            this.heroTypeIcon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, `${IMAGE_ICON_PATH_}/${o}`);
            this.heroBuff.spriteFrame = e ? this.heroBuffFrames[0] : this.heroBuffFrames[1];
            this.heroNameLabel.string = LanMgr.Instance.getLangByID(t.name);
            const r = t.heroType == n.buildingType;
            this.heroTypeIcon.node.color = r ? cc.color().fromHEX("#FFF900") : cc.color().fromHEX("#B1CAD4");
        }
        this.heroNode.active = this.curHeroId !== -1;
        this.heroBuff.node.active = this.curHeroId !== -1;
        const i = Model.rob.getBuildInfo(this.buildingId);
        this.heroSuoNode.active = i.level == 0;
        this.perSpeedLabel.node.color = e || this.curHeroId == -1 ? cc.color().fromHEX("#FFF900") : cc.color().fromHEX("#E91120");
        this.maxStorageLabel.node.color = e || this.curHeroId == -1 ? cc.color().fromHEX("#FFF900") : cc.color().fromHEX("#E91120");
    }
    reuse(e: {
        buildingId: number;
    }): void {
        this.buildingId = e.buildingId;
        const t = Model.rob.getBuildInfo(this.buildingId);
        this.curHeroId = t.heroId;
    }
    tryLvup() {
        if (Model.rob.canLvUpBuild(this.buildingId)) {
            const e = Model.rob.getBuildInfo(this.buildingId);
            const t = _BuildingLevelConfig.Instance.getCfg(this.buildingId, e.level);
            Model.rob.LvUpBuild(this.buildingId);
            this.refreshBuild();
            this.refreshHero();
            cc.director.emit(GlobalEventName.LvUpBuild, this.buildingId);
            const n = Model.rob.getBuildingCfg(this.buildingId);
            cc.director.emit(GlobalEventName.AssetItemChange + n.levelUpId.toString());
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchPutHeroButton);
            const o = {
                Plunder_BuildingId: this.buildingId,
                Plunder_BuildingLevel: e.level,
                Plunder_BuildingType: n.buildingType.toString(),
                PreciousCoin_Cost: t.levelCost,
                PreciousCoin_Num: n.levelUpId + "|" + UserData.Instance.getItem(n.levelUpId)
            };
        }
        else {
            MsgHint.tip(LanMgr.Instance.getLangByID("material_not_enough"));
        }
    }
}
