import GuideMgr from "../guide/GuideMgr";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import ItemUIBase from "../common/ItemUIBase";
import { GlobalEventName } from "../common/Events";
import RingModel from "../../ccstudio/data/RingModel";
import Model from "../../ccstudio/data/Model";
import _RingConfig from "../../ccstudio/config/_RingConfig";
export enum RingItemViewType {
    GearView = 0,
    RingTopView = 1,
    RingView = 2,
    SelectView = 3
}
const { ccclass, property, menu } = cc._decorator;
@ccclass
export default class UIRingEquipInfo extends ItemUIBase {
    curRingId: number = -1;
    @property(cc.Node)
    equipNode: cc.Node = null;
    isSelect: boolean = false;
    @property(cc.Label)
    lvLabel: cc.Label = null;
    ringItemViewType: RingItemViewType = RingItemViewType.GearView;
    @property(cc.Node)
    selectNode: cc.Node = null;
    @property(cc.Label)
    strengthenLabel: cc.Label = null;
    freshView(e: number) {
        this.curRingId = e;
        if (e == -1) {
            this.setQualityValue(1);
            this.setIcon("");
            this.lvLabel.string = "";
            this.strengthenLabel.string = "";
        }
        else {
            const t = Model.ring.getRingData(e);
            const n = _RingConfig.Instance.get(t.originId).icon;
            this.setQualityValue(t.quality - 1);
            this.setIcon(n);
            this.lvLabel.string = "LV" + t.ringLevel.toString();
            this.strengthenLabel.string = 0 == t.strengthenLv ? "" : "+" + t.strengthenLv.toString();
        }
        e == Model.ring.getEquipRingId() && e != -1 ? this.setEquip(!0) : this.setEquip(!1);
        this.onSelect();
    }
    onDestroy() {
        cc.director.targetOff(this);
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    // lvLabel: cc.Label;
    // strengthenLabel: cc.Label;
    // equipNode: cc.Node;
    // selectNode: cc.Node;
    // ringItemViewType: a;
    // curRingId: number;
    // isSelect: boolean;
    onEnable() {
        if (this.ringItemViewType == RingItemViewType.RingView) {
            this.node.on("click", this.onRingViewClick, this);
            cc.director.on(GlobalEventName.RemoveRing, this.onRemoveRing, this);
            cc.director.on(GlobalEventName.FreshRingView, this.onFreshRing, this);
            cc.director.on(GlobalEventName.FreshRingInfoView, this.onSelect, this);
        }
        else if (this.ringItemViewType == RingItemViewType.SelectView) {
            this.node.on("click", this.onSelectViewClick, this);
            cc.director.on(GlobalEventName.SelectRing, this.selectRing, this);
            cc.director.on(GlobalEventName.RemoveRing, this.onRemoveRing, this);
            this.setSelect(!1);
        }
        else if (this.ringItemViewType == RingItemViewType.GearView) {
            cc.director.on(GlobalEventName.EquipRing, this.onFreshGearView, this);
            cc.director.on(GlobalEventName.FreshRingView, this.onFreshRing, this);
        }
        else if (this.ringItemViewType == RingItemViewType.RingTopView) {
            cc.director.on(GlobalEventName.EquipRing, this.onFreshTopView, this);
        }
    }
    onFreshGearView() {
        const e = Model.ring.getEquipRingId();
        this.freshView(e);
    }
    onFreshRing(e: number) {
        if (e == this.curRingId) {
            this.freshView(this.curRingId);
        }
    }
    onFreshTopView() {
        const e = Model.ring.getSelectId();
        this.freshView(e);
    }
    onRemoveRing(e: number) {
        if (e == this.curRingId) {
            this.node.destroy();
        }
    }
    onRingViewClick() {
        this.scheduleOnce(() => {
            GuideMgr.instance.isCompleteSpecialGuide(SpecialGuideEnum.TouchRingItem) && (-1 == Model.ring.getEquipRingId() ? GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchRingEquipButton) : (GuideMgr.instance.completePreSpecialGuide(SpecialGuideEnum.TouchRingEquipButton),
                GuideMgr.instance.stopSpecialGuide()));
        });
        this.setSelect(!0);
        Model.ring.setSelectId(this.curRingId);
    }
    onSelect() {
        const e = Model.ring.getSelectId();
        if (e == -1 || e != this.curRingId) {
            this.setSelect(!1);
        }
        else {
            this.setSelect(!0);
        }
    }
    onSelectViewClick() {
        this.setSelect(!this.isSelect);
        Model.ring.selectRing(this.curRingId, this.isSelect);
    }
    selectRing(e: number, t: boolean) {
        if (e == this.curRingId) {
            this.setSelect(t);
        }
    }
    setEquip(e: boolean) {
        if (this.ringItemViewType == RingItemViewType.RingView) {
            this.equipNode.active = e;
        }
    }
    setSelect(e: boolean) {
        if (this.selectNode && (this.ringItemViewType == RingItemViewType.RingView || this.ringItemViewType == RingItemViewType.SelectView)) {
            this.selectNode.active = e;
            this.isSelect = e;
        }
    }
    setViewType(e) {
        this.ringItemViewType = e;
    }
}
