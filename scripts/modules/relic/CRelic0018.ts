import RelicBase from "./RelicBase";
import { GlobalEventName } from "../common/Events";
import BattleWorld from "../battle/BattleWorld";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
// import RelicBase from "RelicBase";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0018 extends RelicBase {
    private skillIdx: number = -1;
    onActive() {
        if (this.isActive) {
            cc.director.on(GlobalEventName.ReleaseSkill, this.onReleaseSkill, this);
            cc.director.on(GlobalEventName.BattleStart, this.onBattleStart, this);
            cc.director.on(GlobalEventName.BattleComplete, this.onBattleComplete, this);
        }
        else {
            cc.director.targetOff(this);
        }
    }
    onBattleComplete() {
        BattleWorld.Instance.skillCtrl.removeCustomSkill(this.skillIdx);
    }
    onBattleStart() {
        const relicCfg = _RelicConfig.Instance.get(this.relicId);
        this.skillIdx = BattleWorld.Instance.skillCtrl.addCusSkill(relicCfg.skillId, 1000, this.skillIdx);
    }
    onReleaseSkill(skillType: number, idx: number) {
        if (!BattleWorld.Instance.skillCtrl.isSlotsSkill(skillType, idx) && this.skillIdx == idx) {
            BattleWorld.Instance.skillCtrl.removeCustomSkill(this.skillIdx);
        }
    }
}
