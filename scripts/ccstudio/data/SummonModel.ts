import _GearConfig from "../config/_GearConfig";
import LocalStorageTool from "../utils/LocalStorage";
import ModeBase from "./ModelBase";
import Model from "./Model";
import UserData from "../../modules/user/UserData";
import { EVideoType } from "../../modules/common/ViedioType";
import LanMgr from "../../modules/common/Language";
import _PartnerConfig from "../config/_PartnerConfig";
import _SkillConfig from "../config/_SkillConfig";
import _SummonExtraConfig from "../config/_SummonExtraConfig";
import _SummonWidgetConfig from "../config/_SummonWidgetConfig";
import MyTools from "../utils/MyTools";
import Utils_ from "../utils/Utils";
import { GlobalEventName } from "../../modules/common/Events";
import { GameConst, E_GEAR_TYPE, E_SUMMON_TYPE, E_QUEST_ACTIVE_ID, MapUIPrefabs, E_ASSET_TYPE, Q_NAME } from "../../modules/common/Const";
import AdsManager, { EVideoStatus } from "../../modules/ads/AdsManager";
const _: any = window["_"];
const m: any = window["moment"];
export default class SummonModel extends ModeBase {
    DiamondSummon = function (e, t) {
        const n = this.diamondSummonCount[t] || 0;
        if (n == 0) {
            cc.error("summon price error:", t);
            return null;
        }
        if (!(t > parseInt(UserData.Instance.getItem(E_ASSET_TYPE.Diamond)))) {
            const o = E_SUMMON_TYPE[e];
            if (UserData.Instance.subItem(E_ASSET_TYPE.Diamond, t, {
                type: o
            })) {
                return this.summon(e, n);
            }
            else {
                return null;
            }
        }
    };
    adSummon = async function (e) {
        const t = this.summonAdDate[e];
        const n = m(MyTools.GetTimeNow()).subtract(8, "hours").startOf("days").add(8, "hours");
        const o = _.get(t.dayCnts, n.format(), 0);
        if (t.last && t.last.isAfter(n)) {
            if (m(MyTools.GetTimeNow()).diff(t.last, "seconds") < 60 * GameConst.SUMMON_AD_INTERVAL) {
                return false;
            }
            if (o >= GameConst.SUMMON_AD_DAILY_COUNT) {
                return false;
            }
        }
        let i = function () { };
        let a = "";
        if (e == E_SUMMON_TYPE.Gear) {
            a = EVideoType.AdGear;
        }
        else if (e == E_SUMMON_TYPE.Skill) {
            a = EVideoType.AdSkill;
        }
        else if (e == E_SUMMON_TYPE.Partner) {
            a = EVideoType.AdPartner;
        }
        const l = {
            AdsType: a,
            OpenUi: a,
            onSucceed: i
        };
        const result = await AdsManager.getInstance().showRewardedVideo(l);
        if (result == EVideoStatus.Success) {
            const u = this.calcAdSummonCnt(e);
            _.set(t, "last", m(MyTools.GetTimeNow()));
            _.set(t.dayCnts, n.format(), o + 1);
            const p = _.get(t, "total", 0);
            _.set(t, "total", p + 1);
            const f = await this.summon(e, u);
            this.saveAd();
            return f;
        }
        else {
            return false;
        }
    };
    private diamondSummonCount: any = {};
    doSummon = function (e: number, t: any[], n: number): {
        id: number;
        isNew: boolean;
    }[] {
        const o: any[] = [];
        for (let r = 0; r < n; r++) {
            const i = Utils_.getRandIndex_(t) + 1;
            const a = this.summonMethods[e];
            if (!a) {
                cc.error(`Can't find method, type '${e}'`);
                continue;
            }
            o.push(a.call(this, i));
        }
        const s: {
            id: number;
            isNew: boolean;
        }[] = [];
        switch (e) {
            case E_SUMMON_TYPE.Gear:
            case E_SUMMON_TYPE.Weapon:
            case E_SUMMON_TYPE.Armor:
                _.each(o, function (e: any) {
                    const t = Model.gear.getData(e);
                    const n = _.isNil(t);
                    s.push({
                        id: e,
                        isNew: n
                    });
                });
                Model.gear.addGears(o);
                break;
            case E_SUMMON_TYPE.Partner:
                _.each(o, function (e: any) {
                    const t = Model.partner.getData(e);
                    const n = _.isNil(t);
                    s.push({
                        id: e,
                        isNew: n
                    });
                });
                Model.partner.addPartners(o);
                break;
            case E_SUMMON_TYPE.Skill:
                _.each(o, function (e: any) {
                    const t = Model.skill.getData(e);
                    const n = _.isNil(t);
                    s.push({
                        id: e,
                        isNew: n
                    });
                });
                Model.skill.addSkills(o);
                break;
        }
        return s;
    };
    openSummonResults = async function (e, t) {
        return new Promise((resolve) => {
            Model.ui.openViewAsync(MapUIPrefabs.SummonResult, {
                priority: 2,
                data: {
                    type: e,
                    results: t
                }
            }).then((result) => {
                result.once("removed", resolve);
            });
        });
    };
    private summonAdDate: any = {};
    summonArmor = function (e: number, t: boolean = false): number | undefined {
        let n = _GearConfig.Instance.getGearsWithQuality(E_GEAR_TYPE.ARMOR, e);
        let o = _GearConfig.Instance.getGearsWithQualityUp(E_GEAR_TYPE.WEAPON, e);
        if (_.isEmpty(n)) {
            cc.error(`未找到对应品质的防具物品：quality:${e}`);
            return undefined;
        }
        if (t) {
            o = 0;
            n = _.filter(n, function (e: any) {
                const t = Model.gear.getData(e.id);
                if (!_.isNil(t)) {
                    o += e.rate;
                    return true;
                }
            });
        }
        return Utils_.getItemByWeight<any>(n, function (e) {
            return e.rate;
        }, o).id;
    };
    summonGear = function (e: number, t: boolean = false): number | undefined {
        let n = _GearConfig.Instance.getQualityGears(e);
        if (_.isEmpty(n)) {
            cc.error(`未找到对应品质的装备物品：quality:${e}`);
            return undefined;
        }
        _GearConfig.Instance.getQualityRateUp(e);
        if (t) {
            let o = 0;
            n = _.filter(n, function (e: any) {
                const t = Model.gear.getData(e.id);
                return !_.isNil(t) && (e.rate, true);
            });
        }
        return Utils_.getItemByWeight<any>(n, function (e) {
            return e.rate;
        }).id;
    };
    private summonLvs: any = {};
    private summonMethods: any = {};
    summonPartner = function (e: number, t: boolean = false): number | undefined {
        let n = _PartnerConfig.Instance.getQualityPartners(e);
        let o = _PartnerConfig.Instance.getQualityRateUp(e);
        if (_.isEmpty(n)) {
            cc.error(`未找到对应品质的伙伴物品：quality:${e}`);
            return undefined;
        }
        if (t) {
            n = _.filter(n, function (e: any) {
                return !!Model.partner.getData(e.id) && (e.rate, true);
            });
        }
        return Utils_.getItemByWeight(n, function (e) {
            return e.rate;
        }, o).id;
    };
    summonSkill = function (e: number, t: boolean = false): number | undefined {
        let n = _SkillConfig.Instance.getQualitySkills(e);
        if (_.isEmpty(n)) {
            cc.error(`未找到对应品质的技能物品：quality:${e}`);
            return undefined;
        }
        if (t) {
            n = _.filter(n, function (e: any) {
                return !_.isNil(Model.skill.getData(e.id));
            });
        }
        return n[Math.floor(Math.random() * _.keys(n).length)].id;
    };
    summonWeapon = function (e: number, t: boolean = false): number | undefined {
        let n = _GearConfig.Instance.getGearsWithQuality(E_GEAR_TYPE.WEAPON, e);
        let o = _GearConfig.Instance.getGearsWithQualityUp(E_GEAR_TYPE.WEAPON, e);
        if (_.isEmpty(n)) {
            cc.error(`未找到对应品质的武器物品：quality:${e}`);
            return undefined;
        }
        if (t) {
            o = 0;
            n = _.filter(n, function (e: any) {
                const t = Model.gear.getData(e.id);
                if (!_.isNil(t)) {
                    o += e.rate;
                    return true;
                }
            });
        }
        return Utils_.getItemByWeight<any>(n, function (e) {
            return e.rate;
        }, o).id;
    };
    addExp(e: number, t: number): number {
        const n = this.getLvData(e);
        n.total += t;
        let o = 0;
        if (n.level <= GameConst.SUMMON_LVUP_COUNTS.length) {
            n.count += t;
            const r = GameConst.SUMMON_LVUP_COUNTS[n.level - 1];
            if (n.count >= r) {
                n.level++;
                o++;
                if (n.level <= GameConst.SUMMON_LVUP_COUNTS.length) {
                    n.count -= r;
                }
                else {
                    n.count = r;
                }
            }
        }
        this.save();
        return o;
    }
    calcAdSummonCnt(e: any) {
        if (e !== E_SUMMON_TYPE.Weapon && e !== E_SUMMON_TYPE.Armor) {
            e = E_SUMMON_TYPE.Gear;
        }
        const t = this.getAdData(e);
        const n = _.get(t, "total", 0);
        const o = GameConst.SUMMON_AD_INITIAL + n;
        return Math.min(GameConst.SUMMON_AD_LIMIT, o);
    }
    getAdCd(e: any) {
        if (e !== E_SUMMON_TYPE.Weapon && e !== E_SUMMON_TYPE.Armor) {
            e = E_SUMMON_TYPE.Gear;
        }
        const t = this.getAdData(e).last;
        if (t) {
            const n = m(MyTools.GetTimeNow()).subtract(8, "hours").startOf("days").add(8, "hours").format();
            if (t.isBefore(n)) {
                return 0;
            }
            const o = m(MyTools.GetTimeNow());
            return 60 * GameConst.SUMMON_AD_INTERVAL - o.diff(t, "seconds");
        }
        return 0;
    }
    getAdCount(e: any) {
        if (e !== E_SUMMON_TYPE.Weapon && e !== E_SUMMON_TYPE.Armor) {
            e = E_SUMMON_TYPE.Gear;
        }
        const t = m(MyTools.GetTimeNow()).subtract(8, "hours").startOf("days").add(8, "hours").format();
        const n = this.getAdData(e);
        const o = _.get(n.dayCnts, t, 0);
        return GameConst.SUMMON_AD_DAILY_COUNT - o;
    }
    getAdData(e: any) {
        return e == E_SUMMON_TYPE.Weapon || e == E_SUMMON_TYPE.Armor ? this.summonAdDate[E_SUMMON_TYPE.Gear] : this.summonAdDate[e];
    }
    getLvData(e: any) {
        return e == E_SUMMON_TYPE.Weapon || e == E_SUMMON_TYPE.Armor ? this.summonLvs[E_SUMMON_TYPE.Gear] : this.summonLvs[e];
    }
    public getQualityName(e: number) {
        return LanMgr.Instance.getLangByID(Q_NAME[e + 1]);
    }
    initLoadData() { }
    load() {
        this.summonMethods = {
            [E_SUMMON_TYPE.Skill]: this.summonSkill,
            [E_SUMMON_TYPE.Partner]: this.summonPartner,
            [E_SUMMON_TYPE.Gear]: this.summonGear,
            [E_SUMMON_TYPE.Weapon]: this.summonWeapon,
            [E_SUMMON_TYPE.Armor]: this.summonArmor,
        };
        this.diamondSummonCount[GameConst.SUMMON_PRICE_NORMAL] = 11;
        this.diamondSummonCount[GameConst.SUMMON_PRICE_FULL] = 35;
        this.summonLvs = LocalStorageTool.getItemLocal("cc_summon-levels", {
            [E_SUMMON_TYPE.Gear]: {
                level: 1,
                count: 0,
                total: 0
            },
            [E_SUMMON_TYPE.Skill]: {
                level: 1,
                count: 0,
                total: 0
            },
            [E_SUMMON_TYPE.Partner]: {
                level: 1,
                count: 0,
                total: 0
            },
        });
        const o = LocalStorageTool.getItemLocal("cc_summon-ad-datas", {
            [E_SUMMON_TYPE.Gear]: {
                last: null,
                dayCnts: {},
                total: 0
            },
            [E_SUMMON_TYPE.Skill]: {
                last: null,
                dayCnts: {},
                total: 0
            },
            [E_SUMMON_TYPE.Partner]: {
                last: null,
                dayCnts: {},
                total: 0
            },
        });
        const r = m(MyTools.GetTimeNow());
        this.summonAdDate = {};
        let i = !1;
        _.each(o, (e: any, t: string) => {
            let last = e.last && m(e.last);
            if (last && last.isAfter(r)) {
                last = r;
                i = !0;
            }
            this.summonAdDate[t] = {
                last: last,
                dayCnts: e.dayCnts,
                total: e.total
            };
        });
        if (i) {
            this.saveAd();
        }
    }
    public randomSummon(e: number) {
        const result: {
            type: any;
            id: number;
        }[] = [];
        const summonCount: {
            [key: string]: {
                count: number;
                total: number;
            };
        } = {
            [E_QUEST_ACTIVE_ID.SummonGear]: { count: 0, total: 0 },
            [E_QUEST_ACTIVE_ID.SummonPartner]: { count: 0, total: 0 },
            [E_QUEST_ACTIVE_ID.SummonSkill]: { count: 0, total: 0 },
        };
        const isSummonTypeSelected: {
            [key: string]: boolean;
        } = {
            [E_SUMMON_TYPE.Weapon]: false,
            [E_SUMMON_TYPE.Armor]: false,
            [E_SUMMON_TYPE.Partner]: false,
            [E_SUMMON_TYPE.Skill]: false,
        };
        for (let u = 0; u < e; u++) {
            const p = Utils_.getItemByWeight([E_SUMMON_TYPE.Weapon, E_SUMMON_TYPE.Armor, E_SUMMON_TYPE.Partner, E_SUMMON_TYPE.Skill], () => 10, 40);
            const f = this.getLvData(p);
            const d = _SummonWidgetConfig.Instance.get(f.level);
            const g = Utils_.getRandIndex_(d) + 1;
            const v = this.summonMethods[p];
            if (!v) {
                cc.error(`Can't find method, type '${p}'`);
            }
            const _ = v.call(this, g);
            if (this.addExp(p, 1) > 0) {
                isSummonTypeSelected[p] = true;
            }
            switch (p) {
                case E_SUMMON_TYPE.Gear:
                case E_SUMMON_TYPE.Weapon:
                case E_SUMMON_TYPE.Armor:
                    summonCount[E_QUEST_ACTIVE_ID.SummonGear].count++;
                    summonCount[E_QUEST_ACTIVE_ID.SummonGear].total = f.total;
                    break;
                case E_SUMMON_TYPE.Partner:
                    summonCount[E_QUEST_ACTIVE_ID.SummonPartner].count++;
                    summonCount[E_QUEST_ACTIVE_ID.SummonPartner].total = f.total;
                    break;
                case E_SUMMON_TYPE.Skill:
                    summonCount[E_QUEST_ACTIVE_ID.SummonSkill].count++;
                    summonCount[E_QUEST_ACTIVE_ID.SummonSkill].total = f.total;
                    break;
            }
            result.push({
                type: p,
                id: _,
            });
        }
        // return new Promise((resolve) => {
        //     this.scheduleOnce(() => {
        _.each(isSummonTypeSelected, (isSelected, t) => {
            const n = parseInt(t);
            if (isSelected) {
                cc.director.emit(GlobalEventName.SummonLevelChange, n);
            }
            else {
                cc.director.emit(GlobalEventName.SummonExpChange, n);
            }
        });
        _.each(summonCount, (countSet, t) => {
            const n = countSet.count;
            const o = countSet.total;
            if (n > 0) {
                const r = parseInt(t);
                cc.director.emit(GlobalEventName.QuestCommit, r, o);
            }
        });
        const itemMap: {
            [key: number]: number;
        } = {};
        _.each(result, (e) => {
            const n = e.type;
            const o = e.id;
            itemMap[o] = itemMap[o] ? itemMap[o] + 1 : 1;
            cc.director.emit(GlobalEventName.SummonSuccess, n);
        });
        _.each(itemMap, (count, t) => {
            const n = parseInt(t);
            UserData.Instance.addMemItem(n, count);
        });
        cc.director.emit(GlobalEventName.QuestBatchCommit, E_QUEST_ACTIVE_ID.Summon, e);
        // resolve(result);
        // });
        // });
        return result;
    }
    save() {
        LocalStorageTool.setItemLocal("cc_summon-levels", this.summonLvs);
    }
    saveAd() {
        const e: {
            [key: string]: any;
        } = {};
        _.each(this.summonAdDate, (t: any, n: string) => {
            const o = parseInt(n);
            e[o] = {
                last: t.last && t.last.format(),
                dayCnts: t.dayCnts,
                total: t.total
            };
        });
        LocalStorageTool.setItemLocal("cc_summon-ad-datas", e);
    }
    async summon(e, t) {
        const n = this.getLvData(e);
        const o = _SummonWidgetConfig.Instance.get(n.level);
        const r = this.doSummon(e, o, t);
        switch (e) {
            case E_SUMMON_TYPE.Gear:
            case E_SUMMON_TYPE.Weapon:
            case E_SUMMON_TYPE.Armor:
                cc.director.emit(GlobalEventName.QuestBatchCommit, E_QUEST_ACTIVE_ID.SummonGear, t, n.total);
                break;
            case E_SUMMON_TYPE.Partner:
                cc.director.emit(GlobalEventName.QuestBatchCommit, E_QUEST_ACTIVE_ID.SummonPartner, t, n.total);
                break;
            case E_SUMMON_TYPE.Skill:
                cc.director.emit(GlobalEventName.QuestBatchCommit, E_QUEST_ACTIVE_ID.SummonSkill, t, n.total);
                break;
        }
        cc.director.emit(GlobalEventName.QuestBatchCommit, E_QUEST_ACTIVE_ID.Summon, t);
        cc.director.emit(GlobalEventName.SummonSuccess, e);
        await this.openSummonResults(e, r);
        const expChange = this.addExp(e, t);
        if (expChange > 0) {
            cc.director.emit(GlobalEventName.SummonLevelChange, e);
        }
        else {
            cc.director.emit(GlobalEventName.SummonExpChange, e);
        }
        return r;
    }
    public summonExtra(e: number, t: number) {
        const n = _SummonExtraConfig.Instance.get(t);
        const o = this.doSummon(e, n, 1)[0];
        const r = o.id;
        return o.isNew, r;
    }
    ;
}
