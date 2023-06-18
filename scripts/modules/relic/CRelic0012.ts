import RelicBase from "./RelicBase";
import { GlobalEventName } from "../common/Events";
import BattleWorld from "../battle/BattleWorld";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
import RelicData_ from "./RelicData_";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0012 extends RelicBase {
    calcHurt(e: any) {
        const t = RelicData_.Instance.getData(this.relicId);
        return NumberPlus.div(NumberPlus.mul(e, t.effectValue), 100);
    }
    // isActive: boolean;
    onActive() {
        if (this.isActive) {
            cc.director.on(GlobalEventName.ReleaseSkill, this.onReleaseSkill, this);
        }
        else {
            cc.director.targetOff(this);
        }
    }
    onReleaseSkill(e: any, t: any) {
        if (this.isActive && BattleWorld.Instance.skillCtrl.isSlotsSkill(e, t)) {
            const o = _RelicConfig.Instance.get(this.relicId).effectParams[0];
            BattleWorld.Instance.getEquipTagPartners(o).forEach((e: any) => {
                const t = BattleWorld.Instance.getNearEnemys(e.node.position);
                if (t && t.checkAlive()) {
                    e.repeatAttack_(t, 3, e.ai.atkFre, this.calcHurt.bind(this));
                }
            });
        }
    }
}
