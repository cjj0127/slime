import { GamePrefabs_ } from "../common/Const";
import { ISkill } from "../battle/ISkill";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetPool from "../asset/AssetPool";
import AsyncQueueTool from "../../ccstudio/utils/AsyncQueueTool";
import BattleWorld from "../battle/BattleWorld";
import Game from "../Game";
import RelicModel from "../../ccstudio/data/RelicModel";
import Model from "../../ccstudio/data/Model";
import Utils_ from "../../ccstudio/utils/Utils";
const m: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class CSkill24101 extends ISkill {
    animQueue: AsyncQueueTool = null;
    bullets: any[] = [];
    clearAnims() {
        m.each(this.bullets, e => {
            e.setCompleteListener(null);
            e.node.stopAllActions();
            AssetPool.Instance.put(e);
        });
        this.bullets.length = 0;
    }
    async createBullet() {
        let e = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, GamePrefabs_.SkillBullet24101.path);
        e.parent = this.node;
        let t = e.getComponent(sp.Skeleton);
        this.bullets.push(t);
        return t;
    }
    async fire(e) {
        const t = await this.createBullet();
        const o = BattleWorld.Instance.getAllEnemyRang();
        let r = o.maxX && o.maxX > this.getOwner().node.x ? Utils_.getRandomRange(this.getOwner().node.x, o.maxX) : Utils_.getRandomRange(this.getOwner().node.x, this.getOwner().node.x + 300);
        t.node.active = true;
        t.node.position = new cc.Vec3(r, this.getOwner().node.y + 500, 0);
        t.setAnimation(0, "luoshi", true);
        t.timeScale = Game.Instance.globalSpeed;
        t.node.stopAllActions();
        const i = this.getOwner().node.y;
        cc.tween(t.node).to(0.5, {
            position: cc.v3(r + 150, i, 0)
        }).call(() => {
            let n = t.node.position;
            t.setAnimation(0, "luoshi_close", false);
            t.setCompleteListener(() => {
                t.setCompleteListener(null);
                this.putBackBullet(t);
                AssetPool.Instance.put(t);
                e && e();
            });
            this.playExplode(t.node.convertToWorldSpaceAR(cc.Vec3.ZERO));
            this.hurt(n);
            this.playSound(this.skillCfg.bombSound);
        }).start();
    }
    onClear() {
        this.unscheduleAllCallbacks();
        this.clearAnims();
        if (this.animQueue)
            this.animQueue.clear();
    }
    onInit() {
        this.node.position = cc.Vec3.ZERO;
    }
    onPlay(e) {
        this.clearAnims();
        this.animQueue = new AsyncQueueTool();
        this.animQueue.push(this.playFire.bind(this));
        this.animQueue.complete = e;
        this.animQueue.play();
    }
    async playFire() {
        let t = this.skillCfg.tiggerCnt;
        let n = Model.relic.applySkill(this.skillCfg.id);
        if (n)
            t += Math.floor(n);
        let o = this.skillCfg.duration / t;
        o /= Game.Instance.globalSpeed;
        let r = 0;
        const i = () => {
            ++r == t && this.animQueue.step();
        };
        for (let j = 0; j < t - 1; j++) {
            await this.createBullet();
            this.fire(i);
            await this.animQueue.step();
        }
        await this.createBullet();
        this.fire(() => {
            this.animQueue && this.animQueue.step();
        });
    }
    putBackBullet(e) {
        let t = this.bullets.indexOf(e);
        if (t >= 0)
            m.pullAt(this.bullets, [t]);
    }
}
