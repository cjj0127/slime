import { EntityBase, EEntityEvent } from "./EntityBase";
import { E_ENTITY_GROUP, E_ENEMY_TYPE } from "../common/Const";
import AssetPool from "../asset/AssetPool";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
const { ccclass, property, menu } = cc._decorator;
@ccclass
@menu('CustomComponent/HPBar')
export default class HpDisplay extends cc.Component {
    private _entity: EntityBase = null;
    hpBar: cc.ProgressBar = null;
    @property(cc.Sprite)
    hpBarBg: cc.Sprite = null;
    private hpBarBgWidth: number = 0;
    hpLabel: cc.Label = null;
    onDead_() {
        this.node.opacity = 0;
        this.hpBarBg.node.stopAllActions();
    }
    onDisable() {
        this._entity.node.targetOff(this);
        this.unregisterEvent();
    }
    onEnable() {
        let e = 0;
        if (this._entity.groupId == E_ENTITY_GROUP.Enemy && this._entity.enemyType == E_ENEMY_TYPE.House) {
            e = 255;
        }
        this.node.opacity = e;
        let t = this.entity.maxHp, n = this.entity.hp, o = NumberPlus.percent(n, t);
        this.refreshHp(o, n);
        this.hpBarBg.node.width = this.hpBarBgWidth * o;
        this.node.x = this.entity.node.x;
        this.node.y = this.entity.node.y + this.entity.body.node.y + 0.5 * this.entity.body.node.height + 20;
        this.registerEvent();
    }
    onHpChange(e, t) {
        this.node.opacity = 255;
        let n = NumberPlus.percent(t, this.entity.maxHp);
        this.hpBarBg.node.stopAllActions();
        cc.tween(this.hpBarBg.node).delay(0.06).to(0.18, {
            width: this.hpBarBgWidth * n
        }, {
            easing: cc.easing.sineIn
        }).start();
        this.refreshHp(n, t);
    }
    onLoad() {
        this.hpBar = this.node.getComponent(cc.ProgressBar);
        this.hpLabel = this.getComponentInChildren(cc.Label);
        this.hpBarBgWidth = this.hpBarBg.node.width;
    }
    onReborn() { }
    onRemove() {
        AssetPool.Instance.put(this);
    }
    onTargetMove() {
        this.node.x = this._entity.node.x;
    }
    refreshHp(e, t) {
        this.hpBar.progress = e;
        if (this.hpLabel) {
            this.hpLabel.string = NumberPlus.format(t);
        }
    }
    registerEvent() {
        this._entity.node.on(cc.Node.EventType.POSITION_CHANGED, this.onTargetMove, this);
    }
    public setEntity(entity: EntityBase) {
        this._entity = entity;
    }
    unregisterEvent() {
        this._entity.node.off(cc.Node.EventType.POSITION_CHANGED, this.onTargetMove, this);
    }
    constructor() {
        super();
    }
    get entity() {
        return this._entity;
    }
    set entity(e) {
        e.node.on(EEntityEvent.HpChanged, this.onHpChange, this);
        e.node.on(EEntityEvent.Dead, this.onDead_, this);
        e.node.on(EEntityEvent.Remove, this.onRemove, this);
        e.node.on(EEntityEvent.Reborn, this.onReborn, this);
        this._entity = e;
    }
}
