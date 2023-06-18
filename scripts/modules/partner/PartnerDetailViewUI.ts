import GuideMgr from "../guide/GuideMgr";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import { GameConst, MapUIPrefabs, E_ENHANCE_TYPE } from "../common/Const";
import PartnerModel from "../../ccstudio/data/PartnerModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import _PartnerConfig from "../../ccstudio/config/_PartnerConfig";
import _PartnerLevelConfig from "../../ccstudio/config/_PartnerLevelConfig";
import _PartnerTagConfig from "../../ccstudio/config/_PartnerTagConfig";
import DetailViewUI from "../battle/DetailViewUI";
import PartnerTagUI from "./PartnerTagUI";
import UIPool from "../common/UIPool";
const { ccclass, property } = cc._decorator;
@ccclass
export default class PartnerDetailViewUI extends DetailViewUI {
    @property(cc.Label)
    aspdValue: cc.Label = null;
    @property(cc.Label)
    atkValue: cc.Label = null;
    @property(cc.Layout)
    tagLayout: cc.Layout = null;
    @property(UIPool)
    tagPool: UIPool = null;
    getBtnEequipInteractable() {
        if (Model.partner.getData(this.itemId)) {
            const e = Model.partner.getEquipedIdx(this.itemId);
            this.btnEquip.getComponentInChildren(cc.Label).string = e >= 0 ? LanMgr.Instance.getLangByID("btn_remove") : LanMgr.Instance.getLangByID("btn_equip");
            return true;
        }
        this.btnEquip.getComponentInChildren(cc.Label).string = LanMgr.Instance.getLangByID("btn_equip");
        return false;
    }
    getBtnEnhanceInteractable() {
        return Model.partner.lvupEnable(this.itemId) || Model.partner.transNextEnable(this.itemId);
    }
    getCfgData(e) {
        const t = _PartnerConfig.Instance.get(e);
        return {
            icon: t.icon,
            quality: t.quality,
            name: LanMgr.Instance.getLangByID(t.name),
        };
    }
    onClickEnhance() {
        if (Model.partner.transNextEnable(this.itemId)) {
            const e = Model.partner.transNext(this.itemId);
            if (e && e.id > 0 && e.count > 0) {
                Model.ui.addViewAsyncQueue(MapUIPrefabs.TransResult, {
                    data: {
                        type: E_ENHANCE_TYPE.Panter,
                        results: [e],
                    },
                });
            }
        }
        else if (Model.partner.lvupEnable(this.itemId)) {
            Model.partner.lvup(this.itemId);
        }
    }
    onClickEquip() {
        if (Model.partner.getData(this.itemId)) {
            let e = Model.partner.getEquipedIdx(this.itemId);
            if (e >= 0) {
                Model.partner.unequip(e);
                return void this.node.emit("Close");
            }
            if ((e = Model.partner.findEmptySolt()) >= 0) {
                Model.partner.equip(e, this.itemId);
                return void this.node.emit("Close");
            }
            cc.director.emit(GlobalEventName.PartnerOpenUIEquipSelectSlot, this.itemId);
            this.node.emit("Close");
        }
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        super.onEnable();
        this.refreshTag();
        cc.director.on(GlobalEventName.PartnerLevelUp, this.onPartnerLevelUp, this);
        cc.director.on(GlobalEventName.PartnerTrans, this.onPartnerTrans, this);
    }
    onPartnerLevelUp(e) {
        if (this.itemId == e.id) {
            this.refreshDetail();
            this.refreshBtnStatus();
            const t = Model.partner.lvupEnable(this.itemId) || Model.partner.transNextEnable(this.itemId);
            this.btnEnhance.interactable = t;
            this.setRedPoint(t);
        }
    }
    onPartnerTrans(e: any) {
        if (this.itemId == e.prev) {
            this.refreshDetail();
            this.refreshBtnStatus();
            const t = Model.partner.lvupEnable(this.itemId) || Model.partner.transNextEnable(this.itemId);
            this.btnEnhance.interactable = t;
            this.setRedPoint(t);
        }
    }
    refreshBtnStatus() {
        super.refreshBtnStatus();
        const t = Model.partner.getData(this.itemId);
        const n = _PartnerConfig.Instance.get(this.itemId);
        const o = _PartnerLevelConfig.Instance.getMaxLevel(n.quality);
        const r = this.btnEnhance.target.getComponentInChildren(cc.Label);
        if (t && t.level >= o) {
            r.string = LanMgr.Instance.getLangByID("btn_merge");
        }
        else {
            r.string = LanMgr.Instance.getLangByID("btn_enhance");
        }
    }
    refreshDetail() {
        const e = _PartnerConfig.Instance.get(this.itemId);
        const t = Model.partner.getProp(this.itemId);
        this.setAtkValue(t.atk);
        this.setAspedValue(e.aspd);
        const n = Model.partner.getData(this.itemId);
        const o = (n?.level) || 1;
        const r = (n?.count) || 0;
        const i = t.owned;
        const a = Model.partner.getLvupMaxCnt(this.itemId, o);
        if (o >= _PartnerLevelConfig.Instance.getMaxLevel(e.quality)) {
            this.setProgress(r, GameConst.PARTNERMAXLEVEL_NUM);
        }
        else {
            this.setProgress(r, a);
        }
        this.setLevel(o);
        this.setOwnedValue(i);
    }
    refreshTag() {
        this.tagPool.clear();
        _PartnerConfig.Instance.get(this.itemId).flg.forEach(t => {
            const n = this.tagPool.get();
            n.parent = this.tagLayout.node;
            const o = _PartnerTagConfig.Instance.get(t);
            n.getComponent(PartnerTagUI).setNameStr(LanMgr.Instance.getLangByID(o.name));
        });
    }
    setAspedValue(e) {
        this.aspdValue.string = `${e}`;
    }
    setAtkValue(e) {
        this.atkValue.string = NumberPlus.format(e);
    }
    start() {
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchEquipPartnerButton);
    }
}
