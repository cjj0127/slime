import Hero from "./Hero";
import { GameConst } from "../common/Const";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import EntityBaseRuningComs from "../battle/EntityBaseRuningComs";
// import Hero from "Hero";
const { ccclass, property } = cc._decorator;
@ccclass
export default class HeroHPRecovery extends EntityBaseRuningComs {
    private _runningTime: number = 0;
    @property(Hero)
    hero: Hero = null;
    onEnter() {
        this._runningTime = 0;
        this.hero = this.getComponent(Hero);
    }
    onUpdate(dt: number) {
        this._runningTime += dt;
        if (this._runningTime >= GameConst.HP_RECOVERY_FRE) {
            this._runningTime -= GameConst.HP_RECOVERY_FRE;
            let hp = NumberPlus.add(this.hero.hp, this.hero.hpRecovery);
            let bonus = NumberPlus.div(NumberPlus.mul(this.hero.maxHp, this.hero.hpRecoveryRage), 100);
            hp = NumberPlus.add(hp, bonus);
            this.hero.hp = hp;
        }
    }
}
