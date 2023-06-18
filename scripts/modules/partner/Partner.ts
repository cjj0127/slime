import { EntityBase } from "../battle/EntityBase";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import Utils_ from "../../ccstudio/utils/Utils";
const { ccclass, property } = cc._decorator;
@ccclass
export default class Partner extends EntityBase {
    calcCriticalDamage_(damage: number): {
        damage: number;
        critical: boolean;
    } {
        let t = false;
        const n = this.ai.follow;
        if (n.criticalChange < 100) {
            if (Utils_.randomNumber(100) <= n.criticalChange) {
                t = true;
                damage = NumberPlus.div(NumberPlus.mul(damage, n.criticalDamge), 100);
            }
        }
        else {
            t = true;
            damage = NumberPlus.div(NumberPlus.mul(damage, n.criticalDamge), 100);
        }
        return {
            damage: damage,
            critical: t,
        };
    }
    getHurtEffect(): string {
        return "";
    }
    onActive(): void { }
    onDead_(): void { }
    onHpChanged(): void { }
    onRemove(): void { }
}
