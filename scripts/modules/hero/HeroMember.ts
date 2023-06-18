import { EntityBase } from "../battle/EntityBase";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import Utils_ from "../../ccstudio/utils/Utils";
// import EntityBase from 'EntityBase';
const { ccclass, property } = cc._decorator;
@ccclass
export default class HeroMember extends EntityBase {
    calcCriticalDamage_(e: number) {
        let t = false;
        const n = this.ai.follow;
        if (n.criticalChange < 100) {
            if (Utils_.randomNumber(100) <= n.criticalChange) {
                t = true;
                e = NumberPlus.div(NumberPlus.mul(e, n.criticalDamge), 100);
            }
        }
        else {
            t = true;
            e = NumberPlus.div(NumberPlus.mul(e, n.criticalDamge), 100);
        }
        return {
            damage: e,
            critical: t
        };
    }
    getHurtEffect() {
        return '';
    }
    onActive() { }
    onDead_() { }
    onHpChanged() { }
    onRemove() { }
}
