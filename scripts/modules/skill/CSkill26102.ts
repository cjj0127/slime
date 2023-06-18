import { SPINE_DATA_PATH_, SPINE_DATA_EFFECT_ } from "../common/Const";
import { ISkill } from "../battle/ISkill";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AssetManager from "../asset/AssetManager";
import BattleWorld from "../battle/BattleWorld";
import Game from "../Game";
import RelicModel from "../../ccstudio/data/RelicModel";
import TeasureModel from "../../ccstudio/data/TeasureModel";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class CSkill26102 extends ISkill {
    hurtTimes: {
        [key: string]: number;
    } = {};
    intervalTime: number = 0;
    running: boolean = false;
    runningTime: number = 0;
    runningTotalTime: number = 0;
    @property(sp.Skeleton)
    sp: sp.Skeleton | null = null;
    hurt(e: cc.Vec3, t?: any) {
        if (_.isNil(e)) {
            e = this.node.position;
        }
        var o = this.calcHurtTragets(e, this.skillCfg.range);
        var r = this.getOwner().calcCriticalDamage_(this.damage);
        var i = r.damage;
        var a = r.critical;
        i = Model.user.calcSkillDamage(i);
        var s;
        var c = Model.relic.applySkill(this.skillCfg.id);
        if (c) {
            s = _.get(c, "calcHurt");
            if (s) {
                i = s(i);
            }
        }
        c = Model.teasure.applySkill(this.skillCfg.id);
        if (c) {
            s = _.get(c, "calcHurt");
            if (s) {
                i = s(i);
            }
        }
        var f = this.skillCfg.HurtEffect;
        _.each(o, (e) => {
            if (e && e.checkAlive() && (_.isNil(this.hurtTimes[e.uid]) || this.runningTotalTime - this.hurtTimes[e.uid] >= this.intervalTime)) {
                this.hurtTimes[e.uid] = this.runningTotalTime;
                var o = e.body.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
                e.view.playHit(t);
                var r = i;
                if (e.isBoss) {
                    r = Model.user.calcBossDamage(i);
                }
                e.dodecHp(r, a);
                this.playEffect(f, o, 60 * Math.random());
            }
        });
        return o;
    }
    lateUpdate(e: number) {
        if (this.running) {
            e *= Game.Instance.globalSpeed;
            this.runningTotalTime += e;
            this.runningTime += e;
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
        this.running = false;
    }
    onDisable() {
        BattleWorld.Instance.worldCamera.node.targetOff(this);
    }
    onInit() {
        this.syncPosition(),
            this.runningTotalTime = 0,
            this.runningTime = 0,
            this.hurtTimes = {},
            BattleWorld.Instance.worldCamera.node.on(cc.Node.EventType.POSITION_CHANGED, this.onCameraPositionChanged, this);
    }
    // running: boolean = false;
    // runningTotalTime: number = 0;
    // runningTime: number = 0;
    // intervalTime: number = this.skillCfg.duration / this.skillCfg.tiggerCnt;
    // hurtTimes: { [key: string]: number } = {};
    onLoad() {
        this.sp.skeletonData = AssetManager.Instance.getSkeleton(NAMES_BUNDLE.Game, SPINE_DATA_PATH_, SPINE_DATA_EFFECT_);
    }
    onPlay() {
        this.running = true,
            this.sp.setAnimation(0, "wind_snow", true);
    }
    syncPosition() {
        this.node.position = BattleWorld.Instance.worldCamera.node.position;
    }
}
