import TreasureBase from "./TreasureBase";
import PartnerModel from "../../ccstudio/data/PartnerModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import _TeasureConfig from "../../ccstudio/config/_TeasureConfig";
import CTreasureData from "./CTreasureData";
// import TreasureBase from "TreasureBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CTreasure0006 extends TreasureBase {
    isTakeEffect() {
        const effectParams = _TeasureConfig.Instance.get(this.treasureId).effectParams;
        const tagType = effectParams[0];
        const tagCount = effectParams[1];
        return Model.partner.getEquipTagCnt(tagType) >= tagCount;
    }
    use() {
        let calcHurt = function (num: number) {
            return num;
        };
        if (this.isActive && this.isTakeEffect()) {
            const CTreasureData = CTreasureData.Instance.getData(this.treasureId);
            calcHurt = function (num: number) {
                return NumberPlus.add(num, NumberPlus.div(NumberPlus.mul(num, CTreasureData.effectValue), 100));
            };
        }
        return {
            calcHurt
        };
    }
}
