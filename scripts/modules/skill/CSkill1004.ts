import { SPINE_DATA_PATH_, SPINE_DATA_EFFECT_, GamePrefabs_ } from "../common/Const";
import { ISkill } from "../battle/ISkill";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import AssetPool from "../asset/AssetPool";
import AsyncQueueTool from "../../ccstudio/utils/AsyncQueueTool";
import BattleWorld from "../battle/BattleWorld";
import Game from "../Game";
const m: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class CSkill1004 extends ISkill {
    animQueue: any = null;
    bullets: any[] = [];
    nextFunc: any = null;
    @property(sp.Skeleton)
    sp: sp.Skeleton = null;
    clearAnims() {
        m.each(this.bullets, (e) => {
            e.stopAllActions();
            AssetPool.Instance.put(e);
        });
        this.bullets.length = 0;
    }
    async createBullet() {
        let e = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, GamePrefabs_.SkillBullet1004.path);
        e.parent = this.node.parent;
        return e;
    }
    onClear() {
        this.clearAnims();
        this.sp.setCompleteListener(null);
        this.unscheduleAllCallbacks();
    }
    onInit() {
        this.node.position = cc.v3(this.getOwner().node.position.x + 150, this.getOwner().node.position.y + 50);
        this.node.zIndex = -this.node.y;
    }
    onLoad() {
        this.sp.skeletonData = AssetManager.Instance.getSkeleton(NAMES_BUNDLE.Game, SPINE_DATA_PATH_, SPINE_DATA_EFFECT_);
    }
    onPlay(e) {
        this.clearAnims();
        this.animQueue = new AsyncQueueTool;
        this.animQueue.push(this.playOpen.bind(this));
        this.animQueue.complete = e;
        this.animQueue.play();
    }
    playAttack() {
        this.sp.setCompleteListener(null);
        this.sp.setAnimation(0, "man-eater_attack", true);
        this.schedule(this.playFire, 0.4);
    }
    playClose() {
        var e = this;
        this.unscheduleAllCallbacks();
        this.sp.setAnimation(0, "man-eater_close", false);
        this.sp.setCompleteListener(() => {
            e.nextFunc();
        });
    }
    async playFire() {
        try {
            const e = await this.createBullet();
            this.bullets.push(e);
            const t = this.node.y + 70;
            const n = cc.v3(this.node.position.x + 100, t);
            const o = BattleWorld.Instance.getNearEnemys(this.getOwner().node.position);
            const r = 1e3 * Game.Instance.globalSpeed;
            const i = o ? cc.v3(o.node.position.x, t) : cc.v3(this.node.position.x + cc.winSize.width / 2, t);
            let a = 0.05;
            let c = (i.x - n.x) / r;
            let l = Math.floor(c / a);
            if (c < 0 || l < 0) {
                c = 0.1;
                l = 1;
            }
            e.setPosition(n);
            a /= Game.Instance.globalSpeed;
            cc.tween(e).parallel(cc.tween().repeat(l, cc.rotateBy(a, 360)), cc.tween().to(c, {
                position: i
            })).call(() => {
                this.playExplode(e.convertToWorldSpaceAR(cc.Vec3.ZERO));
                this.hurt(e.position);
                this.playSound(this.skillCfg.bombSound);
                const t = this.bullets.indexOf(e);
                if (t >= 0) {
                    m.pullAt(this.bullets, [t]);
                }
                AssetPool.Instance.put(e);
            }).start();
        }
        catch (error) {
            console.error(error);
        }
    }
    playOpen(e) {
        this.nextFunc = e;
        this.sp.setAnimation(0, "man-eater_open", false);
        this.sp.setCompleteListener(this.playAttack);
        this.scheduleOnce(this.playClose, this.skillCfg.duration);
    }
}
