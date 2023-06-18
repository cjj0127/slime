import RelicBase from "./RelicBase";
import { GlobalEventName } from "../common/Events";
import PartnerModel from "../../ccstudio/data/PartnerModel";
import Model from "../../ccstudio/data/Model";
import PropAddationEventTarget from "../common/PropAddation";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
import RelicData_ from "./RelicData_";
// import RelicBase from "RelicBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0022 extends RelicBase {
    private addation: PropAddationEventTarget = null;
    public activePop(): void {
        const relicCfg = _RelicConfig.Instance.get(this.relicId);
        const RelicData_ = RelicData_.Instance.getData(this.relicId);
        const effectParams = relicCfg.effectParams;
        const equipmentTag = effectParams[0];
        const equipCount = effectParams[1];
        const propType = effectParams[2];
        if (!this.addation) {
            this.addation = new PropAddationEventTarget();
            this.addation.setProp(propType);
        }
        this.addation.value = RelicData_.effectValue;
        this.addation.active();
    }
    public isTakeEffect(): boolean {
        const effectParams = _RelicConfig.Instance.get(this.relicId).effectParams;
        const equipTag = effectParams[0];
        const equipCount = effectParams[1];
        effectParams[2];
        return Model.partner.getEquipTagCnt(equipTag) >= equipCount;
    }
    public onActive(): void {
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
    public onChangePartner(): void {
        if (this.isTakeEffect()) {
            this.activePop();
        }
        else if (this.addation) {
            this.addation.disable();
        }
    }
    public recalc(): void {
        const RelicData_ = RelicData_.Instance.getData(this.relicId);
        if (this.addation) {
            this.addation.value = RelicData_.effectValue;
        }
    }
}
