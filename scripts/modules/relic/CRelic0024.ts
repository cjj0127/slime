import RelicBase from "./RelicBase";
import PropAddationEventTarget from "../common/PropAddation";
import RelicData_ from "./RelicData_";
import { ENUM_PROP_TYPE } from "../common/Const";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
// import RelicBase from "RelicBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0024 extends RelicBase {
    private addation: PropAddationEventTarget = null;
    onActive() {
        if (this.isActive) {
            if (typeof this.addation == "undefined" || this.addation == null) {
                _RelicConfig.Instance.get(this.relicId);
                this.addation = new PropAddationEventTarget();
                this.addation.setProp(ENUM_PROP_TYPE.EnemyDamagePercent);
            }
            const e = RelicData_.Instance.getData(this.relicId);
            this.addation.value = NumberPlus.sub(100, e.effectValue);
            this.addation.active();
        }
        else {
            if (typeof this.addation !== "undefined" && this.addation !== null) {
                this.addation.disable();
            }
        }
    }
    recalc() {
        if (this.addation) {
            const e = RelicData_.Instance.getData(this.relicId);
            this.addation.value = NumberPlus.sub(100, e.effectValue);
        }
    }
}
