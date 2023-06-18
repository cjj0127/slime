import Game from "../Game";
import { SPINE_DATA_PATH_, SPINE_DATA_EFFECT_ } from "../common/Const";
import { ISkill } from "../battle/ISkill";
import BattleWorld from "../battle/BattleWorld";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import AsyncQueueTool from "../../ccstudio/utils/AsyncQueueTool";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CSkill25102 extends ISkill {
    animQueue: AsyncQueueTool = null;
    @property
    posHeight: number = 200;
    @property(sp.Skeleton)
    spEye: sp.Skeleton = null;
    @property(sp.Skeleton)
    spRay: sp.Skeleton = null;
    clearAnims() {
        this.spEye.enabled = false;
        this.spRay.enabled = false;
    }
    onClear() {
        this.clearAnims();
        this.animQueue && this.animQueue.clear();
    }
    onEnable() {
        this.clearAnims();
    }
    onEyeCompleteListener() {
        this.animQueue.step();
    }
    onInit() {
        const e = this.getOwner();
        const t = e.node.position;
        t.y += this.posHeight;
        const n = BattleWorld.Instance.getNearEnemys(e.node.position);
        if (n)
            t.x = Math.max(n.node.x - 300, e.node.x);
        else
            t.x += 300;
        this.node.position = t;
    }
    onLoad() {
        this.spEye.skeletonData = AssetManager.Instance.getSkeleton(NAMES_BUNDLE.Game, SPINE_DATA_PATH_, SPINE_DATA_EFFECT_);
        this.spRay.skeletonData = AssetManager.Instance.getSkeleton(NAMES_BUNDLE.Game, SPINE_DATA_PATH_, SPINE_DATA_EFFECT_);
        this.spEye.setCompleteListener(this.onEyeCompleteListener.bind(this));
        this.spRay.setCompleteListener(this.onRayCompleteListener.bind(this));
    }
    onPlay(e) {
        this.clearAnims();
        this.animQueue = new AsyncQueueTool();
        this.animQueue.push(this.playOpen.bind(this));
        this.animQueue.push(this.playRay.bind(this));
        this.animQueue.push(this.playClose.bind(this));
        this.animQueue.complete = e;
        this.animQueue.play();
    }
    onRayCompleteListener() {
        this.animQueue.step();
    }
    playClose() {
        this.spEye.setAnimation(0, "moyan_close", false);
        this.spRay.enabled = false;
    }
    playOpen() {
        this.spEye.enabled = true;
        this.spEye.setAnimation(0, "moyan_open", false);
        this.spEye.timeScale = Game.Instance.globalSpeed;
    }
    playRay() {
        const self = this;
        this.playSound(this.skillCfg.bombSound);
        this.spRay.enabled = true;
        this.spEye.setAnimation(0, "moyan_rayeye", true);
        this.spRay.setAnimation(0, "moyan_ray", false);
        this.spRay.timeScale = Game.Instance.globalSpeed;
        this.spEye.timeScale = Game.Instance.globalSpeed;
        this.scheduleOnce(function () {
            self.hurt(self.node.position);
        }, 0);
    }
}
