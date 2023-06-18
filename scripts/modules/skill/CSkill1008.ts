import { SPINE_DATA_PATH_, SPINE_DATA_EFFECT_ } from "../common/Const";
import { ISkill } from "../battle/ISkill";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import BattleWorld from "../battle/BattleWorld";
import Game from "../Game";
import RelicModel from "../../ccstudio/data/RelicModel";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
const g = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class CSkill1008 extends ISkill {
    hurtTimes = {};
    intervalTime = 0;
    running = false;
    runningTime = 0;
    runningTotalTime = 0;
    sp = null;
    fireEnable() {
        return this.calcHurtTragets(this.node.position, this.skillCfg.range).length > 0;
    }
    hurt(pos: cc.Vec3, t?: any) {
        if (g.isNil(pos)) {
            pos = this.node.position;
        }
        const targets = this.calcHurtTragets(pos, this.skillCfg.range);
        const damageObj = this.getOwner().calcCriticalDamage_(this.damage);
        let damage = damageObj.damage;
        const critical = damageObj.critical;
        damage = Model.user.calcSkillDamage(damage);
        let s, c = Model.relic.applySkill(this.skillCfg.id);
        if (c && (s = g.get(c, "calcHurt"))) {
            damage = s(damage);
        }
        c = Model.relic.applySkill(this.skillCfg.id);
        if (c && (s = g.get(c, "calcHurt"))) {
            damage = s(damage);
        }
        const effect = this.skillCfg.HurtEffect;
        g.each(targets, e => {
            if (e && e.checkAlive() && (g.isNil(this.hurtTimes[e.uid]) || this.runningTotalTime - this.hurtTimes[e.uid] >= this.intervalTime)) {
                this.hurtTimes[e.uid] = this.runningTotalTime;
                const worldSpacePos = e.body.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
                e.view.playHit(t);
                let r = damage;
                if (e.isBoss) {
                    r = Model.user.calcBossDamage(damage);
                }
                e.dodecHp(r, critical);
                this.playEffect(effect, worldSpacePos, 60 * Math.random());
            }
        });
        return targets;
    }
    lateUpdate(dt: number) {
        if (this.running) {
            dt *= Game.Instance.globalSpeed;
            this.runningTotalTime += dt;
            this.runningTime += dt;
            if (this.runningTime >= 0.1) {
                this.runningTime -= 0.1;
                this.hurt(this.node.position);
            }
            if (this.runningTotalTime >= this.skillCfg.duration) {
                this.running = false;
                this._logicQueue.step();
            }
        }
    }
    onCameraPositionChanged() {
        this.syncPosition();
    }
    onClear() {
        this.sp.setCompleteListener(null);
        this.running = false;
    }
    onDisable() {
        BattleWorld.Instance.worldCamera.node.targetOff(this);
    }
    onInit() {
        this.runningTime = 0;
        this.runningTotalTime = 0;
        this.node.position = this.getOwner().node.position.add(cc.v3(0, 100));
        this.intervalTime = this.skillCfg.duration / this.skillCfg.tiggerCnt;
        this.hurtTimes = {};
        BattleWorld.Instance.worldCamera.node.on(cc.Node.EventType.POSITION_CHANGED, this.onCameraPositionChanged, this);
    }
    // private sp: sp.Skeleton = null;
    // private runningTime = 0;
    // private runningTotalTime = 0;
    // private intervalTime = 0;
    // private hurtTimes: { [key: string]: number } = {};
    onLoad() {
        this.sp.skeletonData = AssetManager.Instance.getSkeleton(NAMES_BUNDLE.Game, SPINE_DATA_PATH_, SPINE_DATA_EFFECT_);
    }
    onPlay() {
        this.sp.setAnimation(0, "yujian", false);
        this.sp.timeScale = Game.Instance.globalSpeed;
        this.scheduleOnce(() => {
            this.running = true;
        }, 0.15);
    }
    syncPosition() {
        this.node.x = BattleWorld.Instance.worldCamera.node.position.x;
        this.node.y = this.getOwner().node.position.add(cc.v3(0, 100)).y;
    }
}
