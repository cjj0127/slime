import RelicBase from "./RelicBase";
import { GlobalEventName } from "../common/Events";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import PropAddationEventTarget from "../common/PropAddation";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0027 extends RelicBase {
    private addation: PropAddationEventTarget = null;
    calcValue() {
        const criticalChance = Model.user.getCriticalChance();
        return NumberPlus.compare(criticalChance, 100) ? NumberPlus.sub(criticalChance, 100) : '0';
    }
    onActive() {
        if (this.isActive) {
            if (!this.addation) {
                const effectParams = _RelicConfig.Instance.get(this.relicId).effectParams[0];
                this.addation = new PropAddationEventTarget();
                this.addation.setProp(effectParams);
            }
            this.addation.value = this.calcValue();
            this.addation.active();
            cc.director.on(GlobalEventName.HeroCriticalChanceChange, this.onCriticalChanceChange, this);
        }
        else {
            this.addation.disable();
            cc.director.targetOff(this);
        }
    }
    onCriticalChanceChange() {
        if (this.addation) {
            this.addation.value = this.calcValue();
        }
    }
}
