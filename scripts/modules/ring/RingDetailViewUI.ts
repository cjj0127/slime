import GuideMgr from "../guide/GuideMgr";
import GuideTouch from "../guide/GuideTouch";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import { MapUIPrefabs } from "../common/Const";
import RingModel from "../../ccstudio/data/RingModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import UIBase from "../common/UIBase";
import UIRingEquipInfo, { RingItemViewType } from "./UIRingEquipInfo";
import UIRingInfo from "./UIRingInfo";
// import UIRingInfo from "UIRingInfo";
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("ring/RingDetailViewUI")
export default class RingDetailViewUI extends UIBase {
    @property(cc.Button)
    batchBreakButton: cc.Button = null;
    @property(cc.Node)
    ringItem: cc.Node = null;
    @property(cc.Node)
    ringParent: cc.Node = null;
    @property(UIRingInfo)
    uiRingInfo: UIRingInfo = null;
    freshRingView() {
        Model.ring.setSelectId(Model.ring.getEquipRingId());
        this.uiRingInfo.freshView();
        this.ringParent.removeAllChildren();
        const allRingData = Model.ring.getAllRingData();
        for (let i = 0; i < allRingData.length; i++) {
            const node = cc.instantiate(this.ringItem);
            node.parent = this.ringParent;
            node.getComponent(UIRingEquipInfo).freshView(allRingData[i].id);
            node.getComponent(UIRingEquipInfo).setViewType(RingItemViewType.RingView);
            node.name = "showRing" + i.toString();
            node.active = true;
            if (i == 0) {
                const guideComp = node.getComponent(GuideTouch) || node.addComponent(GuideTouch);
                guideComp.setId(SpecialGuideEnum.TouchRingItem);
            }
        }
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchRingItem);
    }
    onBatchBreakClick() {
        Model.ui.openViewAsync(MapUIPrefabs.RingBreakViewUI);
    }
    onEnable() {
        this.freshRingView();
    }
    onGlobalEvent() { }
    onLoad() {
        this.batchBreakButton.node.on("click", this.onBatchBreakClick, this);
    }
}
