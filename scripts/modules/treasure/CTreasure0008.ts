import TreasureBase from "./TreasureBase";
import Model from "../../ccstudio/data/Model";
import _TeasureConfig from "../../ccstudio/config/_TeasureConfig";
import CTreasureData from "./CTreasureData";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CTreasure0008 extends TreasureBase {
    public isTakeEffect(): boolean {
        const effectParams = _TeasureConfig.Instance.get(this.treasureId).effectParams;
        const t = effectParams[0];
        const n = effectParams[1];
        return Model.partner.getEquipTagCnt(t) >= n;
    }
    public use(): any {
        return this.isActive && this.isTakeEffect() ? CTreasureData.Instance.getData(this.treasureId).effectValue : null;
    }
}
