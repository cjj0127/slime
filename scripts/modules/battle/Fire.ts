import { E_ENTITY_GROUP, GamePrefabs_ } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetPool from "../asset/AssetPool";
import SoundPlayerComp from "../../ccstudio/utils/SoundPlayerComp";
import BattleWorld from "./BattleWorld";
import _BulletConfig from "../../ccstudio/config/_BulletConfig";
import HurtView from "./HurtView";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
const _: any = window['_'];
const { ccclass, property } = cc._decorator;
@ccclass
export default class Fire extends cc.Component {
    static Instance: Fire;
    bulletId: number = 0;
    owner: any = null;
    targetGroupId: number = E_ENTITY_GROUP.Enemy;
    explode(pos: cc.Vec3 | cc.Vec2, t: number, n: number, o: number, r: boolean, i: ((arg: unknown) => void) | null): void {
        const s = BattleWorld.Instance.getRangTragets(pos, n, t);
        _.each(s, (e) => {
            this.hurt(e, o, r, i);
        });
    }
    public async fire(e: {
        groupId: number;
    }, t: (arg: number) => number): Promise<void> {
        this.targetGroupId = e.groupId;
        const n = this.owner.calcCriticalDamage_(this.owner.damage);
        let o = n.damage;
        const r = n.critical;
        switch (this.owner.groupId) {
            case E_ENTITY_GROUP.HERO:
                o = Model.user.calcNormalDamage(o);
                break;
            case E_ENTITY_GROUP.Enemy:
                o = o = Model.user.calcEnemyDamage(o);
        }
        if (t)
            o = t(o);
        if (this.bulletId > 0) {
            await this.fireBullet(e, o, r);
        }
        else {
            const i = this.owner.getHurtEffect();
            this.hurt(e as any, o, r, i);
        }
    }
    async fireBullet(e: {
        groupId: number;
    }, t: number, n: boolean): Promise<void> {
        const o = _BulletConfig.Instance.get(this.bulletId);
        const r = await BattleWorld.Instance.createBullet(this.bulletId, this.node.convertToWorldSpaceAR(cc.Vec3.ZERO));
        r.delegate = this;
        r.damage = t;
        r.critical = n;
        r.node.scale = o.multi;
        r.target = e;
        r.run();
        this.playSound(o.fireSound);
    }
    hurt(e: any, t: number, n: boolean, o: any): void {
        if (e && e.checkAlive()) {
            e.view.playHit();
            let r = t;
            if (e.isBoss) {
                r = Model.user.calcBossDamage(t);
            }
            this.playHurtEffect(e, o);
            e.dodecHp(r, n);
            if (this.bulletId > 0) {
                const i = _BulletConfig.Instance.get(this.bulletId);
                this.playSound(i.hurtSound);
            }
            else {
                this.playSound("hurt");
            }
        }
    }
    public onBulletBomb(e: {
        range: number;
        bombView: any;
        target: any;
        damage: number;
        critical: boolean;
        node: cc.Node;
    }): void {
        const { range, bombView, target, damage, critical } = e;
        if (range > 0) {
            this.explode(e.node.position, this.targetGroupId, range, damage, critical, bombView);
        }
        else {
            this.hurt(target, damage, critical, bombView);
        }
    }
    onLoad() {
        Fire.Instance = this;
    }
    async playHurtEffect(e: {
        body: {
            node: cc.Node;
        };
    }, t: string | null): Promise<void> {
        if (_.isEmpty(t))
            t = "normal_attack";
        const n = e.body.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
        const o = BattleWorld.Instance.getLayer(2);
        const i = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, GamePrefabs_.Hurt.path);
        i.parent = o;
        i.angle = 180 * Math.random();
        i.position = o.convertToNodeSpaceAR(n);
        i.getComponent(HurtView).play(t, () => {
            AssetPool.Instance.put(i);
        });
    }
    async playSound(e: any): Promise<void> {
        if (_.isEmpty(e))
            return;
        const t = "Audios/" + e!;
        await SoundPlayerComp.Instance.playEffect(t);
    }
}
