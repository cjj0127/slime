import TreasureBase from "./TreasureBase";
import PropAddationEventTarget from "../common/PropAddation";
import _TeasureConfig from "../../ccstudio/config/_TeasureConfig";
import CTreasureData from "./CTreasureData";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CTreasure0003 extends TreasureBase {
    private addation: PropAddationEventTarget = null;
    public activePop(): void {
        const e = _TeasureConfig.Instance.get(this.treasureId);
        const t = CTreasureData.Instance.getData(this.treasureId);
        const n = e.effectParams[0];
        if (this.addation == null) {
            this.addation = new PropAddationEventTarget();
            this.addation.setProp(n);
        }
        this.addation.value = t.effectValue;
        this.addation.active();
    }
    public onActive(): void {
        if (this.isActive) {
            this.activePop();
        }
        else {
            this.addation && this.addation.disable();
        }
    }
    public recalc(): void {
        const e = CTreasureData.Instance.getData(this.treasureId);
        this.addation && (this.addation.value = e.effectValue);
    }
}
