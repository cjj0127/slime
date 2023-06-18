import RelicBase from "./RelicBase";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import RelicData_ from "./RelicData_";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0015 extends RelicBase {
    @property
    relicId: number = 0;
    use(): {
        calcHurt: (num: number) => number;
    } {
        let effectFunc = (num: number) => num;
        if (this.isActive) {
            const data = RelicData_.Instance.getData(this.relicId);
            effectFunc = (num: number) => NumberPlus.add(num, data.effectValue);
        }
        return {
            calcHurt: effectFunc,
        };
    }
}
