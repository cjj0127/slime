import LanMgr from "../../modules/common/Language";
import ModeBase from "./ModelBase";
import NumberPlus from "../utils/NumberPlus";
import _RelicConfig from "../config/_RelicConfig";
import _RelicCostConfig from "../config/_RelicCostConfig";
import RelicData_, { RELIC_TOTAL_COUNT } from "../../modules/relic/RelicData_";
import _RelicLevelConfig from "../config/_RelicLevelConfig";
import MsgHint from "../../modules/common/MsgHint";
import UserData from "../../modules/user/UserData";
import Utils_ from "../utils/Utils";
import { GlobalEventName } from "../../modules/common/Events";
import { E_ASSET_TYPE } from "../../modules/common/Const";
import BattleWorld from "../../modules/battle/BattleWorld";
const _: any = window['_'];
export default class RelicModel extends ModeBase {
    static _instance = null;
    effects: any = {};
    enemySpeedAddation: number = 1;
    activeEffect(e, t) {
        let n = this.effects[e];
        if (n) {
            n.isActive = !1;
        }
        n = this.getEffectObj(t);
        n.isActive = !0;
    }
    activeRelics() {
        const t = RelicData_.Instance.getAllEquipRelics();
        _.each(t, (t) => {
            const n = this.getEffectObj(t);
            n.recalc && n.recalc();
            n.isActive = !0;
        });
    }
    applyEnemySpeed(e) {
        return e * this.enemySpeedAddation;
    }
    applySkill(e) {
        const t = _RelicConfig.Instance.getSkillEffectId(e);
        if (!_.isNil(t) && t > 0) {
            const n = this.getEffectObj(t);
            return n.use && n.use.apply(n, _.slice(arguments, 1));
        }
        return null;
    }
    createEffect(e) {
        const t = _RelicConfig.Instance.get(e).effect;
        const n = BattleWorld.Instance.node.addComponent(t);
        //@ts-ignore
        n.relicId = e;
        return n;
    }
    equip(e) {
        const t = _RelicConfig.Instance.get(e);
        const n = RelicData_.Instance.getEquip(t.type);
        if (n == e)
            return !1;
        const o = RelicData_.Instance.getData(e);
        if (!_.isNil(o)) {
            RelicData_.Instance.equip(e);
            this.activeEffect(n, e);
            cc.director.emit(GlobalEventName.RelicEquipedChange, e);
            return !0;
        }
    }
    findEnable(): boolean {
        const e = RelicData_.Instance.getRelicCount();
        if (e >= RELIC_TOTAL_COUNT)
            return false;
        const t = _RelicCostConfig.Instance.get(e).cost, n = UserData.Instance.getItem(E_ASSET_TYPE.Fork);
        return NumberPlus.compare(n, t);
    }
    findRelic(): number {
        const e = RelicData_.Instance.getRelicCount();
        if (e >= RELIC_TOTAL_COUNT)
            return -1;
        const t = _RelicCostConfig.Instance.get(e).cost;
        if (UserData.Instance.subItem(E_ASSET_TYPE.Fork, t)) {
            const o = this.randomGenRelic();
            this.reportFind(o, t);
            return o;
        }
        MsgHint.tip(LanMgr.Instance.getLangByID("Not enough Fork"));
        return -1;
    }
    getEffectObj(e) {
        let t = this.effects[e];
        if (!t) {
            t = this.createEffect(e);
            this.effects[e] = t;
        }
        return t;
    }
    getSkillEffect(e) {
        const t = _RelicConfig.Instance.getSkillEffectId(e);
        return !_.isNil(t) && t > 0 ? this.getEffectObj(t) : null;
    }
    initLoadData() {
        RelicData_.Instance.init();
        RelicData_.Instance.activeProps();
    }
    isUnlockAll(e: number): boolean {
        const t = _RelicConfig.Instance.getTypeIds(e);
        for (let n = 0; n < t.length; n++) {
            const o = t[n];
            if (!RelicData_.Instance.getData(o))
                return false;
        }
        return true;
    }
    isUnlockType(e: number): boolean {
        const t = _RelicConfig.Instance.getTypeIds(e);
        for (let n = 0; n < t.length; n++) {
            const o = t[n];
            if (RelicData_.Instance.getData(o))
                return true;
        }
        return false;
    }
    lateUpdate() {
        RelicData_.Instance.save();
    }
    load() {
        RelicData_.Instance.load();
    }
    lvup(e: number): boolean {
        const t = RelicData_.Instance.getData(e), n = _RelicLevelConfig.Instance.getCost(t.type, t.level);
        if (!!UserData.Instance.subItem(E_ASSET_TYPE.Fork, n)) {
            RelicData_.Instance.lvup(e);
            RelicData_.Instance.calcAllProps();
            this.recalcEffect(e);
            this.reportLevelUp(e, t.level, n);
            cc.director.emit(GlobalEventName.RelicLvup, e);
            return true;
        }
    }
    lvupEnable(e: number): boolean {
        const t = RelicData_.Instance.getData(e);
        if (!_.isNil(t) && !_.isEmpty(t)) {
            if (_RelicConfig.Instance.get(e).maxLevel <= t.level)
                return false;
            const n = _RelicLevelConfig.Instance.getCost(t.type, t.level), o = UserData.Instance.getItem(E_ASSET_TYPE.Fork);
            return NumberPlus.compare(o, n);
        }
    }
    randomGenRelic(): number {
        let e = RelicData_.Instance.getRelicCount();
        let t = _RelicCostConfig.Instance.get(e).relicId;
        let n: number[] = [];
        if (t.length > 0) {
            n = _.clone(t);
        }
        else {
            let o: number[] = [];
            for (let r = e; r < RELIC_TOTAL_COUNT; r++) {
                const i = _RelicCostConfig.Instance.get(r);
                if (i.relicId.length > 0)
                    o.push(...i.relicId);
            }
            const a = _RelicConfig.Instance.getAll();
            let s = _.keys(a);
            for (let r = 0; r < s.length; r++) {
                const u = parseInt(s[r]);
                if (!RelicData_.Instance.getData(u)) {
                    const p = _RelicConfig.Instance.get(u), f = p.pre;
                    if (f > 0 && !this.isUnlockAll(f))
                        continue;
                    if (p.type > 1 && !this.isUnlockType(p.type - 1))
                        continue;
                    if (o.indexOf(u) == -1)
                        n.push(u);
                }
            }
        }
        const d = Utils_.getItemByWeight(n, e => _RelicConfig.Instance.get(e).rate);
        RelicData_.Instance.activeRelic(d);
        RelicData_.Instance.calcAllProps();
        return d;
    }
    recalcEffect(e) {
        const t = this.getEffectObj(e);
        t.recalc && t.recalc();
    }
    reportFind(e: number, t: number) {
        const n = {
            TreasureCoin_Cost: t,
            TreasureCoin_Num: UserData.Instance.getItem(E_ASSET_TYPE.Fork),
            Treasure_FInd_Num: RelicData_.Instance.getRelicCount(),
            Treasure_ID: e,
            Treasure_Type: `relic_type_${_RelicConfig.Instance.get(e).type}`
        };
    }
    reportLevelUp(e: number, t: number, n: number) {
        const o = {
            TreasureCoin_Cost: n,
            TreasureCoin_Num: UserData.Instance.getItem(E_ASSET_TYPE.Fork),
            Treasure_ID: e,
            Treasure_Level: t,
            Treasure_Type: `relic_type_${_RelicConfig.Instance.get(e).type}`
        };
    }
}
