import TreasureBase from "./TreasureBase";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import CTreasureData from "./CTreasureData";
// import TreasureBase from "TreasureBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CTreasure0001 extends TreasureBase {
    public use() {
        let effectFunc = function (e: number) {
            return e;
        };
        if (this.isActive) {
            const CTreasureData = CTreasureData.Instance.getData(this.treasureId);
            effectFunc = function (e: number) {
                return NumberPlus.add(e, NumberPlus.div(NumberPlus.mul(e, CTreasureData.effectValue), 100));
            };
        }
        return {
            calcHurt: effectFunc
        };
    }
}
