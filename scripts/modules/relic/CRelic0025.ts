import RelicBase from "./RelicBase";
import { GlobalEventName } from "../common/Events";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
import PropAddationEventTarget from "../common/PropAddation";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
// import RelicBase from 'RelicBase';
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0025 extends RelicBase {
    private addation: PropAddationEventTarget = null;
    onActive() {
        if (this.isActive) {
            if (!this.addation) {
                const effectParams = _RelicConfig.Instance.get(this.relicId).effectParams[0];
                this.addation = new PropAddationEventTarget();
                this.addation.setProp(effectParams);
            }
            this.addation.value = Model.user.getHeroHp();
            this.addation.active();
            cc.director.on(GlobalEventName.HeroMaxHpChange, this.onMaxHpChange, this);
        }
        else {
            this.addation.disable();
            cc.director.targetOff(this);
        }
    }
    onMaxHpChange() {
        if (this.addation) {
            this.addation.value = Model.user.getHeroHp();
        }
    }
}
