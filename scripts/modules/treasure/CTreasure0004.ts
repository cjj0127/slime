import TreasureBase from "./TreasureBase";
import PropAddationEventTarget from "../common/PropAddation";
import CTreasureData from "./CTreasureData";
import { GlobalEventName } from "../common/Events";
import Model from "../../ccstudio/data/Model";
import _TeasureConfig from "../../ccstudio/config/_TeasureConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CTreasure0004 extends TreasureBase {
    private addation: PropAddationEventTarget | null = null;
    activePop(): void {
        const treasureCfg = _TeasureConfig.Instance.get(this.treasureId);
        const CTreasureData = CTreasureData.Instance.getData(this.treasureId);
        const effectParams = treasureCfg.effectParams;
        const tagId = effectParams[0];
        const targetCnt = effectParams[1];
        const prop = effectParams[2];
        if (!this.addation) {
            this.addation = new PropAddationEventTarget();
            this.addation.setProp(prop);
        }
        this.addation.value = CTreasureData.effectValue;
        this.addation.active();
    }
    isTakeEffect(): boolean {
        const effectParams = _TeasureConfig.Instance.get(this.treasureId).effectParams;
        const tagId = effectParams[0];
        const targetCnt = effectParams[1];
        effectParams[2];
        return Model.partner.getEquipTagCnt(tagId) >= targetCnt;
    }
    onActive(): void {
        if (this.isActive) {
            if (this.isTakeEffect()) {
                this.activePop();
            }
            cc.director.on(GlobalEventName.PartnerEquipedChange, this.onChangePartner, this);
        }
        else {
            if (this.addation) {
                this.addation.disable();
            }
            cc.director.targetOff(this);
        }
    }
    onChangePartner(): void {
        if (this.isTakeEffect()) {
            this.activePop();
        }
        else if (this.addation) {
            this.addation.disable();
        }
    }
    recalc(): void {
        const CTreasureData = CTreasureData.Instance.getData(this.treasureId);
        if (this.addation) {
            this.addation.value = CTreasureData.effectValue;
        }
    }
}
