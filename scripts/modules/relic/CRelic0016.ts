import RelicBase from "./RelicBase";
import { GlobalEventName } from "../common/Events";
import BattleWorld from "../battle/BattleWorld";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import RelicData_ from "./RelicData_";
// import RelicBase from "RelicBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0016 extends RelicBase {
    onActive() {
        if (this.isActive) {
            cc.director.on(GlobalEventName.HeroHpChange, this.onHeroHpChange, this);
        }
        else {
            cc.director.targetOff(this);
        }
    }
    onHeroHpChange(e: any, t: any, n: any) {
        if (NumberPlus.compare(n, e)) {
            let o = RelicData_.Instance.getData(this.relicId);
            BattleWorld.Instance.skillCtrl.subSkillCdWithCount(1, Number(o.effectValue));
        }
    }
}
