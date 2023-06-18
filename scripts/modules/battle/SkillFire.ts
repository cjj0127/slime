import { ISkill } from "./ISkill";
import { BUFF_EVENT } from "./Buff";
import { E_SKILL_FIRE_TYPE, GAME_SKILL_PATH_ } from "../common/Const";
import AssetPool from "../asset/AssetPool";
import BattleWorld from "./BattleWorld";
import Game from "../Game";
import RelicModel from "../../ccstudio/data/RelicModel";
import RingModel from "../../ccstudio/data/RingModel";
import SkillModel from "../../ccstudio/data/SkillModel";
import TeasureModel from "../../ccstudio/data/TeasureModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import SkillBulletProxy from "./SkillBulletProxy";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
import SkillSummonProxy from "./SkillSummonProxy";
const C: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class SkillFire extends cc.Component {
    _pause = false;
    bulletFireProxy = {};
    fireSkills = {};
    summonFireProxy = {};
    clear() {
        C.each(this.fireSkills, (e) => {
            e.clear();
            AssetPool.Instance.put(e);
        });
        C.each(this.bulletFireProxy, (e) => {
            e.stop();
        });
        C.each(this.summonFireProxy, (e) => {
            e.stop();
        });
        this.fireSkills = {};
    }
    fire(e) {
        const t = e.id;
        switch (_SkillConfig.Instance.get(t).bulletType) {
            case E_SKILL_FIRE_TYPE.Bullet:
                return this.fireBullet(e);
            case E_SKILL_FIRE_TYPE.Summon:
                return this.fireSummon(t);
            case E_SKILL_FIRE_TYPE.Buff:
                return this.fireBuff(t);
            case E_SKILL_FIRE_TYPE.Script:
                return this.fireScript(e);
        }
        return true;
    }
    fireBuff(e) {
        const t = _SkillConfig.Instance.get(e);
        const n = Model.skill.getBattleValue(e);
        const o = Model.ring.getSkillAddtion(e);
        const r = NumberPlus.div(NumberPlus.mul(n, o), 100);
        const i = NumberPlus.add(n, r);
        const a = Model.relic.getSkillEffect(e);
        if (a) {
            a.use();
        }
        return (BattleWorld.Instance.buffCtrl
            .addBuff(t.baseProp, i, t.duration, t.skilPrefab)
            .once(BUFF_EVENT.Disable, () => {
            if (a) {
                a.stop();
            }
        }),
            true);
    }
    fireBullet(e) {
        const t = e.id;
        let n = this.bulletFireProxy[t];
        if (!n) {
            n = this.node.addComponent(SkillBulletProxy);
        }
        const o = _SkillConfig.Instance.get(t);
        let r = Model.skill.getBattleValue(t);
        const i = Model.ring.getSkillAddtion(t);
        r = NumberPlus.add(r, i);
        let a;
        const c = o.duration;
        const u = o.duration / o.tiggerCnt;
        const p = {
            bulletId: o.fireId,
            damagePercent: r,
            duration: c,
            interval: u,
            repeatCount: 1,
        };
        const d = Model.relic.applySkill(t);
        if (d) {
            p.duration = C.get(d, "duration", c);
            p.repeatCount = C.get(d, "repeatCount", 1);
            const e = C.get(d, "calcHurt");
            if (e) {
                p.damagePercent = e(p.damagePercent);
            }
        }
        const m = Model.teasure.applySkill(t);
        if (m) {
            const e = C.get(m, "calcHurt");
            if (e) {
                p.damagePercent = e(p.damagePercent);
            }
        }
        e.duration = p.duration;
        n.appendFire(p);
        return true;
    }
    fireScript(info: any) {
        // const t = this;
        const id = info.id;
        const o = _SkillConfig.Instance.get(id);
        const r = `${GAME_SKILL_PATH_}/${o.skilPrefab}`;
        const obj = AssetPool.Instance.createObject(r);
        if (!obj)
            return;
        obj.parent = BattleWorld.Instance.ground;
        const skill = obj.getComponent(ISkill);
        const d = Model.skill.getBattleValue(id);
        const g = Model.ring.getSkillAddtion(id);
        if (skill.setDamage(NumberPlus.add(d, NumberPlus.div(NumberPlus.mul(d, g), 100))), skill.init(o), skill.fireEnable()) {
            this.fireSkills[id] = skill;
            skill.play(() => {
                delete this.fireSkills[id];
                AssetPool.Instance.put(obj);
            });
            const y = Model.relic.applySkill(id);
            if (y) {
                info.cdTime = C.get(y, "cd", o.cd);
            }
            return true;
        }
        AssetPool.Instance.put(obj);
    }
    public fireSummon(e): boolean {
        let t = this.summonFireProxy[e];
        if (!t) {
            t = this.summonFireProxy[e] = this.node.addComponent(SkillSummonProxy);
        }
        const n = _SkillConfig.Instance.get(e);
        let o = Model.skill.getBattleValue(e);
        const r = Model.ring.getSkillAddtion(e);
        o = NumberPlus.add(o, r);
        const i = Model.teasure.applySkill(e);
        if (i) {
            o = NumberPlus.add(o, i);
        }
        t.appendFire(n.fireId, n.tiggerCnt, n.duration, o, n.bombSound);
        return true;
    }
    fixedUpdate(e) {
        if (!this._pause) {
            e *= Game.Instance.globalSpeed;
            C.each(this.bulletFireProxy, (t) => {
                t.fixUpdate(e);
            });
            C.each(this.summonFireProxy, (t) => {
                t.fixUpdate(e);
            });
        }
    }
    onEnable() {
        this.schedule(this.fixedUpdate, 0.1, cc.macro.REPEAT_FOREVER);
    }
    onLoad() { }
    pause() {
        this._pause = true;
    }
    resume() {
        this._pause = false;
    }
    ;
}
