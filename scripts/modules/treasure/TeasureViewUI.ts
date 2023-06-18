import GuideMgr from "../guide/GuideMgr";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import { MapUIPrefabs } from "../common/Const";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import UIPool from "../common/UIPool";
import TeasureItemUI from "./TeasureItemUI";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TeasureViewUI extends UIPool {
    @property(cc.Button)
    closeBtn: cc.Button = null;
    @property(cc.Button)
    collectBtn: cc.Button = null;
    typeItem: {
        [key: number]: TeasureItemUI;
    } = {};
    initContentItem() {
        const items = this.node.getComponentsInChildren(TeasureItemUI);
        items.forEach((item, index) => {
            const typeId = index + 1;
            item.typeId = typeId;
            this.typeItem[typeId] = item;
        });
    }
    onCloseBtn() {
        this.node.getComponent(ViewAnimCtrl).onClose();
    }
    onCollectBtn() {
        Model.ui.openViewAsync(MapUIPrefabs.TeasureCollectionViewUI);
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchTreasure);
    }
    onLoad() {
        this.closeBtn.node.on("click", this.onCloseBtn, this);
        this.collectBtn.node.on("click", this.onCollectBtn, this);
        this.initContentItem();
    }
    start() { }
}
