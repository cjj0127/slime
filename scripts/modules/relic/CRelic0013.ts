import BattleWorld from "../battle/BattleWorld";
import RelicBase from "./RelicBase";
import PartnerModel from "../../ccstudio/data/PartnerModel";
import Model from "../../ccstudio/data/Model";
import PropAddationEventTarget from "../common/PropAddation";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
import RelicData_ from "./RelicData_";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0013 extends RelicBase {
    addation: PropAddationEventTarget = null;
    @property
    relicId: number = 0;
    onActive() {
        const e = _RelicConfig.Instance.get(this.relicId).effectParams;
        const t = e[0];
        const n = e[1];
        const o = e[2];
        let r = 1;
        if (this.isActive) {
            r = o;
            if (this.addation == null) {
                this.addation = new PropAddationEventTarget();
                this.addation.setProp(n);
            }
            const i = RelicData_.Instance.getData(this.relicId);
            this.addation.value = i.effectValue;
            this.addation.active();
        }
        else {
            this.addation.disable();
        }
        Model.partner.setPartnerViewScale(t, r);
        const p = BattleWorld.Instance.getEquipTagPartners(t);
        p.forEach((e) => {
            e.setViewScale(r);
        });
    }
    recalc() {
        if (this.addation) {
            const e = RelicData_.Instance.getData(this.relicId);
            this.addation.value = e.effectValue;
        }
    }
}
