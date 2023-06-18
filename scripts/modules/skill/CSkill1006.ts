import { SPINE_DATA_PATH_, SPINE_DATA_EFFECT_ } from "../common/Const";
import { ISkill } from "../battle/ISkill";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import AssetPool from "../asset/AssetPool";
import AsyncQueueTool from "../../ccstudio/utils/AsyncQueueTool";
import BattleWorld from "../battle/BattleWorld";
import Game from "../Game";
import Utils_ from "../../ccstudio/utils/Utils";
// import Game from "Game";
const { ccclass, property } = cc._decorator;
const b: any = window["_"];
@ccclass
export default class CSkill1006 extends ISkill {
    animQueue = null;
    bullets = [];
    nextFunc = null;
    playFire = async () => {
        await this.hurt(this.node.position);
        this.playSound(this.skillCfg.bombSound);
    };
    playOpen = (e) => {
        this.nextFunc = e;
        const t = BattleWorld.Instance.getAllEnemyRang(), n = t.minX, o = t.maxX, r = Utils_.getRandomRange(n, o);
        this.node.position = cc.v3(r, this.getOwner().node.position.y, 0);
        this.sp.setAnimation(0, "jingji_open", !1);
        this.sp.timeScale = Game.Instance.globalSpeed;
        this.sp.setCompleteListener(this.playAttack);
    };
    @property(sp.Skeleton)
    sp: sp.Skeleton = null;
    clearAnims() {
        b.each(this.bullets, (e) => {
            e.node.stopAllActions(),
                e.setCompleteListener(null),
                AssetPool.Instance.put(e);
        });
        this.bullets.length = 0;
    }
    onClear() {
        this.clearAnims(),
            this.sp.setCompleteListener(null),
            this.unscheduleAllCallbacks();
    }
    onInit() {
        this.node.position = this.getOwner().node.position;
    }
    onLoad() {
        this.sp.skeletonData = AssetManager.Instance.getSkeleton(NAMES_BUNDLE.Game, SPINE_DATA_PATH_, SPINE_DATA_EFFECT_);
    }
    onPlay(e) {
        this.clearAnims(),
            this.animQueue = new AsyncQueueTool,
            this.animQueue.push(this.playOpen.bind(this)),
            this.animQueue.complete = e,
            this.animQueue.play();
    }
    playAttack() {
        this.sp.setCompleteListener(null);
        this.sp.timeScale = Game.Instance.globalSpeed;
        this.sp.setAnimation(0, "jingji_attack", false);
        this.playFire();
        this.sp.setCompleteListener(() => {
            this.playClose();
        });
    }
    playClose() {
        this.sp.setAnimation(0, "jingji_close", false);
        this.sp.timeScale = Game.Instance.globalSpeed;
        this.sp.setCompleteListener(() => {
            this.nextFunc();
        });
    }
}
