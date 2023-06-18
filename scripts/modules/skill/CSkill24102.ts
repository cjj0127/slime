import Game from "../Game";
import { SPINE_DATA_PATH_, SPINE_DATA_EFFECT_ } from "../common/Const";
import { ISkill } from "../battle/ISkill";
import BattleWorld from "../battle/BattleWorld";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CSkill24102 extends ISkill {
    @property(sp.Skeleton)
    sp: sp.Skeleton = null;
    onClear() {
        this.sp.setCompleteListener(null);
        this.unscheduleAllCallbacks();
    }
    onInit() {
        this.node.position = cc.Vec3.ZERO;
    }
    onLoad() {
        this.sp.skeletonData = AssetManager.Instance.getSkeleton(NAMES_BUNDLE.Game, SPINE_DATA_PATH_, SPINE_DATA_EFFECT_);
    }
    onPlay(cb: Function) {
        this.onClear();
        this.sp.node.active = true;
        const { minX: o, maxX: r } = BattleWorld.Instance.getAllEnemyRang();
        const i = cc.misc.lerp(o, r, 0.5);
        this.node.position = cc.v3(i, this.getOwner().node.position.y, 0);
        this.sp.setAnimation(0, 'mogu_zhadan', false);
        this.sp.timeScale = Game.Instance.globalSpeed;
        this.sp.setCompleteListener(() => {
            this.hurt(this.node.position);
            this.sp.setAnimation(0, 'explosion1', false);
            this.sp.setCompleteListener(() => {
                this.sp.node.active = false;
                this.sp.setCompleteListener(null);
                cb();
            });
        });
    }
}
