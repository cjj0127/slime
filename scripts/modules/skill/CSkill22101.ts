import Game from "../Game";
import { GlobalEventName } from "../common/Events";
import { SPINE_DATA_PATH_, SPINE_DATA_EFFECT_ } from "../common/Const";
import BuffEffect from "../battle/BuffEffect";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CSkill22101 extends BuffEffect {
    @property
    displayHeight = 50;
    @property(sp.Skeleton)
    sp: sp.Skeleton = null;
    @property(sp.Skeleton)
    spKuang: sp.Skeleton = null;
    onChangeHero(e) {
        if (e == null) {
            e.node.targetOff(this);
        }
        this.getOwner().node.on(cc.Node.EventType.POSITION_CHANGED, this.onOwnerPosChange, this);
    }
    onClear() {
        const ownerNode = this.getOwner().node;
        ownerNode.targetOff(this);
        this.sp.setCompleteListener(null);
        cc.director.targetOff(this);
    }
    onClose() {
        const ownerNode = this.getOwner().node;
        ownerNode.targetOff(this);
        this.playClose();
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onInit() {
        const e = this.getOwner();
        const t = e.node.position;
        t.y += 0.5 * e.node.height - e.node.height * e.node.anchorY;
        this.node.position = t;
        this.sp.node.y = 0.5 * e.node.height + this.displayHeight;
        e.node.on(cc.Node.EventType.POSITION_CHANGED, this.onOwnerPosChange, this);
        cc.director.on(GlobalEventName.ChangeMemberToLeader, this.onChangeHero, this);
    }
    // sp: sp.Skeleton = null;
    // spKuang: sp.Skeleton = null;
    // displayHeight: number = 0;
    onLoad() {
        this.sp.skeletonData = AssetManager.Instance.getSkeleton(NAMES_BUNDLE.Game, SPINE_DATA_PATH_, SPINE_DATA_EFFECT_);
        this.sp.premultipliedAlpha = false;
        this.spKuang.skeletonData = AssetManager.Instance.getSkeleton(NAMES_BUNDLE.Game, SPINE_DATA_PATH_, SPINE_DATA_EFFECT_);
        this.spKuang.premultipliedAlpha = false;
    }
    onOwnerPosChange() {
        const e = this.getOwner();
        if (e !== null) {
            this.node.x = e.node.x;
        }
    }
    onPlay() {
        this.playOpen();
    }
    playClose() {
        const e = this;
        this.sp.setAnimation(0, "kuangbao_close", false);
        this.sp.timeScale = Game.Instance.globalSpeed;
        this.sp.setCompleteListener(function () {
            e._logicQueue.step();
        });
        this.spKuang.setAnimation(0, "kuang_close", false);
        this.spKuang.timeScale = Game.Instance.globalSpeed;
    }
    playIdle() {
        this.sp.setCompleteListener(null);
        this.sp.timeScale = Game.Instance.globalSpeed;
        this.sp.setAnimation(0, 'kuangbao', true);
    }
    playOpen() {
        const e = this;
        this.sp.setAnimation(0, "kuangbao_open", false);
        this.sp.timeScale = Game.Instance.globalSpeed;
        this.sp.setCompleteListener(this.playIdle.bind(this));
        this.spKuang.setAnimation(0, "kuang_open", false);
        this.spKuang.timeScale = Game.Instance.globalSpeed;
        this.spKuang.setCompleteListener(function () {
            e.spKuang.setAnimation(0, "kuang", true);
            e.spKuang.timeScale = Game.Instance.globalSpeed;
            e.spKuang.setCompleteListener(null);
        });
    }
}
