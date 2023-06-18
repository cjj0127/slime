import GuideMgr from "../guide/GuideMgr";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import { GlobalEventName } from "../common/Events";
import { EUNLOCKSYS_ID, E_ASSET_TYPE } from "../common/Const";
import GearModel from "../../ccstudio/data/GearModel";
import SkillModel from "../../ccstudio/data/SkillModel";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
import RelicData_ from "../relic/RelicData_";
import ToggleToPage, { PAGE_EVENTS } from "../common/ToggleToPage";
import UIBase from "../common/UIBase";
import UnlockCtrl from "../unlock/UnlockCtrl";
import UserData from "../user/UserData";
// import { UIBase } from 'UIBase';
const { ccclass, property } = cc._decorator;
@ccclass()
export default class HeroViewUI extends UIBase {
    @property()
    defaultToggleId: number = 0;
    @property(ToggleToPage)
    toggleToPage: ToggleToPage = null;
    public onEnable(): void {
        this.toggleToPage.setDefaultCheckedIdx(this.defaultToggleId);
        this.refreshSkillUnlockState(EUNLOCKSYS_ID.Skill);
        this.refreshRelicesUnlockState(EUNLOCKSYS_ID.Relices);
        this.refreshMateryUnlockState(EUNLOCKSYS_ID.Mastery);
        this.refreshTraitUnlockState(EUNLOCKSYS_ID.Trait);
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchUpgradeGearButton);
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchUpgradeSkillButton);
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchTraitToggle);
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchRelicToggle);
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchHeroToggle);
    }
    public onGlobalEvent(): void {
        cc.director.on(GlobalEventName.UnlockSkill, this.refreshSkillUnlockState, this);
        cc.director.on(GlobalEventName.UnlockMastery, this.refreshMateryUnlockState, this);
        cc.director.on(GlobalEventName.UnlockTrait, this.refreshTraitUnlockState, this);
        cc.director.on(GlobalEventName.UnlockRelices, this.refreshRelicesUnlockState, this);
    }
    public onLoad(): void {
        this.toggleToPage.node.on(PAGE_EVENTS.PageToIdx, this.onPageToIdx, this);
    }
    public onPageToIdx(e: number): void {
        if (e == 0) {
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchWeaponView);
            if (Model.gear.getOwnedCount() <= 0 && GuideMgr.instance.isCompleteSpecialGuide(SpecialGuideEnum.TouchUpgradeGearButton) && !GuideMgr.instance.isCompleteSpecialGuide(SpecialGuideEnum.TouchWeaponItem)) {
                GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchUpgradeGearButton);
                GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchWeaponView);
                GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchWeaponItem);
                GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchEquipWeaponButton);
                GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchClosEquipWeaponButton);
                GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchArmorView);
                GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchArmorItem);
                GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchEquipArmorButton);
                GuideMgr.instance.stopSpecialGuide();
            }
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchRingButton);
        }
        else if (e == 4) {
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchChangButton);
        }
        else if (e == 3) {
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchUpgradeMastery);
        }
        else if (e == 2) {
            if (GuideMgr.instance.isCompleteSpecialGuide(SpecialGuideEnum.TouchCaveRushReward) && parseInt(UserData.Instance.getItem(E_ASSET_TYPE.Fork)) <= 0) {
                GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchRelicToggle);
                GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchSearchRelicButton);
                GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchAnyWhere);
                GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchRelicIcon);
                GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchRelicItem);
                GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchRelicEquipButton);
                GuideMgr.instance.stopSpecialGuide();
            }
            else if (RelicData_.Instance.getRelicCount() == 0) {
                GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchSearchRelicButton);
            }
            else {
                GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchSearchRelicButton);
                GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchAnyWhere);
                GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchRelicIcon);
            }
        }
        else if (e == 1 && Model.skill.getOwnedCount() <= 0) {
            if (GuideMgr.instance.isCompleteGuide(SpecialGuideEnum.TouchSkillItem)) {
                return;
            }
            GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchUpgradeSkillButton);
            GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchSkillItem);
            GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchEquipSkillButton);
            GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchCloseSkillView);
            GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchAutoSkillButton);
            GuideMgr.instance.stopSpecialGuide();
        }
    }
    public refreshMateryUnlockState(e: number): void {
        const t = Model.user.isUnlock(e);
        const n = this.toggleToPage.toggleContainer.toggleItems[3];
        if (n) {
            UnlockCtrl.Instance.refreshUnlockState(t, n, e);
        }
    }
    public refreshRelicesUnlockState(e: number): void {
        const t = Model.user.isUnlock(e);
        const n = this.toggleToPage.toggleContainer.toggleItems[2];
        if (n) {
            UnlockCtrl.Instance.refreshUnlockState(t, n, e);
        }
    }
    public refreshSkillUnlockState(e: number): void {
        const t = Model.user.isUnlock(e);
        const n = this.toggleToPage.toggleContainer.toggleItems[1];
        if (n) {
            UnlockCtrl.Instance.refreshUnlockState(t, n, e);
        }
    }
    public refreshTraitUnlockState(e: number): void {
        const t = Model.user.isUnlock(e);
        const n = this.toggleToPage.toggleContainer.toggleItems[4];
        if (n) {
            UnlockCtrl.Instance.refreshUnlockState(t, n, e);
        }
    }
    // private defaultToggleId: number;
    public reuse(e: number): void {
        this.defaultToggleId = e || 0;
    }
}
