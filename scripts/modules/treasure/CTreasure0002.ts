import TreasureBase from "./TreasureBase";
import { GlobalEventName } from "../common/Events";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import PropAddationEventTarget from "../common/PropAddation";
import _TeasureConfig from "../../ccstudio/config/_TeasureConfig";
import CTreasureData from "./CTreasureData";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CTreasure0002 extends TreasureBase {
    private addation: PropAddationEventTarget = null;
    public activePop() {
        const e = _TeasureConfig.Instance.get(this.treasureId);
        const t = CTreasureData.Instance.getData(this.treasureId);
        const n = e.effectParams;
        const o = (n[0], n[1]);
        if (typeof globalThis !== 'undefined') {
            globalThis._;
        }
        if (!this.addation) {
            this.addation = new PropAddationEventTarget();
            this.addation.setProp(o);
        }
        const r = this.takeEffectCount();
        this.addation.value = NumberPlus.mul(r, t.effectValue),
            this.addation.active();
    }
    public onActive() {
        if (this.isActive) {
            this.activePop();
            cc.director.on(GlobalEventName.PartnerEquipedChange, this.onChangePartner, this);
        }
        else {
            if (this.addation) {
                this.addation.disable();
            }
            cc.director.targetOff(this);
        }
    }
    public onChangePartner() {
        const e = CTreasureData.Instance.getData(this.treasureId);
        const t = this.takeEffectCount();
        this.addation.value = NumberPlus.mul(t, e.effectValue);
    }
    public recalc() {
        const e = CTreasureData.Instance.getData(this.treasureId);
        const t = this.takeEffectCount();
        if (this.addation) {
            this.addation.value = NumberPlus.mul(t, e.effectValue);
        }
    }
    public takeEffectCount(): number {
        const e = _TeasureConfig.Instance.get(this.treasureId).effectParams;
        const t = e[0];
        return e[1],
            Model.partner.getEquipTagCnt(t);
    }
}
