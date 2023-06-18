import { E_ENTITY_GROUP, GamePrefabs_ } from "../common/Const";
import { ISkill } from "../battle/ISkill";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetPool from "../asset/AssetPool";
import AsyncQueueTool from "../../ccstudio/utils/AsyncQueueTool";
import BattleWorld from "../battle/BattleWorld";
import Game from "../Game";
import Utils_ from "../../ccstudio/utils/Utils";
const _: any = window["_"];
export default class CSkill1005 extends ISkill {
    animQueue = null;
    bullets = [];
    nextFunc = null;
    checkHit() {
        const e = BattleWorld.Instance.getScreenTargets(E_ENTITY_GROUP.Enemy);
        for (let t = 0; t < e.length; t++) {
            const n = e[t];
            const o = this.bullets[0];
            if (o && o.node.position.x - n.node.position.x < 20 && o.node.position.x - n.node.position.x > 0) {
                this.hurt(n.node.position);
                this.playSound(this.skillCfg.bombSound);
            }
        }
    }
    clearAnims() {
        this.bullets.forEach((e) => {
            e.node.stopAllActions();
            e.setCompleteListener(null);
            AssetPool.Instance.put(e);
        });
        this.bullets.length = 0;
    }
    async createBullet(e) {
        let t = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, e);
        t.parent = this.node.parent;
        return t.getComponent(sp.Skeleton);
    }
    onClear() {
        this.clearAnims();
        this.unscheduleAllCallbacks();
    }
    onInit() {
        this.node.position = this.getOwner().node.position;
    }
    onPlay(e) {
        this.clearAnims();
        this.animQueue = new AsyncQueueTool();
        this.animQueue.push(this.playRun.bind(this));
        this.animQueue.complete = e;
        this.animQueue.play();
        this.schedule(() => {
            this.checkHit();
        }, 0);
    }
    async playRun(e) {
        let t = 0;
        let n = this.getOwner().node;
        let o = n.position.y;
        this.schedule(async () => {
            let n;
            if (++t == 1) {
                n = await this.createBullet(GamePrefabs_.SkillBullet1005_1.path);
            }
            else {
                n = await this.createBullet(GamePrefabs_.SkillBullet1005.path);
            }
            this.bullets.push(n);
            o += 20 * Math.random();
            let r = 200 * Math.random();
            let i = cc.v3(this.node.position.x - r, o);
            let a = cc.v3(this.node.position.x - r + 2 * cc.winSize.width, o);
            n.node.setPosition(i);
            n.node.zIndex = -n.node.y;
            let l = Utils_.getRandomRange(1, 4);
            let p = "mogu" + l + "_run";
            if (t == 1) {
                p = "run";
            }
            n.setAnimation(0, p, true);
            n.timeScale = Game.Instance.globalSpeed;
            cc
                .tween(n.node)
                .to(2 / Game.Instance.globalSpeed, {
                position: a,
            })
                .call(() => {
                n.setCompleteListener(() => {
                    let e = this.bullets.indexOf(n);
                    if (e >= 0) {
                        _.pullAt(this.bullets, [e]);
                    }
                    AssetPool.Instance.put(n);
                    n.setCompleteListener(null);
                });
                if (t == 8) {
                    e();
                }
            })
                .start();
        }, 0.1, 7);
    }
}
