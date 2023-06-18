import BattleWorld from "../battle/BattleWorld";
import RelicBase from "./RelicBase";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
import RelicData_ from "./RelicData_";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0004 extends RelicBase {
    skillIdx = -1;
    onActive() {
        if (this.isActive) {
            const e = _RelicConfig.Instance.get(this.relicId);
            const t = RelicData_.Instance.getData(this.relicId);
            this.skillIdx = BattleWorld.Instance.skillCtrl.addCusSkill(e.skillId, Number(t.effectValue), this.skillIdx);
        }
        else {
            BattleWorld.Instance.skillCtrl.removeCustomSkill(this.skillIdx);
        }
    }
    recalc() {
        if (this.isActive) {
            const e = _RelicConfig.Instance.get(this.relicId);
            const t = RelicData_.Instance.getData(this.relicId);
            BattleWorld.Instance.skillCtrl.updateCustomSkill(e.skillId, Number(t.effectValue), this.skillIdx);
        }
    }
}
;
