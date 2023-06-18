const _: any = window["_"];
import BattleWorld from "../../modules/battle/BattleWorld";
import ModeBase from "./ModelBase";
import NumberPlus from "../utils/NumberPlus";
import _TeasureConfig from "../config/_TeasureConfig";
import _TeasureCostConfig from "../config/_TeasureCostConfig";
import _TeasureLevelConfig from "../config/_TeasureLevelConfig";
import CTreasureData from "../../modules/treasure/CTreasureData";
import UserData from "../../modules/user/UserData";
export default class TeasureModel extends ModeBase {
    private effects: any = {};
    activeEffect(e, t) {
        const n = this.effects[e];
        n && (n.isActive = !1);
        const r = this.getEffectObj(t);
        r.isActive = !0;
    }
    activeTreasures() {
        const t = CTreasureData.Instance.getAllEquipTreasure();
        _.each(t, (e) => {
            const t = this.getEffectObj(e);
            t.recalc && t.recalc();
            t.isActive = !0;
        });
    }
    applySkill(e) {
        const t = _TeasureConfig.Instance.getSkillEffectId(e);
        if (!_.isNil(t) && t > 0) {
            const n = this.getEffectObj(t);
            return n.use.apply(n, _.slice(arguments, 1));
        }
        return null;
    }
    buyTreasure(e) {
        const t = _TeasureCostConfig.Instance.getDataByTeasureId(e).costNum;
        let n = true;
        _.each(t, function (e) {
            const t = e.split("|");
            const o = UserData.Instance.getItem(Number(t[0]));
            NumberPlus.compare(o, NumberPlus.decode(t[1])) || (n = false);
        });
        if (!n)
            return false;
        _.each(t, function (e) {
            const t = e.split("|");
            UserData.Instance.subItem(Number(t[0]), Number(NumberPlus.decode(t[1])));
        });
        CTreasureData.Instance.activeTreasure(e);
        CTreasureData.Instance.calcAllProps();
        return true;
    }
    createEffect(e) {
        const t = _TeasureConfig.Instance.get(e).effect;
        const n = BattleWorld.Instance.node.addComponent(t);
        //@ts-ignore
        n.treasureId = e;
        return n;
    }
    equip(e) {
        const t = _TeasureConfig.Instance.get(e);
        const n = CTreasureData.Instance.getEquip(t.type);
        if (n == e)
            return false;
        const o = CTreasureData.Instance.getData(e);
        if (_.isNil(o))
            return false;
        CTreasureData.Instance.equip(e);
        this.activeEffect(n, e);
        return true;
    }
    getEffectObj(e) {
        let t = this.effects[e];
        if (!t) {
            t = this.effects[e] = this.createEffect(e);
        }
        return t;
    }
    getIsHaveTeasure() {
        return CTreasureData.Instance.getTreasureCount() > 0;
    }
    getIsMaxLevel(e) {
        const t = _TeasureConfig.Instance.get(e.id);
        return e.level >= t.maxLevel;
    }
    getIsUnlockTeasure(e) {
        return !!CTreasureData.Instance.getData(e);
    }
    getSkillEffect(e) {
        const t = _TeasureConfig.Instance.getSkillEffectId(e);
        return !_.isNil(t) && t > 0 ? this.getEffectObj(t) : null;
    }
    initLoadData() {
        CTreasureData.Instance.init();
        CTreasureData.Instance.activeProps();
    }
    isUnlockType(e) {
        const t = _TeasureConfig.Instance.getTypeIds(e);
        for (let n = 0; n < t.length; n++) {
            const o = t[n];
            if (CTreasureData.Instance.getData(o))
                return true;
        }
        return false;
    }
    lateUpdate() {
        CTreasureData.Instance.save();
    }
    load() {
        CTreasureData.Instance.load();
    }
    lvUp(e) {
        const t = CTreasureData.Instance.getData(e);
        const n = _TeasureLevelConfig.Instance.getData(t.id, t.level).cost;
        _.each(n, function (e) {
            const t = e.split("|");
            UserData.Instance.subItem(Number(t[0]), Number(NumberPlus.decode(t[1])));
        });
        CTreasureData.Instance.lvup(e);
        CTreasureData.Instance.calcAllProps();
        this.recalcEffect(e);
        return true;
    }
    lvUpEnable(e) {
        let t = true;
        const n = CTreasureData.Instance.getData(e);
        if (_.isNil(n) || _.isEmpty(n))
            return false;
        if (_TeasureConfig.Instance.get(e).maxLevel <= n.level)
            return false;
        const o = _TeasureLevelConfig.Instance.getData(n.id, n.level).cost;
        _.each(o, function (e) {
            const n = e.split("|");
            const o = UserData.Instance.getItem(Number(n[0]));
            NumberPlus.compare(o, NumberPlus.decode(n[1])) || (t = false);
        });
        return t;
    }
    recalcEffect(e) {
        const t = this.getEffectObj(e);
        t.recalc && t.recalc();
    }
    unEquip(e) {
        const t = _TeasureConfig.Instance.get(e);
        if (CTreasureData.Instance.getEquip(t.type) != e)
            return false;
        const n = CTreasureData.Instance.getData(e);
        if (_.isNil(n))
            return false;
        CTreasureData.Instance.removeEquip(e);
        this.unactiveEffect(e);
        return true;
    }
    unactiveEffect(e) {
        const t = this.effects[e];
        t && (t.isActive = !1);
    }
}
