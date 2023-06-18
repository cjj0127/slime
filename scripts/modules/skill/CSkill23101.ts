import Game from "../Game";
import { SPINE_DATA_PATH_, SPINE_DATA_EFFECT_ } from "../common/Const";
import { ISkill } from "../battle/ISkill";
import BattleWorld from "../battle/BattleWorld";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import Utils_ from "../../ccstudio/utils/Utils";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CSkill23101 extends ISkill {
    @property(sp.Skeleton)
    sp: sp.Skeleton = null;
    onClear() {
        this.sp.setCompleteListener(null);
        this.unscheduleAllCallbacks();
    }
    onInit() {
        this.node.position = cc.Vec3.ZERO;
        this.node.zIndex = -this.node.y;
    }
    onLoad() {
        this.sp.skeletonData = AssetManager.Instance.getSkeleton(NAMES_BUNDLE.Game, SPINE_DATA_PATH_, SPINE_DATA_EFFECT_);
    }
    onPlay(callback: Function) {
        this.onClear();
        this.sp.node.active = true;
        const { minX, maxX } = BattleWorld.Instance.getAllEnemyRang();
        const x = Utils_.getRandomRange(minX, maxX);
        this.node.position = cc.v3(x, this.getOwner().node.position.y, 0);
        this.sp.setAnimation(0, "luochui", false);
        this.sp.timeScale = Game.Instance.globalSpeed;
        this.sp.setCompleteListener(() => {
            this.playExplode(this.node.convertToWorldSpaceAR(cc.Vec3.ZERO));
            this.hurt(this.node.position);
            this.sp.setAnimation(0, "luochui_close", false);
            this.sp.timeScale = Game.Instance.globalSpeed;
            this.sp.setCompleteListener(() => {
                this.sp.node.active = false;
                callback();
            });
        });
    }
}
