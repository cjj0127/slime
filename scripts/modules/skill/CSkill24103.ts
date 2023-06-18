import { SPINE_DATA_PATH_, SPINE_DATA_EFFECT_, GamePrefabs_ } from "../common/Const";
import { ISkill } from "../battle/ISkill";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import AssetPool from "../asset/AssetPool";
import AsyncQueueTool from "../../ccstudio/utils/AsyncQueueTool";
import Game from "../Game";
const _: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class CSkill24103 extends ISkill {
    animQueue = null;
    bullets = [];
    @property
    posHeight = 500;
    @property(sp.Skeleton)
    spMogu = null;
    clearAnims() {
        _.each(this.bullets, (e) => {
            e.node.stopAllActions();
            e.setCompleteListener(null);
            AssetPool.Instance.put(e);
        });
        this.bullets.length = 0;
    }
    async createBullet() {
        let e = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, GamePrefabs_.SkillBullet24103.path);
        e.parent = this.node;
        return e.getComponent(sp.Skeleton);
    }
    onClear() {
        this.clearAnims();
        this.spMogu.setCompleteListener(null);
        this.unscheduleAllCallbacks();
    }
    onInit() {
        this.node.position = cc.Vec3.ZERO;
        this.rsetPos();
    }
    // @property(sp.Skeleton)
    // spMogu: sp.Skeleton = null;
    // @property(cc.Integer)
    // posHeight: number = 0;
    onLoad() {
        this.spMogu.skeletonData = AssetManager.Instance.getSkeleton(NAMES_BUNDLE.Game, SPINE_DATA_PATH_, SPINE_DATA_EFFECT_);
    }
    onPlay(e) {
        this.rsetPos();
        this.clearAnims();
        this.spMogu.setAnimation(0, "mogu_fly", true);
        this.animQueue = new AsyncQueueTool();
        this.animQueue.push(this.playFly.bind(this));
        this.animQueue.complete = e;
        this.animQueue.play();
    }
    playDownAnim() {
        const moveUp = cc.moveBy(0.5, cc.v2(0, this.posHeight));
        const moveDown = cc.moveBy(0.5, cc.v2(0, -this.posHeight));
        const seq = cc.sequence(moveUp, moveDown);
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].runAction(seq.clone());
        }
    }
    async playFire() {
        let e: any = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, GamePrefabs_.SkillBullet24103.path);
        e.parent = this.node;
        let spE = e.getComponent(sp.Skeleton);
        this.bullets.push(spE);
        let t = this.spMogu.node.position;
        let n = cc.v3(this.spMogu.node.x + 100, this.getOwner().node.y, 0);
        let o = n.sub(t);
        e.node.angle = Math.atan2(o.y, o.x) * cc.macro.DEG;
        e.node.setPosition(t);
        e.node.setSiblingIndex(0);
        cc.tween(e.node).call(() => {
            e.node.position = this.spMogu.node.position;
            e.enabled = true;
            e.setAnimation(0, "mogu_flyzidan", true);
            e.timeScale = Game.Instance.globalSpeed;
        }).to(.3 / Game.Instance.globalSpeed, {
            position: n
        }, {
            easing: cc.easing.sineOut
        }).call(() => {
            this.hurt(e.node.position);
            this.playSound(this.skillCfg.bombSound);
            e.node.angle = 0;
            e.setAnimation(0, "explosion3", false);
            e.timeScale = Game.Instance.globalSpeed;
            e.setCompleteListener(() => {
                let t = this.bullets.indexOf(e);
                if (t >= 0) {
                    _.pullAt(this.bullets, [t]);
                }
                AssetPool.Instance.put(e);
                e.setCompleteListener(null);
            });
        }).start();
    }
    async playFly(e) {
        this.spMogu.node.stopAllActions();
        let t = 2 * this.skillCfg.duration;
        t /= Game.Instance.globalSpeed;
        cc.tween(this.spMogu.node).to(t, {
            position: cc.v3(this.getOwner().node.x + 2 * cc.winSize.width, this.spMogu.node.position.y, 0)
        }).call(() => {
            e();
        }).start();
        let n = this.skillCfg.duration / 2 / this.skillCfg.tiggerCnt;
        this.schedule(this.playFire, n, this.skillCfg.tiggerCnt - 1, 2 * n);
    }
    rsetPos() {
        this.spMogu.node.position = cc.v3(this.getOwner().node.position.x - 300, this.getOwner().node.position.y + this.posHeight);
    }
    start() {
        this.schedule(this.createBullet, 0.5);
        this.schedule(this.playDownAnim, 1.5);
    }
}
