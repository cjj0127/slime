import RelicBase from "./RelicBase";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
import RelicData_ from "./RelicData_";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
;
// import RelicBase from 'RelicBase';
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0001 extends RelicBase {
    public use() {
        const effectSkill = _RelicConfig.Instance.getEffectSkill(this.relicId);
        var duration = _SkillConfig.Instance.get(effectSkill).duration;
        let repeatCount = 1;
        if (this.isActive) {
            const RelicData_ = RelicData_.Instance.getData(this.relicId);
            repeatCount = 2;
            duration += Number(RelicData_.effectValue);
        }
        return {
            repeatCount,
            duration
        };
    }
}
