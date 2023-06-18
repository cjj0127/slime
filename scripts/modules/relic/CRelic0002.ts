import { GlobalEventName } from "../common/Events";
import BattleWorld from "../battle/BattleWorld";
import RelicBase from "./RelicBase";
import PartnerModel from "../../ccstudio/data/PartnerModel";
import Model from "../../ccstudio/data/Model";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
import RelicData_ from "./RelicData_";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0002 extends RelicBase {
    private skillIdx: number = -1;
    isUseSkill(): boolean {
        const e = _RelicConfig.Instance.get(this.relicId).effectParams;
        const t = e[0];
        const n = e[1];
        return Model.partner.getEquipTagCnt(t) >= n;
    }
    onActive() {
        if (this.isActive) {
            if (this.isUseSkill()) {
                const e = _RelicConfig.Instance.get(this.relicId);
                const t = RelicData_.Instance.getData(this.relicId);
                this.skillIdx = BattleWorld.Instance.skillCtrl.addCusSkill(e.skillId, Number(t.effectValue), this.skillIdx);
            }
        }
        else {
            BattleWorld.Instance.skillCtrl.removeCustomSkill(this.skillIdx);
        }
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        cc.director.on(GlobalEventName.PartnerEquipedChange, this.onPartnerEquipedChange, this);
    }
    onPartnerEquipedChange() {
        if (this.isActive) {
            if (this.isUseSkill()) {
                const e = _RelicConfig.Instance.get(this.relicId);
                const t = RelicData_.Instance.getData(this.relicId);
                if (BattleWorld.Instance.skillCtrl.getSkillData(this.skillIdx)) {
                    BattleWorld.Instance.skillCtrl.updateCustomSkill(e.skillId, Number(t.effectValue), this.skillIdx);
                }
                else {
                    this.skillIdx = BattleWorld.Instance.skillCtrl.addCusSkill(e.skillId, Number(t.effectValue), this.skillIdx);
                }
            }
            else {
                BattleWorld.Instance.skillCtrl.removeCustomSkill(this.skillIdx);
            }
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
