import GuideMgr from "../guide/GuideMgr";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import LanMgr from "../common/Language";
import LanLabel from "../common/LanLabel";
import { GlobalEventName } from "../common/Events";
import { GameConst, MapUIPrefabs, E_ENHANCE_TYPE } from "../common/Const";
import SkillModel from "../../ccstudio/data/SkillModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
import _SkillLevelConfig from "../../ccstudio/config/_SkillLevelConfig";
import DetailViewUI from "../battle/DetailViewUI";
// import { DetailViewUI } from 'DetailViewUI';
const { ccclass, property } = cc._decorator;
@ccclass()
export class SkillDetailViewUI extends DetailViewUI {
    @property(cc.Label)
    cdTimeLabel: cc.Label = null;
    @property(cc.RichText)
    descLabel: cc.RichText = null;
    getBtnEequipInteractable() {
        const skillData = Model.skill.getData(this.itemId);
        if (skillData) {
            const equipedIdx = Model.skill.getEquipedIdx(this.itemId);
            const label = this.btnEquip.getComponentInChildren(cc.Label);
            label.string = equipedIdx >= 0 ? LanMgr.Instance.getLangByID("btn_remove") : LanMgr.Instance.getLangByID("btn_equip");
            return true;
        }
        const label = this.btnEquip.getComponentInChildren(cc.Label);
        label.string = LanMgr.Instance.getLangByID("btn_equip");
        return false;
    }
    getBtnEnhanceInteractable() {
        return Model.skill.lvupEnable(this.itemId) || Model.skill.transNextEnable(this.itemId);
    }
    getCfgData(id: number) {
        const itemData = _SkillConfig.Instance.get(id);
        return {
            icon: itemData.icon,
            quality: itemData.quality,
            name: LanMgr.Instance.getLangByID(itemData.name)
        };
    }
    onClickEnhance() {
        if (Model.skill.transNextEnable(this.itemId)) {
            const nextTrans = Model.skill.transNext(this.itemId);
            if (nextTrans && nextTrans.id > 0 && nextTrans.count > 0) {
                Model.ui.addViewAsyncQueue(MapUIPrefabs.TransResult, {
                    data: {
                        type: E_ENHANCE_TYPE.Skill,
                        results: [nextTrans]
                    }
                });
            }
        }
        else if (Model.skill.lvupEnable(this.itemId)) {
            Model.skill.lvup(this.itemId);
        }
    }
    onClickEquip() {
        const skillData = Model.skill.getData(this.itemId);
        if (GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchCloseSkillView), skillData) {
            let equipedIdx = Model.skill.getEquipedIdx(this.itemId);
            if (equipedIdx >= 0) {
                Model.skill.unequip(equipedIdx);
                this.node.emit("Close");
            }
            else if ((equipedIdx = Model.skill.findEmptySolt()) >= 0) {
                Model.skill.equip(equipedIdx, this.itemId);
                this.node.emit("Close");
            }
            else {
                cc.director.emit(GlobalEventName.SkillOpenUIEquipSelectSlot, this.itemId);
                this.node.emit("Close");
            }
        }
    }
    onEnable() {
        super.onEnable();
        cc.director.on(GlobalEventName.SkillLevelUp, this.onSkillLvup, this);
        cc.director.on(GlobalEventName.SkillTrans, this.onTrans, this);
        this.scheduleOnce(() => {
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchEquipSkillButton);
        });
    }
    onSkillLvup(e: any) {
        if (this.itemId == e.id) {
            this.refreshDetail();
            this.refreshBtnStatus();
            const t = Model.skill.lvupEnable(this.itemId) || Model.skill.transNextEnable(this.itemId);
            this.btnEnhance.interactable = t;
            this.setRedPoint(t);
        }
    }
    onTrans(e: any) {
        if (this.itemId == e.prev) {
            this.refreshDetail();
            this.refreshBtnStatus();
            const t = Model.skill.lvupEnable(this.itemId) || Model.skill.transNextEnable(this.itemId);
            this.btnEnhance.interactable = t;
            this.setRedPoint(t);
        }
    }
    refreshBtnStatus() {
        super.refreshBtnStatus();
        const skillData = Model.skill.getData(this.itemId);
        const itemData = _SkillConfig.Instance.get(this.itemId);
        const maxLevel = _SkillLevelConfig.Instance.getMaxLevel(itemData.quality);
        const label = this.btnEnhance.target.getComponentInChildren(cc.Label);
        if (skillData?.level >= maxLevel) {
            label.string = LanMgr.Instance.getLangByID("btn_merge");
        }
        else {
            label.string = LanMgr.Instance.getLangByID("btn_enhance");
        }
    }
    refreshDetail() {
        const itemData = _SkillConfig.Instance.get(this.itemId);
        const skillData = Model.skill.getData(this.itemId);
        const propData = Model.skill.getProp(this.itemId);
        const skillLevel = (skillData?.level ?? 1);
        const skillCount = (skillData?.count ?? 0);
        const maxCnt = Model.skill.getLvupMaxCnt(this.itemId, skillLevel);
        if (skillLevel >= _SkillLevelConfig.Instance.getMaxLevel(itemData.quality)) {
            this.setProgress(skillCount, GameConst.SKILLMAXLEVEL_NUM);
        }
        else {
            this.setProgress(skillCount, maxCnt);
        }
        this.setLevel(skillLevel);
        this.setOwnedValue(propData.owned);
        this.setCdTime(itemData.cd);
        const value = propData.value;
        let desc = LanMgr.Instance.getLangByID(itemData.desc);
        desc = desc.replace("%{value}", "" + value);
        desc = desc.replace("%{duration}", "" + itemData.duration);
        desc = desc.replace("%{count}", "" + itemData.tiggerCnt);
        this.setDescStr(desc);
    }
    setCdTime(e: number) {
        this.cdTimeLabel.getComponent(LanLabel).setVars("cd", e.toString());
    }
    setDescStr(e: string) {
        this.descLabel.string = e;
    }
    start() {
    }
}
