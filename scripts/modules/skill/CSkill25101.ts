import { GamePrefabs_ } from "../common/Const";
import { ISkill } from "../battle/ISkill";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetPool from "../asset/AssetPool";
import AsyncQueueTool from "../../ccstudio/utils/AsyncQueueTool";
import BattleWorld from "../battle/BattleWorld";
import Game from "../Game";
import Utils_ from "../../ccstudio/utils/Utils";
//     constructor() {
//         super();
//         this.posHeight = 0;
//     }
//     onInit() {
//         let e = cc.Vec3.ZERO;
//         e.y += this.posHeight;
//         this.node.position = e;
//         this.node.zIndex = cc.macro.MIN_ZINDEX;
//     }
//     onPlay(e: Function) {
//         this.clearAnims();
//         this.animQueue = new AsyncQueueTool();
//         this.animQueue.push(this.playFire.bind(this));
//         this.animQueue.complete = e;
//         this.animQueue.play();
//     }
//     onClear() {
//         this.clearAnims();
//         if (this.animQueue) {
//             this.animQueue.clear();
//         }
//         this.unscheduleAllCallbacks();
//     }
//     clearAnims() {
//         m.each(this.fires, (e: any) => {
//             e.node.stopAllActions();
//             e.setCompleteListener(null);
//             AssetPool.Instance.put(e);
//         });
//         this.fires.length = 0;
//     }
//     async playFire() {
//         let t = this.skillCfg.duration / this.skillCfg.tiggerCnt / Game.Instance.globalSpeed;
//         let n = 0;
//         let o = () => {
//             ++n == this.skillCfg.tiggerCnt && this.animQueue.step();
//         };
//         for (let i = 0; i < this.skillCfg.tiggerCnt - 1; i++) {
//             this.fire(o);
//             await this.wait(t);
//         }
//     }
//     async fire(callback: Function) {
//         let t = await AssetPool.Instance.createObjAsync(BUNDLE_NAMES.Game, GamePrefabs.SkillBullet25101.path);
//         t.parent = this.node;
//         let n = t.getComponent(sp.Skeleton);
//         this.fires.push(n);
//         let o = BattleWorld.Instance.getAllEnemyRang().minX;
//         let r = BattleWorld.Instance.getAllEnemyRang().maxX;
//         let i = Utils.randomRange(this.getOwner().node.position.x, r);
//         n.node.position = new cc.Vec3(i, n.node.position.y, 0);
//         n.enabled = true;
//         this.playSound(this.skillCfg.bombSound);
//         n.setAnimation(0, "huochang_open", false);
//         n.timeScale = Game.Instance.globalSpeed;
//         n.setCompleteListener(() => {
//             this.hurt(n.node.position);
//             n.setAnimation(0, "huochang", false);
//             n.timeScale = Game.Instance.globalSpeed;
//             n.setCompleteListener(() => {
//                 n.setAnimation(0, "huochang_close", false);
//                 n.timeScale = Game.Instance.globalSpeed;
//                 n.setCompleteListener(() => {
//                     n.enabled = false;
//                     AssetPool.Instance.put(n);
//                     let t = this.fires.indexOf(n);
//                     t >= 0 && m.pullAt(this.fires, [t]);
//                     callback();
//                     n.setCompleteListener(null);
//                 });
//             });
//         });
//     }
//     private wait(t: number) {
//         return new Promise<void>((resolve) => {
//             this.scheduleOnce(() => {
//                 resolve();
//             }, t);
//         });
//     }
//     @_(cc.Integer)
//     posHeight: number;
//     @v
//     public static default = b;
// }
// "import * as Const from 'Const';
// import { AsyncQueueTool } from 'AsyncQueueTool';
// import { AssetPool } from 'AssetPool';
// import { AssetRes } from 'AssetRes';
// import * as Utils from 'Utils';
// import { BattleWorld } from 'BattleWorld';
// import { ISkill } from 'ISkill';
// import { Game } from 'Game';
// import { ccclass, property } from cc._decorator;
const m: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class CSkill25101 extends ISkill {
    animQueue: AsyncQueueTool = null;
    fires: any[] = [];
    posHeight: number = 0;
    clearAnims() {
        m.each(this.fires, (e: any) => {
            e.node.stopAllActions();
            e.setCompleteListener(null);
            AssetPool.Instance.put(e);
        });
        this.fires.length = 0;
    }
    async fire(callback: Function) {
        let t = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, GamePrefabs_.SkillBullet25101.path);
        t.parent = this.node;
        let n = t.getComponent(sp.Skeleton);
        this.fires.push(n);
        let o = BattleWorld.Instance.getAllEnemyRang().minX;
        let r = BattleWorld.Instance.getAllEnemyRang().maxX;
        let i = Utils_.getRandomRange(this.getOwner().node.position.x, r);
        n.node.position = new cc.Vec3(i, n.node.position.y, 0);
        n.enabled = true;
        this.playSound(this.skillCfg.bombSound);
        n.setAnimation(0, "huochang_open", false);
        n.timeScale = Game.Instance.globalSpeed;
        n.setCompleteListener(() => {
            this.hurt(n.node.position);
            n.setAnimation(0, "huochang", false);
            n.timeScale = Game.Instance.globalSpeed;
            n.setCompleteListener(() => {
                n.setAnimation(0, "huochang_close", false);
                n.timeScale = Game.Instance.globalSpeed;
                n.setCompleteListener(() => {
                    n.enabled = false;
                    AssetPool.Instance.put(n);
                    let t = this.fires.indexOf(n);
                    t >= 0 && m.pullAt(this.fires, [t]);
                    callback();
                    n.setCompleteListener(null);
                });
            });
        });
    }
    onClear() {
        this.clearAnims();
        if (this.animQueue) {
            this.animQueue.clear();
        }
        this.unscheduleAllCallbacks();
    }
    onInit() {
        let e = cc.Vec3.ZERO;
        e.y += this.posHeight;
        this.node.position = e;
        this.node.zIndex = cc.macro.MIN_ZINDEX;
    }
    onPlay(e: Function) {
        this.clearAnims();
        this.animQueue = new AsyncQueueTool();
        this.animQueue.push(this.playFire.bind(this));
        this.animQueue.complete = e;
        this.animQueue.play();
    }
    async playFire() {
        let t = this.skillCfg.duration / this.skillCfg.tiggerCnt / Game.Instance.globalSpeed;
        let n = 0;
        let o = () => {
            ++n == this.skillCfg.tiggerCnt && this.animQueue.step();
        };
        for (let i = 0; i < this.skillCfg.tiggerCnt - 1; i++) {
            this.fire(o);
            await this.wait(t);
        }
    }
    private wait(t: number) {
        return new Promise<void>((resolve) => {
            this.scheduleOnce(() => {
                resolve();
            }, t);
        });
    }
}
