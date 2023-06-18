import RelicBase from "./RelicBase";
import { GlobalEventName } from "../common/Events";
import BattleWorld from "../battle/BattleWorld";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
// import RelicBase from 'RelicBase';
const { ccclass, property } = cc._decorator;
@ccclass
export default class CRelic0006 extends RelicBase {
    private usedCount: number = 0;
    onActive(): void {
        if (this.isActive) {
            this.usedCount = 0;
            cc.director.on(GlobalEventName.HeroHpChange, this.onHeroHpChange, this);
            cc.director.on(GlobalEventName.BattleStart, this.onBattleStart, this);
        }
        else {
            cc.director.targetOff(this);
        }
    }
    private onBattleStart(): void {
        this.usedCount = 0;
    }
    onDisable(): void {
        cc.director.targetOff(this);
    }
    private onHeroHpChange(e: number, t: number): void {
        if (this.usedCount == 0 && NumberPlus.percent(e, t) < 0.5) {
            this.usedCount++;
            BattleWorld.Instance.skillCtrl.resetSkillCd();
        }
    }
}
