import RelicBase from "./RelicBase";
import PropAddationEventTarget from "../common/PropAddation";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
import RelicData_ from "./RelicData_";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0009 extends RelicBase {
    addation: PropAddationEventTarget = null;
    onActive() {
        if (this.isActive) {
            if (!this.addation) {
                const effectParams = _RelicConfig.Instance.get(this.relicId).effectParams[0];
                this.addation = new PropAddationEventTarget();
                this.addation.setProp(effectParams);
            }
            const data = RelicData_.Instance.getData(this.relicId);
            this.addation.value = data.effectValue;
            this.addation.active();
        }
        else {
            this.addation.disable();
        }
    }
    recalc() {
        if (this.addation) {
            const data = RelicData_.Instance.getData(this.relicId);
            this.addation.value = data.effectValue;
        }
    }
}
