import AsyncQueueTool from "../../ccstudio/utils/AsyncQueueTool";
import BattleWorld from "./BattleWorld";
import _BulletConfig from "../../ccstudio/config/_BulletConfig";
import Fire from "./Fire";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
const { ccclass, property } = cc._decorator;
@ccclass
export default class SkillBulletProxy extends Fire {
    _running = false;
    damagePercent: any = "0";
    duration = 0;
    interval = 0;
    repeatCount = 1;
    repeatQueue = new AsyncQueueTool();
    runningTime = 0;
    runningTotalTime = 0;
    public appendFire(e: {
        bulletId: number;
        interval: number;
        duration: number;
        damagePercent: number;
        repeatCount: number;
    }): void {
        const t = e.bulletId, n = e.interval, o = e.duration, r = e.damagePercent, i = e.repeatCount;
        this.bulletId = t,
            this.damagePercent = r,
            this.repeatCount = i,
            this.interval = n,
            this.duration = o,
            this.runningTotalTime = 0,
            this.runningTime = 0,
            this._running = true;
    }
    private calcDamage(e: number): number {
        let t = this.owner.damage;
        t = NumberPlus.mul(t, e);
        return NumberPlus.div(t, 100);
    }
    public async doFire(): Promise<void> {
        this.owner = BattleWorld.Instance.hero;
        const e = BattleWorld.Instance.getRandomTarget();
        this.node.position = this.node.parent.convertToNodeSpaceAR(this.owner.fireProxy.node.convertToWorldSpaceAR(cc.Vec3.ZERO));
        if (e.length > 0) {
            if (this.repeatCount == 1) {
                this.fire(e[0]);
            }
            else {
                const n = e[0].node.position.add(cc.v3(15 * this.repeatCount, 0, 0));
                for (let o = 0; o < this.repeatCount; o++) {
                    this.repeatQueue.push(() => {
                        this.fire(e[0]);
                        n.subSelf(cc.v3(30, 0, 0));
                        this.scheduleOnce(() => { }, .03);
                    });
                }
                this.repeatQueue.play();
            }
        }
    }
    fire(e: any, t: any, a: any, b: any): void {
        this.targetGroupId = e.groupId;
        let n = this.calcDamage(this.damagePercent), o = this.owner.calcCriticalDamage_(n), r = o.damage, i = o.critical;
        r = Model.user.calcSkillDamage(r);
        if (t) {
            r = t(r);
        }
        if (this.bulletId > 0) {
            this.fireBullet(e, r, i);
        }
        else {
            const a = this.owner.getHurtEffect();
            this.hurt(e, r, i, a);
        }
    }
    public fixUpdate(e: number): void {
        if (this._running) {
            this.runningTime += e;
            this.runningTotalTime += e;
            if (this.runningTime >= this.interval) {
                this.runningTime -= this.interval;
                this.doFire();
                if (this.runningTotalTime >= this.duration) {
                    this._running = false;
                }
            }
        }
    }
    hurt(e: any, t: any, n: any, o: any): void {
        if (e && e.checkAlive()) {
            e.view.playHit();
            this.playHurtEffect(e, o);
            let r = t;
            if (e.isBoss) {
                r = Model.user.calcBossDamage(t);
            }
            e.dodecHp(r, n);
            if (this.bulletId > 0) {
                const i = _BulletConfig.Instance.get(this.bulletId);
                this.playSound(i.hurtSound);
            }
        }
    }
}
