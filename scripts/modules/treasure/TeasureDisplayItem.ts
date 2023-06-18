import ItemUIBase from "../common/ItemUIBase";
import { GlobalEventName } from "../common/Events";
import Model from "../../ccstudio/data/Model";
import _TeasureConfig from "../../ccstudio/config/_TeasureConfig";
import CTreasureData from "./CTreasureData";
const { ccclass, property } = cc._decorator;
@ccclass
export default class TeasureDisplayItem extends ItemUIBase {
    private typeId = 0;
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        cc.director.on(GlobalEventName.TreasureEquip, this.refresh, this);
    }
    onLoad() {
        this.refresh();
    }
    refresh() {
        if (Model.teasure.isUnlockType(this.typeId)) {
            const equip = CTreasureData.Instance.getEquip(this.typeId);
            if (equip && _TeasureConfig.Instance.get(equip)) {
                const icon = _TeasureConfig.Instance.get(equip).icon;
                this.setIcon(icon);
            }
            else {
                this.setIcon('teasureAdd');
            }
        }
        else {
            this.setIcon('teasureAdd');
        }
    }
}
