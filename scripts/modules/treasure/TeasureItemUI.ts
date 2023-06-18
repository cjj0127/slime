import GuideMgr from "../guide/GuideMgr";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import ItemUIBase from "../common/ItemUIBase";
import CTreasureData from "./CTreasureData";
import { GlobalEventName } from "../common/Events";
import { MapUIPrefabs } from "../common/Const";
import TeasureModel from "../../ccstudio/data/TeasureModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import _TeasureConfig from "../../ccstudio/config/_TeasureConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TreasureItem extends ItemUIBase {
    // addIconPath: string = "";
    // teasureId: number = 0;
    typeId: number = 0;
    onClickTeasuer() {
        Model.ui.openViewAsync(MapUIPrefabs.TeasureDetailViewUI, {
            data: this.typeId
        });
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchTreasureItem);
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        cc.director.on(GlobalEventName.TreasureEquip, this.refresh, this);
    }
    onLoad() {
        this.node.on("click", this.onClickTeasuer, this);
        this.refresh();
    }
    refresh() {
        let resetIcon = () => {
            this.iconSprite.node.width = 80;
            this.iconSprite.node.height = 80;
            this.iconSprite.node.y = 0;
            this.iconSprite.node.opacity = 255;
        };
        if (Model.teasure.isUnlockType(this.typeId)) {
            let equip = CTreasureData.Instance.getEquip(this.typeId);
            if (equip && _TeasureConfig.Instance.get(equip)) {
                let icon = _TeasureConfig.Instance.get(equip).icon;
                this.setIcon(icon);
                this.iconSprite.node.opacity = 255;
                this.iconSprite.node.width = 100;
                this.iconSprite.node.height = 100;
                this.iconSprite.node.y = 6;
            }
            else {
                this.setIcon("teasureAdd");
                resetIcon();
            }
        }
        else {
            this.setIcon("teasureAdd");
            resetIcon();
        }
    }
    start() { }
}
