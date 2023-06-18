import GuideMgr from "../guide/GuideMgr";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import { EVideoType } from "../common/ViedioType";
import { GlobalEventName } from "../common/Events";
import { E_MenuToggleType, GameConst, E_ASSET_TYPE, COLOR_WHITE, COLOR_RED, MapUIPrefabs } from "../common/Const";
import AdsManager from "../ads/AdsManager";
import MsgBox from "../common/MsgBox";
import LanMgr from "../common/Language";
import AdsModel, { E_AD_TYPE } from "../../ccstudio/data/AdsModel";
import TraitModel from "../../ccstudio/data/TraitModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import _TraitConfig from "../../ccstudio/config/_TraitConfig";
import TraitData, { TRAIT_SLOT_COUNT } from "./TraitData";
import TraitKindLevelListUI from "./TraitKindLevelListUI";
import TraitResultListUI from "./TraitResultListUI";
import UserData, { AssetGetType } from "../user/UserData";
// n.default = S
const { ccclass, property } = cc._decorator;
@ccclass
export default class TraitViewUI extends cc.Component {
    @property(cc.Button)
    btnChange: cc.Button = null;
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Button)
    btnEffect: cc.Button = null;
    @property(cc.Button)
    btnRule: cc.Button = null;
    @property(cc.Button)
    btnTailtAd: cc.Button = null;
    @property(cc.Label)
    costLabel: cc.Label = null;
    @property(TraitKindLevelListUI)
    kindList: TraitKindLevelListUI = null;
    @property(TraitResultListUI)
    resultList: TraitResultListUI = null;
    tailtCountLabel: cc.Label = null;
    @property(cc.Label)
    traitCountLabel: cc.Label = null;
    onAssetTailtCountChangeEvent(): void {
        this.refreshCost(),
            this.refreshTraitStatus(),
            this.setCount(UserData.Instance.getItem(E_ASSET_TYPE.Tailt));
    }
    onClickAdAddTailt(): void {
        if (!(Model.ad.getAdTimes(E_AD_TYPE.eTailt) >= GameConst.TRAIT_AD_NUMBER)) {
            let e = {
                AdsType: EVideoType.AdTrait,
                OpenUi: EVideoType.AdTrait,
                onSucceed: function () {
                    Model.ad.addTodayTimes(E_AD_TYPE.eTailt),
                        UserData.Instance.addItem(E_ASSET_TYPE.Tailt, GameConst.TRAIT_AD_GET_NUMBER, {
                            type: AssetGetType.Trait
                        });
                }
            };
            AdsManager.getInstance().showRewardedVideo(e);
        }
    }
    onClickChange(): void {
        let e = this;
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchBattleButton2);
        let n = !1;
        for (let o = 0; o < TRAIT_SLOT_COUNT; o++) {
            let r = TraitData.Instance.getSlotData(o);
            if (r && r.id >= 0 && _TraitConfig.Instance.get(r.id).quality >= 7 && !r.lock) {
                n = !0;
                break;
            }
        }
        if (n) {
            let r = MsgBox.open(LanMgr.Instance.getLangByID("trait change tips"));
            r.confirm(function () {
                Model.trait.requestChange() && (e.resultList.refresh(), e.kindList.refresh());
            }),
                r.cancel();
        }
        else
            Model.trait.requestChange() && (this.resultList.refresh(), this.kindList.refresh());
    }
    onClickClose(): void {
        cc.director.emit(GlobalEventName.ClosePageView, E_MenuToggleType.Hero);
    }
    onClickEffect(): void {
        Model.ui.openViewAsync(MapUIPrefabs.TraitSetEffectView);
    }
    onClickRule(): void {
        Model.ui.openViewAsync(MapUIPrefabs.TraitRuleView);
    }
    onDisable(): void {
        cc.director.targetOff(this);
    }
    onEnable(): void {
        this.resultList.refresh(),
            this.kindList.refresh(),
            this.refreshCost(),
            this.refreshTraitStatus(),
            this.tailtCountLabel.string = "X" + GameConst.TRAIT_AD_GET_NUMBER,
            this.setCount(UserData.Instance.getItem(E_ASSET_TYPE.Tailt)),
            cc.director.on(GlobalEventName.TraitSlotLockStatusChange, this.onLockStatusChangeEvent, this),
            cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.Tailt, this.onAssetTailtCountChangeEvent, this);
    }
    onLoad(): void {
        this.tailtCountLabel = this.btnTailtAd.node.getChildByName("tag").getComponentInChildren(cc.Label),
            this.btnChange.node.on("click", this.onClickChange, this),
            this.btnTailtAd.node.on("click", this.onClickAdAddTailt, this),
            this.btnEffect.node.on("click", this.onClickEffect, this),
            this.btnRule.node.on("click", this.onClickRule, this),
            this.btnClose.node.on("click", this.onClickClose, this);
    }
    onLockStatusChangeEvent(): void {
        this.refreshCost();
    }
    refreshCost(): void {
        let e = Model.trait.getCost(), t = parseInt(UserData.Instance.getItem(E_ASSET_TYPE.Tailt));
        this.costLabel.node.color = t >= e ? COLOR_WHITE : COLOR_RED,
            this.costLabel.string = "" + e;
    }
    refreshTraitStatus(): void {
        let e = parseInt(UserData.Instance.getItem(E_ASSET_TYPE.Tailt));
        if (this.btnTailtAd.node.active = e <= GameConst.TRAIT_MIN_NUMBER_AD, e <= GameConst.TRAIT_MIN_NUMBER_AD) {
            let n = Model.ad.getAdTimes(E_AD_TYPE.eTailt);
            this.btnTailtAd.interactable = n < GameConst.TRAIT_AD_NUMBER,
                this.btnTailtAd.node.getChildByName("tag").active = n < GameConst.TRAIT_AD_NUMBER,
                this.btnTailtAd.target.getComponentInChildren(cc.Label).string = GameConst.TRAIT_AD_NUMBER - n + "/" + GameConst.TRAIT_AD_NUMBER;
        }
    }
    setCount(e: number): void {
        this.traitCountLabel.string = "" + e;
    }
}
