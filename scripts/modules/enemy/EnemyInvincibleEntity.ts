import { EntityBase, EEntityEvent } from "../battle/EntityBase";
import _EnemyConfig from "../../ccstudio/config/_EnemyConfig";
import HpMgr from "../battle/HpMgr";
// import HpMgr from "HpMgr";
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("Enemy/EnemyEntity")
export default class EnemyInvincibleEntity extends EntityBase {
    public dodecHp(damage: number, showText: boolean = false): void {
        this.emitEntityEvent(EEntityEvent.Hurt, damage);
        HpMgr.addHpDamage(this.body.node, damage, showText);
    }
    public getHurtEffect(): string {
        return _EnemyConfig.Instance.get(this.cfgId).hurtEffect;
    }
    onActive(): void { }
    onDead_(): void { }
    onHpChanged(): void { }
    onRemove(): void { }
}
