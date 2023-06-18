import RelicBase from "./RelicBase";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import RelicData_ from "./RelicData_";
// import RelicBase from './RelicBase';
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0020 extends RelicBase {
    public use() {
        let effectFunc = function (e: number) {
            return e;
        };
        if (this.isActive) {
            let data = RelicData_.Instance.getData(this.relicId);
            effectFunc = function (e: number) {
                return NumberPlus.add(e, NumberPlus.div(NumberPlus.mul(e, data.effectValue), 100));
            };
        }
        return {
            calcHurt: effectFunc
        };
    }
}
