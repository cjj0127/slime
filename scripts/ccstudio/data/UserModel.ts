import _AssetConfig from "../config/_AssetConfig";
import _HeroConfig from "../config/_HeroConfig";
import HeroData from "../../modules/hero/HeroData";
import LocalStorageTool from "../utils/LocalStorage";
import PartnerModel from "./PartnerModel";
import SummonModel from "./SummonModel";
import ModeBase from "./ModelBase";
import Model from "./Model";
import NumberPlus from "../utils/NumberPlus";
import _PartnerConfig from "../config/_PartnerConfig";
import MyTools from "../utils/MyTools";
import UnlockData from "../../modules/unlock/UnlockData";
import UserData from "../../modules/user/UserData";
import UserProp from "../../modules/user/UserProp";
import { GlobalEventName } from "../../modules/common/Events";
import { ENUM_PROP_TYPE, E_ITEM_TYPE, EUNLOCKSYS_ID } from "../../modules/common/Const";
const _: any = window["_"];
const moment: any = window['moment'];
export default class UserModel extends ModeBase {
    private _lastLoginTime = moment();
    calcPropMethods = {};
    criticalChance = null;
    criticalDamage = null;
    heroAspd = null;
    heroAtk = null;
    heroMaxHp = null;
    hpRecovery = null;
    propAddations = {};
    totalAtk = null;
    updateon: boolean = false;
    public addAsset(e: any, t: number = 1) {
        switch (_AssetConfig.Instance.get(e).type) {
            case E_ITEM_TYPE.Asset:
                UserData.Instance.addItem(e, t);
                break;
            case E_ITEM_TYPE.Gear:
                Model.gear.addGear(e, Number(t));
                break;
            case E_ITEM_TYPE.Hero:
                Model.hero.unlock(e);
                break;
            case E_ITEM_TYPE.Partner:
                Model.partner.addPartner(e, Number(t));
                break;
            case E_ITEM_TYPE.Skill:
                Model.skill.addSkill(e, Number(t));
        }
    }
    public addPropAddation(e: any) {
        const t = e.prop;
        const n = _.get(this.propAddations, t, []);
        if (_.indexOf(n, e) < 0) {
            n.push(e);
        }
        _.set(this.propAddations, e.prop, n);
        cc.director.emit(GlobalEventName.PropChange, t);
    }
    calcAddationCoins(e): number {
        let t = this.calcPropAddation(ENUM_PROP_TYPE.CoinAdd);
        if ("0" !== t && NumberPlus.compare(t, 0)) {
            let n = e, o = NumberPlus.div(NumberPlus.mul(n, t), 100);
            e = NumberPlus.add(n, o);
        }
        t = this.calcPropAddation(ENUM_PROP_TYPE.BlessCoins);
        if ("0" !== t && NumberPlus.compare(t, 0)) {
            let n = e, o = NumberPlus.div(NumberPlus.mul(n, t), 100);
            e = NumberPlus.add(n, o);
        }
        return e;
    }
    calcAtk(): number {
        const e = UserProp.Instance.getData(ENUM_PROP_TYPE.ATK);
        if (this.heroAtk = "0", _.isNil(e))
            return 0;
        let t = e.value;
        const n = _.get(this.propAddations, ENUM_PROP_TYPE.BaseAtk, []);
        if (n.length > 0) {
            _.each(n, function (e: any) {
                t = NumberPlus.add(t, e.value);
            });
        }
        const o = _.get(this.propAddations, ENUM_PROP_TYPE.ATK, []);
        if (o.length > 0) {
            _.each(o, function (e: any) {
                const n = NumberPlus.div(NumberPlus.mul(t, e.value), 100);
                t = NumberPlus.add(t, n);
            });
        }
        const r = this.calcPropAddation(ENUM_PROP_TYPE.BlessAtk);
        if (NumberPlus.compare(r, 0)) {
            const i = t;
            const s = NumberPlus.div(NumberPlus.mul(i, r), 100);
            t = NumberPlus.add(i, s);
        }
        const c = _.get(this.propAddations, ENUM_PROP_TYPE.AddAtk, []);
        if (c.length > 0) {
            _.each(c, function (e: any) {
                t = NumberPlus.add(t, e.value);
            });
        }
        this.heroAtk = t;
        return t;
    }
    calcBossDamage(e: number): number {
        let t = this.calcPropAddation(ENUM_PROP_TYPE.BossDamageAmount);
        if ("0" != t && NumberPlus.compare(t, 0)) {
            const n = e;
            const o = NumberPlus.div(NumberPlus.mul(n, t), 100);
            e = NumberPlus.add(e, o);
        }
        return e;
    }
    calcCriticalChance(): number {
        const e = UserProp.Instance.getData(ENUM_PROP_TYPE.CriticalHitChance);
        if (this.criticalChance = "0", _.isNil(e))
            return 0;
        let t = e.value;
        const n = this.calcPropAddation(ENUM_PROP_TYPE.CriticalHitChance);
        if ("0" != n) {
            t = NumberPlus.add(t, n);
        }
        this.criticalChance = t;
        return t;
    }
    calcCriticalDamage_(): number {
        const e = UserProp.Instance.getData(ENUM_PROP_TYPE.CriticalHitDamage);
        if (this.criticalDamage == "0" || _.isNil(e))
            return 0;
        let t = e.value, n = this.calcPropAddation(ENUM_PROP_TYPE.CriticalHitDamage);
        if ("0" !== n)
            t = NumberPlus.add(t, n);
        this.criticalDamage = t;
        return t;
    }
    calcEnemyDamage(e): number {
        const t = this.calcPropAddation(ENUM_PROP_TYPE.EnemyDamagePercent);
        if ("0" !== t && "100" !== t) {
            e = NumberPlus.div(NumberPlus.mul(e, t), 100);
        }
        return e;
    }
    calcHeroExp(e): number {
        const t = parseInt(this.calcPropAddation(ENUM_PROP_TYPE.HeroExpAdd));
        if (t > 0) {
            let n = e;
            e = n + Math.floor((n * t) / 100);
        }
        return e;
    }
    calcHp(): number {
        const e = UserProp.Instance.getData(ENUM_PROP_TYPE.HP);
        if (this.heroMaxHp = "0", _.isNil(e))
            return 0;
        let t = e.value;
        const n = _.get(this.propAddations, ENUM_PROP_TYPE.BaseHP, []);
        if (n.length > 0) {
            _.each(n, function (e: any) {
                t = NumberPlus.add(t, e.value);
            });
        }
        const o = _.get(this.propAddations, ENUM_PROP_TYPE.HP, []);
        if (o.length > 0) {
            _.each(o, function (e: any) {
                const n = NumberPlus.div(NumberPlus.mul(t, e.value), 100);
                t = NumberPlus.add(t, n);
            });
        }
        this.heroMaxHp = t;
        return t;
    }
    calcHpRecovery(): number {
        const e = UserProp.Instance.getData(ENUM_PROP_TYPE.HPRecovery);
        if (this.hpRecovery = "0", _.isNil(e))
            return 0;
        let t = e.value;
        let n = this.calcPropAddation(ENUM_PROP_TYPE.HPRecovery);
        if ("0" != n) {
            n = NumberPlus.mul(t, n);
            t = NumberPlus.add(t, NumberPlus.div(n, 100));
        }
        const o = _.get(this.propAddations, ENUM_PROP_TYPE.HP, []);
        if (o.length > 0) {
            _.each(o, function (e: any) {
                const n = NumberPlus.div(NumberPlus.mul(t, e.value), 100);
                t = NumberPlus.add(t, n);
            });
        }
        this.hpRecovery = t;
        return t;
    }
    calcMemberAspd(e: number) {
        const t = _HeroConfig.Instance.get(e).aspd;
        const n = this.calcPropAddation(ENUM_PROP_TYPE.PartnerAspd);
        return NumberPlus.add(t, NumberPlus.div(NumberPlus.mul(t, n), 100));
    }
    calcMemberAtk(e: number) {
        const t = _HeroConfig.Instance.get(e);
        const o = t.atk;
        const r = t.atkUP;
        const i = HeroData.Instance.getData(e).level;
        const a = this.getHeroAtk();
        const s = NumberPlus.add(o, NumberPlus.mul(i - 1, r));
        return NumberPlus.div(NumberPlus.mul(a, s), 100);
    }
    calcNormalDamage(e): number {
        const t = this.calcPropAddation(ENUM_PROP_TYPE.NormalAtk);
        if ("0" !== t) {
            let n = NumberPlus.div(NumberPlus.mul(e, t), 100);
            e = NumberPlus.add(e, n);
        }
        return e;
    }
    calcPartnerAspd(e: number) {
        let cfg = _PartnerConfig.Instance.get(e);
        const o = Model.partner.getProp(e).aspd;
        const r = this.calcPropAddation(ENUM_PROP_TYPE.PartnerAspd);
        let i = NumberPlus.add(o, NumberPlus.div(NumberPlus.mul(o, r), 100));
        _.each(cfg.flg, (e) => {
            switch (e) {
                case 2:
                    {
                        let n = this.calcPropAddation(ENUM_PROP_TYPE.PartnerAspdRelic2);
                        if ("0" != n) {
                            i = NumberPlus.add(i, n);
                        }
                    }
                    break;
                case 12:
                    {
                        let n = this.calcPropAddation(ENUM_PROP_TYPE.PartnerAspdRelic12);
                        if ("0" != n) {
                            i = NumberPlus.add(i, n);
                        }
                    }
                    break;
            }
        });
        return i;
    }
    calcPartnerAtk(e: number) {
        const n = _PartnerConfig.Instance.get(e);
        const o = Model.partner.getProp(e).atk;
        const r = this.calcPropAddation(ENUM_PROP_TYPE.PartnerAtk);
        let i = NumberPlus.add(o, NumberPlus.div(NumberPlus.mul(o, r), 100));
        _.each(n.flg, (e) => {
            switch (e) {
                case 3:
                    const n = this.calcPropAddation(ENUM_PROP_TYPE.PartnerAtkRelic3);
                    if ("0" != n) {
                        const r = NumberPlus.div(NumberPlus.mul(o, n), 100);
                        i = NumberPlus.add(i, r);
                    }
            }
        });
        return i;
    }
    calcProp(e: any): string {
        const t = this.calcPropMethods[e];
        return t ? t.call(this) : this.calcPropValue(e);
    }
    calcPropAddation(e: any): any {
        let t = "0";
        const n = _.get(this.propAddations, e, []);
        if (n.length > 0) {
            _.each(n, function (e: any) {
                t = NumberPlus.add(t, e.value);
            });
        }
        return t;
    }
    calcPropValue(e: string): number {
        const t = UserProp.Instance.getData(e);
        if (_.isNil(t))
            return 0;
        const n = t.value;
        let o = this.calcPropAddation(e);
        if ("0" != o) {
            o = NumberPlus.mul(n, o);
            return NumberPlus.add(n, NumberPlus.div(o, 100));
        }
        else {
            return n;
        }
    }
    calcSkillCd(): number {
        const e = _.get(this.propAddations, ENUM_PROP_TYPE.SkillCd, []);
        let t = 1;
        if (e.length > 0) {
            _.each(e, (e) => {
                let n = _.toNumber(e.value) / 100;
                n < 1 && (t *= 1 - n);
            });
        }
        const n = _.toNumber(this.calcPropAddation(ENUM_PROP_TYPE.BlessSkill));
        if (n < 200 && n > 100) {
            let o = _.toNumber(n - 100) / 100;
            t *= 1 - o;
        }
        return t;
    }
    calcSkillDamage(e): number {
        const t = this.calcPropAddation(ENUM_PROP_TYPE.SkillHurtAdd);
        if ("0" !== t) {
            let n = NumberPlus.div(NumberPlus.mul(e, t), 100);
            e = NumberPlus.add(e, n);
        }
        return e;
    }
    calcTotalAspd(): string {
        let e = this.calcProp(ENUM_PROP_TYPE.ASPD), t = this.calcPropAddation(ENUM_PROP_TYPE.BuffAspd);
        if ("0" !== t) {
            e = NumberPlus.add(e, t);
        }
        this.heroAspd = e;
        return e;
    }
    calcTotalAtk() {
        const e = this.getHeroHp();
        const t = this.getHeroAtk();
        const n = this.calcProp(ENUM_PROP_TYPE.ASPD);
        const o = this.calcProp(ENUM_PROP_TYPE.CriticalHitChance);
        let r = this.calcProp(ENUM_PROP_TYPE.CriticalHitDamage);
        let i = this.calcProp(ENUM_PROP_TYPE.DoubleShot);
        let a = this.calcProp(ENUM_PROP_TYPE.TripleShot);
        const s = this.calcProp(ENUM_PROP_TYPE.NormalAtk);
        const c = this.calcProp(ENUM_PROP_TYPE.SkillHurtAdd);
        const p = this.calcProp(ENUM_PROP_TYPE.BossDamageAmount);
        let f = NumberPlus.mul(t, n);
        let d = NumberPlus.mul(NumberPlus.div(o, 100), NumberPlus.sub(NumberPlus.div(r, 100), 1));
        d = NumberPlus.add(1, d);
        let h = NumberPlus.add(100, NumberPlus.add(i, a));
        h = NumberPlus.div(h, 100),
            h = NumberPlus.add(NumberPlus.mul(h, NumberPlus.add(NumberPlus.div(s, 100), 1)), NumberPlus.div(c, 100));
        let g = NumberPlus.add(100, p);
        g = NumberPlus.div(g, 100),
            f = NumberPlus.mul(f, d),
            f = NumberPlus.mul(f, h),
            f = NumberPlus.mul(f, g),
            this.totalAtk = NumberPlus.add(e, f);
        return this.totalAtk;
    }
    public clearAddations() {
        _.map(this.propAddations, (t: any[]) => {
            _.each(t, (t) => {
                return t.targetOff(this);
            });
        });
        this.propAddations = {};
    }
    fixedUpdate() {
        if (!this.updateon)
            return;
        const e = moment(MyTools.GetTimeNow()).subtract(8, "hours").startOf("days").add(8, "hours");
        if (this._lastLoginTime.isBefore(e) && moment(MyTools.GetTimeNow()).isAfter(e)) {
            this._lastLoginTime = moment(MyTools.GetTimeNow());
            LocalStorageTool.setItemLocal("cc_USER-LAST-LOGIN", this._lastLoginTime.format());
        }
    }
    getCriticalChance(): number {
        this.criticalChance = this.criticalChance || this.calcCriticalChance();
        return this.criticalChance;
    }
    getCriticalDamage(): number {
        this.criticalDamage = this.criticalDamage || this.calcCriticalDamage_();
        return this.criticalDamage;
    }
    getHeroAspd(): number {
        this.heroAspd = this.heroAspd || this.calcTotalAspd();
        return this.heroAspd;
    }
    getHeroAtk(): number {
        this.heroAtk = this.heroAtk || this.calcAtk();
        return this.heroAtk;
    }
    getHeroHp(): number {
        this.heroMaxHp = this.heroMaxHp || this.calcHp();
        return this.heroMaxHp;
    }
    getHeroTotalAtk(): number {
        this.totalAtk = this.totalAtk || this.calcTotalAtk();
        return this.totalAtk;
    }
    getHpRecovery(): number {
        this.hpRecovery = this.hpRecovery || this.calcHpRecovery();
        return this.hpRecovery;
    }
    getUseItemMethod(e: number) {
        const n = _AssetConfig.Instance.get(e);
        const o = n.useMethod;
        const r = n.param;
        if ("" != o) {
            const i = this[o];
            return function () {
                return i.call(this, r);
            };
        }
        return null;
    }
    public initLoadData() {
        UserProp.Instance.init();
        const t = LocalStorageTool.getItemLocal("cc_USER-LAST-LOGIN");
        if (_.isNil(t)) {
            this._lastLoginTime = moment(MyTools.GetTimeNow());
            LocalStorageTool.setItemLocal("cc_USER-LAST-LOGIN", this._lastLoginTime.format());
        }
        else {
            this._lastLoginTime = moment(t);
        }
        // this.schedule(this.fixedUpdate, 1, cc.macro.REPEAT_FOREVER);
        this.updateon = true;
        cc.game.on(cc.game.EVENT_HIDE, () => {
            // this.unschedule(this.fixedUpdate);
            this.updateon = false;
        });
        cc.game.on(GlobalEventName.GameResume, () => {
            this.updateon = true;
            // this.schedule(this.fixedUpdate, 1, cc.macro.REPEAT_FOREVER, Math.random());
        });
    }
    isPartnerSlot(e: EUNLOCKSYS_ID) {
        return e == EUNLOCKSYS_ID.PartnerCol2 || e == EUNLOCKSYS_ID.PartnerCol3 || e == EUNLOCKSYS_ID.PartnerCol4 || e == EUNLOCKSYS_ID.PartnerCol5;
    }
    isPartnerSlotUnlockCondition(e: EUNLOCKSYS_ID) {
        return !(this.isPartnerSlot(e) && !Model.unlock.getUnlockState(EUNLOCKSYS_ID.Partner));
    }
    isSKillSlot(e: EUNLOCKSYS_ID) {
        return e == EUNLOCKSYS_ID.SkillCol2 || e == EUNLOCKSYS_ID.SkillCol3 || e == EUNLOCKSYS_ID.SkillCol4 || e == EUNLOCKSYS_ID.SkillCol5 || e == EUNLOCKSYS_ID.SkillCol6;
    }
    isSkillSlotUnlockCondition(e: EUNLOCKSYS_ID) {
        return !(this.isSKillSlot(e) && !Model.unlock.getUnlockState(EUNLOCKSYS_ID.Skill));
    }
    isUnlock(e: EUNLOCKSYS_ID) {
        return !!this.isSkillSlotUnlockCondition(e) && !!this.isPartnerSlotUnlockCondition(e) && this.isUnlockByType(e);
    }
    isUnlockByType(e: EUNLOCKSYS_ID) {
        return !!LocalStorageTool.getItemLocal("cc_user-unlock-GM") || Model.unlock.getUnlockState(e);
    }
    public load() {
        this.calcPropMethods[ENUM_PROP_TYPE.ATK] = this.calcAtk;
        this.calcPropMethods[ENUM_PROP_TYPE.BlessAtk] = this.calcAtk;
        this.calcPropMethods[ENUM_PROP_TYPE.HP] = this.calcHp;
        this.calcPropMethods[ENUM_PROP_TYPE.HPRecovery] = this.calcHpRecovery;
        this.calcPropMethods[ENUM_PROP_TYPE.CriticalHitChance] = this.calcCriticalChance;
        this.calcPropMethods[ENUM_PROP_TYPE.CriticalHitDamage] = this.calcCriticalDamage_;
        this.calcPropMethods[ENUM_PROP_TYPE.SkillCd] = this.calcSkillCd;
        this.calcPropMethods[ENUM_PROP_TYPE.BlessSkill] = this.calcSkillCd;
        UserData.Instance.load();
        UserProp.Instance.load();
    }
    public removePorpAddation(e: any) {
        e.targetOff(this);
        const t = e.prop;
        const n = _.get(this.propAddations, t, []);
        const o = _.indexOf(n, e);
        if (o >= 0) {
            _.pullAt(n, [o]);
        }
        cc.director.emit(GlobalEventName.PropChange, t);
    }
    summon(e: string) {
        return Model.summon.randomSummon(parseInt(e));
    }
    useItem(e: number) {
        const t = _AssetConfig.Instance.get(e);
        const n = t.useMethod;
        const o = t.param;
        if ("" != n) {
            const r = this[n];
            if (r) {
                return r.call(this, o);
            }
        }
        return null;
    }
}
