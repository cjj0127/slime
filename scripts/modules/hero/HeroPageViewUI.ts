import { SpecialGuideEnum } from "../guide/GuideEnums";
import { GlobalEventName } from "../common/Events";
import { MapUIPrefabs, E_MenuToggleType, EUNLOCKSYS_ID } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetPool from "../asset/AssetPool";
import BtnShare from "../common/BtnShare";
import ChannelManager, { eChannelType } from "../common/ChannelManager";
import _GearConfig from "../../ccstudio/config/_GearConfig";
import GuideMgr from "../guide/GuideMgr";
import _HeroConfig from "../../ccstudio/config/_HeroConfig";
import HeroData from "./HeroData";
import GearModel from "../../ccstudio/data/GearModel";
import RingModel from "../../ccstudio/data/RingModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import UIBase from "../common/UIBase";
import HeroEquipInfoUI from "./HeroEquipInfoUI";
import HeroInfoUI from "./HeroInfoUI";
import HeroLevelPropsUI from "./HeroLevelPropsUI";
import HeroPropInfoUI from "./HeroPropInfoUI";
import HeroSkillInfoUI from "./HeroSkillInfoUI";
import UIRingEquipInfo from "../ring/UIRingEquipInfo";
import UnlockCtrl from "../unlock/UnlockCtrl";
// import * as BtnShare from 'BtnShare';
const { ccclass, property } = cc._decorator;
@ccclass
export default class HeroPageViewUI extends UIBase {
    private _showProp: boolean = false;
    @property(HeroEquipInfoUI)
    armorInfo: HeroEquipInfoUI = null;
    @property(cc.Button)
    btnAramor: cc.Button = null;
    @property(cc.Button)
    btnChangeHero: cc.Button = null;
    @property(cc.Button)
    btnChangeMode: cc.Button = null;
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Button)
    btnRing: cc.Button = null;
    @property(cc.Button)
    btnWeapon: cc.Button = null;
    @property(HeroInfoUI)
    heroInfo: HeroInfoUI = null;
    @property(HeroLevelPropsUI)
    levelProps: HeroLevelPropsUI = null;
    @property(HeroPropInfoUI)
    propInfo: HeroPropInfoUI = null;
    @property(UIRingEquipInfo)
    ringInfo: UIRingEquipInfo = null;
    @property(HeroSkillInfoUI)
    skillInfo: HeroSkillInfoUI = null;
    @property(HeroEquipInfoUI)
    weaponInfo: HeroEquipInfoUI = null;
    async checkShowShareBtn() {
        if (ChannelManager.getChannelType() !== eChannelType.WECHAT && ChannelManager.getChannelType() !== eChannelType.BYTEDANCE || GuideMgr.instance.isInGuide()) {
            return;
        }
        const e = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, MapUIPrefabs.ShareBtn.path);
        const t = {
            failCallback: function () { },
            palceName: "HeroShare",
            successCallback: function () { }
        };
        e.getComponent(BtnShare).showShare("hero", t);
        this.node.addChild(e);
    }
    onArmorChange() {
        this.refreshArmorInfo();
    }
    onClickArmor() {
        Model.ui.openViewAsync(MapUIPrefabs.Armor);
    }
    async onClickChangeHero() {
        await Model.ui.openViewAsync(MapUIPrefabs.HeroListView);
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchUpgradeHeroButton);
    }
    onClickChangeMode() {
        this.showProp = !this.showProp;
    }
    onClickClose() {
        cc.director.emit(GlobalEventName.ClosePageView, E_MenuToggleType.Hero);
    }
    onClickRing() {
        Model.ui.openViewAsync(MapUIPrefabs.RingDetailViewUI);
    }
    onClickWeapon() {
        Model.ui.openViewAsync(MapUIPrefabs.Weapon);
    }
    onEnable() {
        this.refreshWeaponInfo();
        this.refreshArmorInfo();
        this.refreshHeroInfo();
        this.refreshPropInfo();
        this.refreshSkillInfo();
        this.refreshRingInfo();
        this.refreshHeroUnlockState(EUNLOCKSYS_ID.Hero);
        this.refreshEquipUnlockState(EUNLOCKSYS_ID.Equip);
        this.refreshRinghUnlockState(EUNLOCKSYS_ID.HeroRush);
        this.showProp = false;
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchChangeHero);
    }
    onGlobalEvent() {
        cc.director.on(GlobalEventName.EquipWeaponChange, this.onWeaponChange, this);
        cc.director.on(GlobalEventName.EquipArmorChange, this.onArmorChange, this);
        cc.director.on(GlobalEventName.EquipRingChange, this.onRingChange, this);
        cc.director.on(GlobalEventName.UnlockHero, this.refreshHeroUnlockState, this);
        cc.director.on(GlobalEventName.UnlockEquip, this.refreshEquipUnlockState, this);
        cc.director.on(GlobalEventName.UnlockHeroRush, this.refreshRinghUnlockState, this);
        cc.director.on(GlobalEventName.HeroUnlockProp, this.onHeroUnlockProp, this);
        cc.director.on(GlobalEventName.HeroUnlockSkill, this.onHeroUnlockSkill, this);
        cc.director.on(GlobalEventName.HeroLevelChange, this.onHeroLevelChange, this);
    }
    onHeroLevelChange(e: number) {
        if (HeroData.Instance.battleId == e) {
            const t = HeroData.Instance.getData(e);
            this.heroInfo.setLv(t.level);
        }
    }
    onHeroUnlockProp(e: number, t: {
        prop: any;
        value: any;
    }) {
        if (HeroData.Instance.battleId == e) {
            const { prop, value } = t;
            const n = HeroData.Instance.getData(e);
            this.levelProps.unlockProp(n.level);
        }
    }
    onHeroUnlockSkill(e: number) {
        if (HeroData.Instance.battleId == e) {
            const t = HeroData.Instance.getData(e).level;
            const n = _HeroConfig.Instance.get(e);
            this.skillInfo.setState(t, n.skillUnlockLv);
        }
    }
    onLoad() {
        this.weaponInfo.node.on("click", this.onClickWeapon, this);
        this.armorInfo.node.on("click", this.onClickArmor, this);
        this.ringInfo.node.on("click", this.onClickRing, this);
        this.btnChangeMode.node.on("click", this.onClickChangeMode, this);
        this.btnChangeHero.node.on("click", this.onClickChangeHero, this);
        this.btnClose.node.on("click", this.onClickClose, this);
        this.checkShowShareBtn();
    }
    // @d.default weaponInfo: any;
    // @d.default armorInfo: any;
    // @E.default ringInfo: any;
    // @cc.Button btnChangeMode: cc.Button;
    // @v.default heroInfo: any;
    // @h.default propInfo: any;
    // @g.default skillInfo: any;
    // @m.default levelProps: any;
    // @cc.Button btnChangeHero: cc.Button;
    // @cc.Button btnWeapon: cc.Button;
    // @cc.Button btnArmor: cc.Button;
    // @cc.Button btnRing: cc.Button;
    // @cc.Button btnClose: cc.Button;
    onRingChange() {
        this.refreshRingInfo();
    }
    onWeaponChange() {
        this.refreshWeaponInfo();
    }
    refreshArmorInfo() {
        const e = Model.gear.equipArmorId;
        if (e > 0) {
            const t = _GearConfig.Instance.get(e);
            const n = Model.gear.getData(e);
            const o = (null == n ? void 0 : n.level) || 1;
            this.armorInfo.setQualityValue(t.quality);
            this.armorInfo.setIcon(t.icon);
            this.armorInfo.setNameStr(t.name);
            this.armorInfo.setLevel(o);
        }
        else {
            this.armorInfo.showEmpty();
        }
    }
    refreshEquipUnlockState(e: any) {
        const t = UnlockCtrl.Instance.isUnlock(e);
        UnlockCtrl.Instance.refreshUnlockState(t, this.btnWeapon.getComponent(cc.Button), e);
        UnlockCtrl.Instance.refreshUnlockState(t, this.btnAramor.getComponent(cc.Button), e);
    }
    refreshHeroInfo() {
        const e = HeroData.Instance.battleId;
        this.heroInfo.setHeroId(e);
    }
    refreshHeroUnlockState(e: any) {
        const t = UnlockCtrl.Instance.isUnlock(e);
        UnlockCtrl.Instance.refreshUnlockState(t, this.btnChangeHero.getComponent(cc.Button), e);
    }
    refreshPropInfo() { }
    refreshRingInfo() {
        this.ringInfo.freshView(Model.ring.getEquipRingId());
    }
    refreshRinghUnlockState(e: any) {
        const t = UnlockCtrl.Instance.isUnlock(e);
        UnlockCtrl.Instance.refreshUnlockState(t, this.btnRing.getComponent(cc.Button), e);
    }
    refreshSkillInfo() {
        const e = HeroData.Instance.battleId;
        const t = _HeroConfig.Instance.get(e);
        const n = HeroData.Instance.getData(e);
        const o = t.unlockPropLvs;
        const r = t.props;
        const i = t.propValues;
        const a = (null == n ? void 0 : n.level) || 0;
        this.levelProps.setProps(a, r, i, o);
        this.skillInfo.setSkill(t.skillId);
        this.skillInfo.setState(a, t.skillUnlockLv);
    }
    refreshWeaponInfo() {
        const e = Model.gear.equipWeaponId;
        if (e > 0) {
            const t = _GearConfig.Instance.get(e);
            const n = Model.gear.getData(e);
            const o = (null == n ? void 0 : n.level) || 1;
            this.weaponInfo.setQualityValue(t.quality);
            this.weaponInfo.setIcon(t.icon);
            this.weaponInfo.setNameStr(t.name);
            this.weaponInfo.setLevel(o);
        }
        else {
            this.weaponInfo.showEmpty();
        }
    }
    get showProp() {
        return this._showProp;
    }
    set showProp(value: boolean) {
        this._showProp = value;
        this.propInfo.node.active = value;
        this.skillInfo.node.active = !value;
    }
}
