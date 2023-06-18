import ItemUIBase from "../common/ItemUIBase";
import { COLOR_WHITE, COLOR_GRAY } from "../common/Const";
// import ItemUIBase from "ItemUIBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class RelicDetailToggleUI extends ItemUIBase {
    @property(cc.Node)
    equipedFlg: cc.Node = null;
    @property
    relicId: number = 0;
    setEquipStatus(e: boolean) {
        this.equipedFlg.active = e;
    }
    setOwned(e: boolean) {
        if (e) {
            this.node.color = COLOR_WHITE;
            this.iconSprite.node.color = COLOR_WHITE;
        }
        else {
            this.node.color = COLOR_GRAY;
            this.iconSprite.node.color = COLOR_GRAY;
        }
    }
}
