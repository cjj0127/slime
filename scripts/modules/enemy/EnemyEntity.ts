import { E_ENEMY_TYPE } from "../common/Const";
import { EntityBase } from "../battle/EntityBase";
import _EnemyConfig from "../../ccstudio/config/_EnemyConfig";
// import EntityBase from 'EntityBase';
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu("Enemy/EnemyEntity")
export default class EnemyEntity extends EntityBase {
    private _gold: string = "0";
    public enemyType: E_ENEMY_TYPE = E_ENEMY_TYPE.Normal;

    public getHurtEffect() {
        return _EnemyConfig.Instance.get(this.cfgId).hurtEffect;
    }
   
    public onActive() { }

    public onDead_() { }

    public onHpChanged() { }

    public onRemove() { }
    @property
    set gold(value: string) {
        this._gold = value;
    }
    get gold() {
        return this._gold;
    }
    get isBoss() {
        return this.enemyType !== E_ENEMY_TYPE.Normal;
    }
}
