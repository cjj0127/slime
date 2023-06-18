import Game from "../Game";
import { SPINE_DATA_PATH_, SPINE_DATA_EFFECT_ } from "../common/Const";
import { ISkill } from "../battle/ISkill";
import BattleWorld from "../battle/BattleWorld";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CSkill25103 extends ISkill {
    @property(sp.Skeleton)
    sp: sp.Skeleton = null;
    onClear() {
        this.sp.setCompleteListener(null);
        this.unscheduleAllCallbacks();
    }
    onInit() {
        this.node.zIndex = -750;
        const owner = this.getOwner();
        const range = BattleWorld.Instance.getAllEnemyRang();
        const minX = range.minX;
        const maxX = range.maxX;
        const position = owner.node.position;
        position.x = cc.misc.lerp(minX, maxX, 0.5);
        this.node.position = position;
    }
    onLoad() {
        this.sp.skeletonData = AssetManager.Instance.getSkeleton(NAMES_BUNDLE.Game, SPINE_DATA_PATH_, SPINE_DATA_EFFECT_);
    }
    onPlay(callback: Function) {
        this.sp.setAnimation(0, "earthquake", false);
        this.sp.timeScale = Game.Instance.globalSpeed;
        this.sp.setCompleteListener(callback);
        this.scheduleOnce(() => {
            this.hurt();
        }, 0.2 / Game.Instance.globalSpeed);
    }
}
