import Game from "../Game";
import { SPINE_DATA_PATH_, SPINE_DATA_EFFECT_ } from "../common/Const";
import { ISkill } from "../battle/ISkill";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
// import { ISkill } from './ISkill';
const { ccclass, property } = cc._decorator;
@ccclass
export default class CSkill1007 extends ISkill {
    @property({ type: sp.Skeleton })
    sp: sp.Skeleton = null;
    fireEnable() {
        return this.calcHurtTragets(this.node.position, .8 * this.skillCfg.range).length > 0;
    }
    onClear() {
        this.sp.setCompleteListener(null),
            this.unscheduleAllCallbacks();
    }
    onInit() {
        this.node.position = this.getOwner().node.position.add(cc.v3(.5 * this.skillCfg.range, .5 * this.getOwner().node.height, 0));
    }
    onLoad() {
        this.sp.skeletonData = AssetManager.Instance.getSkeleton(NAMES_BUNDLE.Game, SPINE_DATA_PATH_, SPINE_DATA_EFFECT_);
    }
    onPlay(e) {
        this.sp.setAnimation(0, "chop", !1),
            this.sp.timeScale = Game.Instance.globalSpeed,
            this.sp.setCompleteListener(() => {
                e(),
                    this.sp.setCompleteListener(null);
            }),
            this.scheduleOnce(() => {
                this.hurt();
            }, .2 / Game.Instance.globalSpeed);
    }
}
