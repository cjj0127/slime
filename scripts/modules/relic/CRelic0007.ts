import RelicBase from "./RelicBase";
import PropAddationEventTarget from "../common/PropAddation";
import RelicData_ from "./RelicData_";
import { ENUM_PROP_TYPE } from "../common/Const";
// import RelicBase from "RelicBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0007 extends RelicBase {
    @property
    addation: PropAddationEventTarget = null;
    recalc() {
        if (this.addation) {
            let e = RelicData_.Instance.getData(this.relicId);
            this.addation.value = e.effectValue;
        }
    }
    stop() {
        if (this.addation) {
            this.addation.disable();
        }
    }
    use() {
        if (this.isActive) {
            if (globalThis._.isNil(this.addation)) {
                this.addation = new PropAddationEventTarget();
                this.addation.setProp(ENUM_PROP_TYPE.PartnerAspd);
            }
            let e = RelicData_.Instance.getData(this.relicId);
            this.addation.value = e.effectValue;
            this.addation.active();
        }
    }
}
