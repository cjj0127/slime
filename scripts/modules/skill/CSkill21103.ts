import { SPINE_DATA_PATH_, SPINE_DATA_EFFECT_, GamePrefabs_ } from "../common/Const";
import { ISkill } from "../battle/ISkill";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import AssetPool from "../asset/AssetPool";
import BattleWorld from "../battle/BattleWorld";
import Game from "../Game";
import RelicModel from "../../ccstudio/data/RelicModel";
import Model from "../../ccstudio/data/Model";
import Utils_ from "../../ccstudio/utils/Utils";
const m: any = window["_"];
// import { Game } from 'Game';
const { ccclass, property } = cc._decorator;
@ccclass
export class CSkill21103 extends ISkill {
    bullets: Array<any> = [];
    clearAnims() {
        this.bullets.forEach((e) => {
            e.node.stopAllActions();
            e.setCompleteListener(null);
            AssetPool.Instance.put(e);
        });
        this.bullets.length = 0;
    }
    async createFall() {
        const e: cc.Node = await AssetPool.Instance.createObjAsync(NAMES_BUNDLE.Game, GamePrefabs_.SkillBulletEmpty.path);
        e.parent = this.node.parent;
        const t: sp.Skeleton = e.getComponent(sp.Skeleton);
        t.skeletonData = AssetManager.Instance.getSkeleton(NAMES_BUNDLE.Game, SPINE_DATA_PATH_, SPINE_DATA_EFFECT_);
        return t;
    }
    onClear() {
        this.clearAnims();
    }
    onEnable() {
        this.clearAnims();
    }
    onInit() {
        this.node.position = cc.Vec3.ZERO;
    }
    async onPlay(e: Function) {
        this.clearAnims();
        const n: number = this.skillCfg.duration, o: number = this.skillCfg.tiggerCnt, r: number = Model.relic.applySkill(this.skillCfg.id) || 0;
        let i: number = 0;
        const a: Function = () => {
            ++i == o && e();
        };
        this.playFall(a);
        let s: number = n / o;
        s /= Game.Instance.globalSpeed;
        for (let j = 0; j < o - 2; j++) {
            await new Promise((resolve, reject) => {
                this.schedule(() => {
                    this.playFall(a);
                    resolve(null);
                }, s);
            });
        }
    }
    playClose(e: sp.Skeleton, t: Function) {
        e.setAnimation(0, "mogu_ya_close", false);
        e.timeScale = Game.Instance.globalSpeed;
        e.setCompleteListener(() => {
            t();
            e.setCompleteListener(null);
            const o: number = this.bullets.indexOf(e);
            if (o >= 0) {
                m.pullAt(this.bullets, [o]);
            }
            AssetPool.Instance.put(e);
        });
    }
    async playFall(e: Function) {
        const t: sp.Skeleton = await this.createFall();
        const n: {
            minX: number;
            maxX: number;
        } = BattleWorld.Instance.getAllEnemyRang(), o: number = n.minX, r: number = n.maxX, i: number = Utils_.getRandomRange(o, r);
        t.node.position = cc.v3(i, this.getOwner().node.position.y, 0);
        this.bullets.push(t);
        t.skeletonData = AssetManager.Instance.getSkeleton(NAMES_BUNDLE.Game, SPINE_DATA_PATH_, SPINE_DATA_EFFECT_);
        t.setAnimation(0, "mogu_ya", false);
        t.timeScale = Game.Instance.globalSpeed;
        t.setCompleteListener(() => {
            this.playExplode(t.node.convertToWorldSpaceAR(cc.Vec3.ZERO));
            this.hurt(t.node.position);
            this.playClose(t, e);
        });
    }
}
