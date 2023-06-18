import TreasureBase from "./TreasureBase";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import CTreasureData from "./CTreasureData";
// import TreasureBase from "TreasureBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CTreasure0007 extends TreasureBase {
    treasureId: any;
    use(): {
        calcHurt: (v: number) => number;
    } {
        let effectFunc = (v: number) => v;
        if (this.isActive) {
            const data = CTreasureData.Instance.getData(this.treasureId);
            effectFunc = (v: number) => NumberPlus.add(v, data.effectValue);
        }
        return {
            calcHurt: effectFunc
        };
    }
}
