import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import { E_ASSET_TYPE } from "../common/Const";
import MsgBox from "../common/MsgBox";
import RingModel from "../../ccstudio/data/RingModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import AssetInfoUI from "../asset/AssetInfoUI";
import UIBase from "../common/UIBase";
import UIRingEquipInfo, { RingItemViewType } from "./UIRingEquipInfo";
// n.default = _
const { ccclass, property } = cc._decorator;
@ccclass
export default class RingBreakViewUI extends UIBase {
    @property(cc.Button)
    autoChooseButton = null;
    @property(cc.Button)
    batchBreakButton = null;
    @property(cc.Label)
    chooseLabel = null;
    isAllSelect = false;
    @property(cc.Node)
    ringItem = null;
    @property(cc.Node)
    ringParent = null;
    @property(cc.Label)
    ringRingChipLabel = null;
    freshCount() {
        this.chooseLabel.string = LanMgr.Instance.getLangByID("Ring_Break_02") + ":" + Model.ring.getChooseRingCount().toString();
        this.ringRingChipLabel.string = NumberPlus.format(Model.ring.getChooseRingChipCount());
    }
    freshRingView() {
        this.ringParent.removeAllChildren();
        const e = Model.ring.getCanBreakList();
        for (let t = 0; t < e.length; t++) {
            const n = cc.instantiate(this.ringItem);
            n.parent = this.ringParent;
            n.getComponent(UIRingEquipInfo).freshView(e[t]);
            n.getComponent(UIRingEquipInfo).setViewType(RingItemViewType.SelectView);
            n.name = "selectRing" + t.toString();
            n.active = true;
        }
    }
    onAutoChooseClick() {
        this.isAllSelect = !this.isAllSelect;
        Model.ring.selectAllRing(this.isAllSelect);
    }
    onBatchBreakClick() {
        if (!(Model.ring.getBreakChooseCount() <= 0)) {
            const e = MsgBox.open(LanMgr.Instance.getLangByID("Ring_BreaktTips_02"), LanMgr.Instance.getLangByID("Ring_BreaktTips_01"));
            e.confirm(() => {
                Model.ring.breakSelectRing();
            });
            e.cancel();
        }
    }
    onEnable() {
        this.freshRingView();
        this.freshCount();
        Model.ring.clearSelect();
        this.isAllSelect = false;
    }
    onGlobalEvent() {
        cc.director.on(GlobalEventName.SelectRing, this.freshCount, this);
        cc.director.on(GlobalEventName.UpdateSelectView, this.freshCount, this);
    }
    // ringItem: cc.Node;
    // ringParent: cc.Node;
    // chooseLabel: cc.Label;
    // ringRingChipLabel: cc.Label;
    // autoChooseButton: cc.Button;
    // batchBreakButton: cc.Button;
    // isAllSelect: boolean;
    onLoad() {
        this.autoChooseButton.node.on("click", this.onAutoChooseClick, this);
        this.batchBreakButton.node.on("click", this.onBatchBreakClick, this);
        this.ringRingChipLabel.node.parent.on(cc.Node.EventType.TOUCH_END, this.onTouchIcon, this);
    }
    onTouchIcon() {
        AssetInfoUI.addPopItem(E_ASSET_TYPE.RingChip, this.ringRingChipLabel.node.parent);
    }
    ;
}
