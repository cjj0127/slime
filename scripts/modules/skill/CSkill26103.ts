import { GlobalEventName } from "../common/Events";
import { E_ENTITY_GROUP } from "../common/Const";
import { ISkill } from "../battle/ISkill";
import BattleWorld from "../battle/BattleWorld";
import Fire from "../battle/Fire";
import Game from "../Game";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
// import * as ISkill from "ISkill";
const { ccclass, property } = cc._decorator;
@ccclass
export default class CSkill26103 extends ISkill {
    @property(Fire)
    fireProxy: Fire = null;
    groupId: number = E_ENTITY_GROUP.HERO;
    @property(sp.Skeleton)
    sp: sp.Skeleton = null;
    calcCriticalDamage_(e) {
        return this.getOwner().calcCriticalDamage_(e);
    }
    complate(e) {
        cc.tween(this.sp.node).delay(1).to(0.3, {
            scale: 0
        }).call(e).start();
    }
    fixedUpdate() {
        let e = this;
        let t = BattleWorld.Instance.getRandomTarget(1);
        if (t.length > 0) {
            this.sp.setAnimation(0, "jingling_attack", false);
            this.sp.timeScale = Game.Instance.globalSpeed;
            this.sp.setCompleteListener(() => {
                e.sp.setAnimation(0, "jingling_standby", true);
            });
            this.fireProxy.fire(t[0]);
        }
    }
    getHurtEffect() {
        return this.skillCfg.HurtEffect;
    }
    onChangeHero(e) {
        if (e == null) {
            e.node.targetOff(this);
        }
        this.getOwner().node.on(cc.Node.EventType.POSITION_CHANGED, this.onOwnerPositionChanged, this);
    }
    onClear() {
        this.sp.setCompleteListener(null);
        this.unscheduleAllCallbacks();
        this.sp.node.stopAllActions();
        this.getOwner().node.targetOff(this);
        cc.director.targetOff(this);
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onInit() {
        this.fireProxy.bulletId = this.skillCfg.fireId;
        this.syncPosition();
        this.sp.setAnimation(0, "jingling_standby", true);
        this.sp.timeScale = Game.Instance.globalSpeed;
        this.getOwner().node.on(cc.Node.EventType.POSITION_CHANGED, this.onOwnerPositionChanged, this);
        cc.director.on(GlobalEventName.ChangeMemberToLeader, this.onChangeHero, this);
    }
    onLoad() {
        this.sp.skeletonData = AssetManager.Instance.getSkeleton(NAMES_BUNDLE.Game, a.SPINE_DATA_PATH, a.SPINE_DATA_EFFECT);
        this.fireProxy.owner = this;
    }
    onOwnerPositionChanged() {
        this.syncPosition();
    }
    onPlay(e) {
        let t = this;
        this.sp.node.scale = 0;
        this.sp.node.stopAllActions();
        cc.tween(this.sp.node).to(0.3 / Game.Instance.globalSpeed, {
            scale: 1
        }).call(() => {
            let n = t.skillCfg.duration / t.skillCfg.tiggerCnt / Game.Instance.globalSpeed;
            t.schedule(t.fixedUpdate, n, cc.macro.REPEAT_FOREVER);
            t.scheduleOnce(() => {
                t.complate(e);
            }, t.skillCfg.duration / Game.Instance.globalSpeed);
        }).start();
    }
    syncPosition() {
        let e = this.getOwner();
        if (e != null) {
            let t = e.node.position;
            t.y += 0.5 * e.body.node.height + 70;
            t.x -= 0.5 * e.body.node.width + 0.5 * this.node.width + 10;
            this.node.position = t;
        }
    }
}
