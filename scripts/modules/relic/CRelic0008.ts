import RelicBase from "./RelicBase";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
import RelicData_ from "./RelicData_";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class CRelic0008 extends RelicBase {
    public relicId: number;
    public use(): {
        cd: number;
    } {
        const effectSkill = _RelicConfig.Instance.getEffectSkill(this.relicId);
        let cd = _SkillConfig.Instance.get(effectSkill).cd;
        if (this.isActive) {
            const data = RelicData_.Instance.getData(this.relicId);
            cd *= 1 - _.toNumber(data.effectValue) / 100;
        }
        return {
            cd,
        };
    }
}
