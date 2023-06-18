import { GlobalEventName } from "../common/Events";
import BattleWorld from "../battle/BattleWorld";
import TreasureBase from "./TreasureBase";
import PartnerModel from "../../ccstudio/data/PartnerModel";
import Model from "../../ccstudio/data/Model";
import _TeasureConfig from "../../ccstudio/config/_TeasureConfig";
import CTreasureData from "./CTreasureData";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CTreasure0005 extends TreasureBase {
    skillIdx = -1;
    isUseSkill() {
        const effectParams = _TeasureConfig.Instance.get(this.treasureId).effectParams;
        const t = effectParams[0];
        const n = effectParams[1];
        return Model.partner.getEquipTagCnt(t) >= n;
    }
    onActive() {
        if (this.isActive) {
            if (this.isUseSkill()) {
                const effectParams = _TeasureConfig.Instance.get(this.treasureId).effectParams;
                const t = effectParams[0];
                const n = effectParams[1];
                const o = effectParams[2];
                const CTreasureData = CTreasureData.Instance.getData(this.treasureId);
                this.skillIdx = BattleWorld.Instance.skillCtrl.addCusSkill(t, Number(CTreasureData.effectValue), this.skillIdx);
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
                const effectParams = _TeasureConfig.Instance.get(this.treasureId).effectParams;
                const t = effectParams[0];
                const n = effectParams[1];
                const o = effectParams[2];
                const CTreasureData = CTreasureData.Instance.getData(this.treasureId);
                if (BattleWorld.Instance.skillCtrl.getSkillData(this.skillIdx)) {
                    BattleWorld.Instance.skillCtrl.updateCustomSkill(t, Number(CTreasureData.effectValue), this.skillIdx);
                }
                else {
                    this.skillIdx = BattleWorld.Instance.skillCtrl.addCusSkill(t, Number(CTreasureData.effectValue), this.skillIdx);
                }
            }
            else {
                BattleWorld.Instance.skillCtrl.removeCustomSkill(this.skillIdx);
            }
        }
    }
    recalc() {
        if (this.isActive) {
            const e = _TeasureConfig.Instance.get(this.treasureId);
            const t = CTreasureData.Instance.getData(this.treasureId);
            const effectParams = e.effectParams;
            const o = effectParams[0];
            BattleWorld.Instance.skillCtrl.updateCustomSkill(o, Number(t.effectValue), this.skillIdx);
        }
    }
}
