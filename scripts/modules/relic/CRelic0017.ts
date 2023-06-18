import RelicBase from "./RelicBase";
import PropAddationEventTarget from "../common/PropAddation";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
import RelicData_ from "./RelicData_";
// import RelicBase from "RelicBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0017 extends RelicBase {
    private addation: PropAddationEventTarget = null;
    onActive(): void {
        if (this.isActive) {
            const e = _RelicConfig.Instance.get(this.relicId);
            const t = RelicData_.Instance.getData(this.relicId);
            const n = e.effectParams[0];
            if (globalThis._.isNil(this.addation)) {
                this.addation = new PropAddationEventTarget;
                this.addation.setProp(n);
            }
            this.addation.value = t.effectValue;
            this.addation.active();
        }
        else {
            this.addation?.disable();
        }
    }
    recalc(): void {
        const e = RelicData_.Instance.getData(this.relicId);
        this.addation.value = e.effectValue;
    }
}
