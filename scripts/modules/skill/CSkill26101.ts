import { E_ENTITY_GROUP } from "../common/Const";
import { ISkill } from "../battle/ISkill";
import BattleWorld from "../battle/BattleWorld";
import EntityViewBase from "../battle/EntityViewBase";
import Game from "../Game";
import HurtView from "../battle/HurtView";
import RelicModel from "../../ccstudio/data/RelicModel";
import TeasureModel from "../../ccstudio/data/TeasureModel";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
const _: any = window["_"];
// n.default = m
const { ccclass, property } = cc._decorator;
@ccclass
export default class CSkill26101 extends ISkill {
    private effects: {
        [uid: string]: cc.Node;
    } = {};
    private hurtCount: number = 0;
    private intervalTime: number = 0;
    private running: boolean = false;
    private runnintTime: number = 0;
    private targets: EntityViewBase[] = [];
    public fireEnable(): boolean {
        const owner = this.getOwner();
        return BattleWorld.Instance.getXRangTragets(owner.node.position, this.skillCfg.range, E_ENTITY_GROUP.Enemy).length > 0;
    }
    private fireHurt(): void {
        const owner = this.getOwner();
        this.hurt(owner.node.position);
    }
    hurt(pos: cc.Vec3, t?: number): EntityViewBase[] {
        if (_.isNil(pos))
            pos = this.node.position;
        if (this.targets.length == 0)
            return [];
        let { damage, critical } = this.getOwner().calcCriticalDamage_(this.damage);
        damage = Model.user.calcSkillDamage(damage);
        let s: any = Model.relic.applySkill(this.skillCfg.id);
        if (s) {
            let a = _.get(s, "calcHurt");
            if (a)
                damage = a(damage);
        }
        s = Model.teasure.applySkill(this.skillCfg.id);
        if (s) {
            let a = _.get(s, "calcHurt");
            if (a)
                damage = a(damage);
        }
        _.each(this.targets, (e) => {
            if (e) {
                e.view.playHit(t);
                let hpDec = damage;
                if (e.isBoss)
                    hpDec = Model.user.calcBossDamage(damage);
                e.dodecHp(hpDec, critical);
                if (!e.checkAlive()) {
                    const effect = this.effects[e.uid];
                    if (effect) {
                        const duration = effect.getComponent(HurtView).getAnimationDuration("lianqie");
                        this.scheduleOnce(() => {
                            if (effect)
                                effect.getComponent(HurtView).stop();
                            delete this.effects[e.uid];
                        }, duration / 3);
                    }
                }
            }
        });
        return this.targets;
    }
    public lateUpdate(e: number): void {
        if (this.running) {
            this.runnintTime += e;
            if (this.runnintTime >= this.intervalTime) {
                this.runnintTime -= this.intervalTime;
                this.fireHurt();
                this.hurtCount++;
            }
            const owner = this.getOwner();
            const targets = BattleWorld.Instance.getXRangTragets(owner.node.position, this.skillCfg.range, E_ENTITY_GROUP.Enemy);
            if (targets.length > 0) {
                _.each(targets, async (e) => {
                    if (e && !this.effects[e.uid]) {
                        const body = e.body;
                        const worldPos = body.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
                        let scale = 0.8;
                        if (e.isBoss)
                            scale = 1;
                        const effect = await this.playEffect("lianqie", worldPos, 360 * Math.random(), scale);
                        this.effects[e.uid] = effect;
                    }
                });
            }
            if (this.hurtCount > this.skillCfg.tiggerCnt) {
                this.running = false;
                this._logicQueue.step();
            }
        }
    }
    public onClear(): void {
        this.effects = {};
        this.running = false;
    }
    public onInit(): void { }
    public onPlay(): void {
        const owner = this.getOwner();
        const targets = BattleWorld.Instance.getXRangTragets(owner.node.position, this.skillCfg.range, E_ENTITY_GROUP.Enemy);
        this.targets = targets;
        _.each(this.targets, async (t) => {
            if (t) {
                const body = t.body;
                const worldPos = body.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
                let scale = 0.8;
                if (t.isBoss)
                    scale = 1;
                const effect = await this.playEffect("lianqie", worldPos, 360 * Math.random(), scale);
                this.effects[t.uid] = effect;
            }
        });
        this.intervalTime = this.skillCfg.duration / this.skillCfg.tiggerCnt / Game.Instance.globalSpeed;
        this.runnintTime = 0;
        this.hurtCount = 0;
        this.running = true;
    }
}
