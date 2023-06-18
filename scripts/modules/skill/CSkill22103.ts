import Game from "../Game";
import { SPINE_DATA_PATH_, SPINE_DATA_EFFECT_ } from "../common/Const";
import { ISkill } from "../battle/ISkill";
import BattleWorld from "../battle/BattleWorld";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import Utils_ from "../../ccstudio/utils/Utils";
// import { Game } from './Game';
const { ccclass, property } = cc._decorator;
@ccclass
export default class CSkill22103 extends ISkill {
    @property({ type: sp.Skeleton })
    sp: sp.Skeleton = null;
    onClear() {
        this.sp.setCompleteListener(null);
        this.unscheduleAllCallbacks();
    }
    onInit() {
        const pos = this.getOwner().node.position;
        this.node.position = pos;
    }
    onLoad() {
        this.sp.skeletonData = AssetManager.Instance.getSkeleton(NAMES_BUNDLE.Game, SPINE_DATA_PATH_, SPINE_DATA_EFFECT_);
    }
    onPlay(callback) {
        this.onClear();
        const range = BattleWorld.Instance.getAllEnemyRang();
        const minX = range.minX;
        const maxX = range.maxX;
        const randomX = Utils_.getRandomRange(minX, maxX);
        this.node.position = cc.v3(randomX, this.getOwner().node.position.y, 0);
        this.sp.setAnimation(0, 'luolei', false);
        this.sp.timeScale = Game.Instance.globalSpeed;
        this.sp.setCompleteListener(callback);
        this.scheduleOnce(() => {
            this.hurt(this.node.position);
        }, 0);
    }
}
