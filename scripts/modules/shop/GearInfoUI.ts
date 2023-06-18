import { SpecialGuideEnum } from "../guide/GuideEnums";
import { GlobalEventName } from "../common/Events";
import { COLOR_GREEN, IMAGE_ICON_PATH_, GameConst, MapUIPrefabs, E_ENHANCE_TYPE } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import _GearConfig from "../../ccstudio/config/_GearConfig";
import _GearLevelConfig from "../../ccstudio/config/_GearLevelConfig";
import GuideMgr from "../guide/GuideMgr";
import LanMgr from "../common/Language";
import GearModel from "../../ccstudio/data/GearModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import DetailViewUI from "../battle/DetailViewUI";
const { ccclass, property } = cc._decorator;
const C: any = window["_"];
@ccclass
export default class GearInfoUI extends DetailViewUI {
    @property(cc.Node)
    addationNode: cc.Node = null;
    @property(cc.Sprite)
    arrawSprite: cc.Sprite = null;
    @property(cc.Label)
    equipAddationLabel: cc.Label = null;
    @property(cc.Node)
    equipRed: cc.Node = null;
    @property(cc.Label)
    equipValueLabel: cc.Label = null;
    gearType: any = null;
    getBtnEequipInteractable(): boolean {
        return !!Model.gear.getData(this.selectId) && this.selectId !== Model.gear.getCurrEquipId(this.gearType);
    }
    getBtnEnhanceInteractable(): boolean {
        return Model.gear.lvupEnable(this.selectId) || Model.gear.transNextEnable(this.selectId);
    }
    getCfgData(id: number): any {
        let quality = _GearConfig.Instance.get(id);
        return {
            icon: quality.icon,
            quality: quality.quality,
            name: quality.name,
        };
    }
    onClickEnhance(): void {
        if (Model.gear.transNextEnable(this.selectId)) {
            let enhance = Model.gear.transNext(this.selectId);
            if (enhance?.id > 0 && enhance?.count > 0) {
                Model.ui.openView(MapUIPrefabs.TransResult, {
                    data: {
                        type: E_ENHANCE_TYPE.Gear,
                        results: [enhance]
                    }
                });
            }
        }
        else if (Model.gear.lvupEnable(this.selectId)) {
            Model.gear.lvup(this.selectId);
        }
    }
    onClickEquip(): void {
        if (Model.gear.getData(this.selectId)) {
            Model.gear.equip(this.gearType, this.selectId);
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchClosEquipWeaponButton);
            cc.director.emit(GlobalEventName.EquipGearItem);
        }
    }
    refreshBtnStatus(): void {
        super.refreshBtnStatus();
        let data = Model.gear.getData(this.selectId);
        let quality = _GearConfig.Instance.get(this.selectId);
        let maxLevel = _GearLevelConfig.Instance.getMaxLevel(quality);
        let label = this.btnEnhance.target.getComponentInChildren(cc.Label);
        if (data && data.level >= maxLevel) {
            label.string = LanMgr.Instance.getLangByID("btn_merge");
        }
        else {
            label.string = LanMgr.Instance.getLangByID("btn_enhance");
        }
    }
    refreshDetail(): void {
        let data = Model.gear.getData(this.selectId);
        let level = (data?.level) ?? 1;
        let count = (data?.count) ?? 0;
        let lvupMaxCnt = Model.gear.getLvupMaxCnt(this.selectId, level);
        let quality = _GearConfig.Instance.get(this.selectId);
        if (level >= _GearLevelConfig.Instance.getMaxLevel(quality)) {
            this.setProgress(count, GameConst.GEARMAXLEVEL_NUM);
        }
        else {
            this.setProgress(count, lvupMaxCnt);
        }
        this.setLevel(level);
        let ownedValue = Model.gear.calcOwnedProp(this.selectId, level);
        this.setOwnedValue(ownedValue);
        let equippedValue = Model.gear.calcEquipedProp(this.selectId, level);
        let addation = null;
        let currEquipId = Model.gear.getCurrEquipId(this.gearType);
        let isGreen = false;
        if (currEquipId >= 0) {
            if (currEquipId != this.selectId) {
                let dataF = Model.gear.getData(currEquipId);
                let equippedValueF = Model.gear.calcEquipedProp(currEquipId, dataF.level);
                if (NumberPlus.compare(equippedValueF, equippedValue)) {
                    addation = `${NumberPlus.format(NumberPlus.sub(equippedValueF, equippedValue))}%`;
                    isGreen = false;
                }
                else {
                    addation = `${NumberPlus.format(NumberPlus.sub(equippedValue, equippedValueF))}%`;
                    isGreen = true;
                }
            }
        }
        else {
            addation = `${NumberPlus.format(equippedValue)}%`;
            isGreen = true;
        }
        this.setEquipedEffect(equippedValue, addation, isGreen);
    }
    refrshEquipRed(): void {
        let maxOwnGear = Model.gear.getMaxOwnGear(this.gearType);
        let currEquipId = Model.gear.getCurrEquipId(this.gearType);
        if (this.equipRed) {
            this.equipRed.active = maxOwnGear > 0 && this.selectId == maxOwnGear && currEquipId !== this.selectId;
        }
    }
    // equipValueLabel: cc.Label = null;
    // addationNode: cc.Node = null;
    // equipAddationLabel: cc.Label = null;
    // arrawSprite: cc.Sprite = null;
    // equipRed: cc.Node = null;
    setEquipedEffect(value: number, addation?: string, isGreen?: boolean): void {
        if (this.equipValueLabel.string = `+${NumberPlus.format(value)}%`, C.isNil(addation)) {
            this.equipAddationLabel.string = "";
            this.addationNode.active = !1;
        }
        else {
            this.equipAddationLabel.string = addation;
            this.addationNode.active = !0;
            this.equipAddationLabel.node.color = isGreen ? COLOR_GREEN : cc.color().fromHEX("#df1aff");
            let path = isGreen ? `${IMAGE_ICON_PATH_}/icon_arrow_up` : `${IMAGE_ICON_PATH_}/icon_arrow_down`;
            this.arrawSprite.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, path);
        }
    }
    set selectId(e: number) {
        if (this.itemId !== e) {
            this.itemId = e;
            this.refresh();
            this.refreshDetail();
            this.refreshBtnStatus();
            this.refrshEquipRed();
        }
    }
    get selectId(): number {
        return this.itemId;
    }
}
