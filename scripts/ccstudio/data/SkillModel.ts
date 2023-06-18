import SoundPlayerComp from "../utils/SoundPlayerComp";
import HeroData from "../../modules/hero/HeroData";
import LocalStorageTool from "../utils/LocalStorage";
import ModeBase from "./ModelBase";
import Model from "./Model";
import NumberPlus from "../utils/NumberPlus";
import PropAddationEventTarget from "../../modules/common/PropAddation";
import _SkillConfig from "../config/_SkillConfig";
import _SkillLevelConfig from "../config/_SkillLevelConfig";
import UnlockData from "../../modules/unlock/UnlockData";
import { GlobalEventName } from "../../modules/common/Events";
import { E_QUEST_ACTIVE_ID, GameConst, E_SKILL_TYPE, ENUM_PROP_TYPE, EUNLOCKSYS_ID, E_UNLOCK_STATE } from "../../modules/common/Const";
const _ = window["_"];
export default class SkillModel extends ModeBase {
    _auto = false;
    _equippedIds: number[] = [];
    _heroSkillId = -1;
    owenedPropAddation = null;
    ownedDatas = {};
    skillProps = {};
    
    addSkill(e: number, t: number = 1): void {
        let n = this.getData(e);
        if (_.isNil(n)) {
            n = this.ownedDatas[e] = {
                id: e,
                level: 1,
                count: t,
                total: t
            };
            this.calcAllProp();
            cc.director.emit(GlobalEventName.SkillLevelUp, {
                id: n.id,
                prev: 0,
                curr: 1
            });
        }
        else {
            n.count += t;
            n.total += t;
        }
        this.saveOwnedData();
        cc.director.emit(GlobalEventName.SkillOwnedChange);
    }
    
    
    addSkills(e) {
        const n = [];
        e.forEach((skill) => {
            let o, r;
            if (typeof skill == "number") {
                o = skill;
                r = 1;
            }
            else {
                o = skill.id;
                r = skill.count || 1;
            }
            var i = this.getData(o);
            if (i == null) {
                i = this.ownedDatas[o] = {
                    id: o,
                    level: 1,
                    count: r,
                    total: r
                };
                n.push({
                    id: o,
                    prev: 0,
                    curr: 1
                });
            }
            else {
                i.count += r;
                i.total += r;
            }
        });
        if (n.length > 0) {
            this.calcAllProp();
            cc.director.emit(GlobalEventName.SkillLevelUpAll, n);
        }
        this.saveOwnedData();
        cc.director.emit(GlobalEventName.SkillOwnedChange);
    }
    
    public calcAllProp(): void {
        let t = '0';
        _.each(this.ownedDatas, (n) => {
            const o = n.id;
            const r = this.calcProp(n.id, n.level);
            const i = r.value;
            const a = r.owned;
            this.skillProps[o] = {
                value: i,
                owned: a,
            };
            t = NumberPlus.add(t, a);
        });
        this.owenedPropAddation.value = t;
    }
    
    public calcBattleProp(e: any, t: string, n: string, o: number, quality: number): string {
        switch (e) {
            case ENUM_PROP_TYPE.ATK:
            case ENUM_PROP_TYPE.ASPD:
            case ENUM_PROP_TYPE.BuffAspd:
                return NumberPlus.add(t, NumberPlus.mul(n, o - 1));
            default: cc.error(`暂未实现属性：${e} `);
        }
        return '0';
    }
    
    public calcOwnedProp(e: number, t: number): string {
        return _SkillLevelConfig.Instance.get(e, t).owned;
    }
    
    public calcProp(e: any, t: number): {
        value: string;
        owned: string;
    } {
        const n = _SkillConfig.Instance.get(e);
        const o = this.calcOwnedProp(n.quality, t);
        return {
            value: this.calcBattleProp(n.baseProp, n.baseValue, n.upValue, t, n.quality),
            owned: o,
        };
    }
    
    public convertSkillSysIdToSlotIndex(e: number): number {
        return e % 100 - 1;
    }
    
    equip(e: number, t: number): void {
        let n = this.getEquipedId(e);
        this.equippedIds[e] = t;
        this.saveEquipedData();
        cc.director.emit(GlobalEventName.SkillEquipedChange, e, n);
    }
    
    findEmptySolt(): number | undefined {
        for (let e = 0; e < 6; e++) {
            if (-1 == _.get(this.equippedIds, e, -1) && !this.isLocked(e)) {
                return e;
            }
        }
    }
    
    public getAllData() {
        return this.ownedDatas;
    }
    
    public getAllSkills() {
        const t = _SkillConfig.Instance.getTypeSkills(E_SKILL_TYPE.Summon);
        return _.reduce(t, (n, o) => {
            const r = this.getData(o.id);
            n.push({
                cfg: o,
                data: r
            });
            return n;
        }, []);
    }
    // private skillProps: { [key: string]: { value: string, owned: string } };
    // private ownedDatas: any[];
    // private owenedPropAddation: { value: string };
    // public static _instance: I = null;
    // constructor() {
    //     super();
    //     this.skillProps = {};
    //     this.ownedDatas = [];
    //     this.owenedPropAddation = { value: '0' };
    // }
    
    public getBattleValue(e: string): string {
        let t: string;
        const n = this.skillProps[e];
        if (_.isNil(n)) {
            const o = _SkillConfig.Instance.get(e);
            t = this.calcBattleProp(o.baseProp, o.baseValue, o.upValue, 1, o.quality);
        }
        else {
            t = n.value;
        }
        return t;
    }
    
    getCurEquipString(): string {
        let e = "";
        for (let t = 0; t < this._equippedIds.length; t++) {
            let n = this.getData(this._equippedIds[t]) ? this.getData(this._equippedIds[t]).level : 0;
            e = 0 == t ? `${this._equippedIds[t].toString()}| ${n.toString()} ` : `${e},${this._equippedIds[t].toString()}| ${n.toString()} `;
        }
        return e;
    }
    
    public getData(e: number) {
        return this.ownedDatas[e];
    }
    
    public getEquipedId(e: number) {
        return _.get(this.equippedIds, e, -1);
    }
    
    public getEquipedIdx(e: number) {
        return _.findIndex(this.equippedIds, t => t == e);
    }
    
    getLvupMaxCnt(e, t) {
        const n = _SkillConfig.Instance.get(e);
        if (n == null) {
            cc.error("can't find skill cfg: ", e);
            return null;
        }
        return _SkillLevelConfig.Instance.get(n.quality, t).cost;
    }
    
    getMaxOwnId(): number {
        let e = this;
        let t = "0";
        let n = _.reduce(this.ownedDatas, function (n: any, o: any) {
            if (_.isNil(n)) {
                return o;
            }
            let r = e.calcProp(o.id, o.level).owned;
            return NumberPlus.compare(r, t) ? (t = r, o) : n;
        }, null);
        return _.isNil(n) ? -1 : n.id;
    }
    
    public getOwnedCount() {
        return _.keys(this.ownedDatas).length;
    }
    
    public getProp(e: number) {
        let t = this.skillProps[e];
        if (_.isNil(t)) {
            t = this.skillProps[e] = this.calcProp(e, 1);
        }
        return t;
    }
    
    public getSkillsWithQuality(e: number) {
        return _.reduce(this.ownedDatas, (t, n) => {
            if (_SkillConfig.Instance.get(n.id).quality == e)
                t.push(n.id);
            return t;
        }, []);
    }
    
    initLoadData(): void {
        this.heroSkillId = HeroData.Instance.battleSkillId;
    }
    
    public isLocked(e: number): boolean {
        const t = EUNLOCKSYS_ID.Skill + e;
        return Model.unlock.getData(t).state == E_UNLOCK_STATE.Locked;
    }
    
    public isWaitUnLock(e: number): boolean {
        const t = EUNLOCKSYS_ID.Skill + e;
        return Model.unlock.getData(t).state == E_UNLOCK_STATE.WaitUnlock;
    }
    
    load(): void {
        this.owenedPropAddation = new PropAddationEventTarget().setProp(ENUM_PROP_TYPE.ATK).active();
        this.loadOwnedData();
        this.loadEquipedData();
        this.loadSkillAuto();
        this.calcAllProp();
    }
    
    loadEquipedData(): void {
        this.equippedIds = LocalStorageTool.getItemLocal("cc_user_skill_equiped", [-1, -1, -1, -1, -1, -1]);
    }
    
    loadOwnedData(): void {
        this.ownedDatas = LocalStorageTool.getItemLocal("cc_user_skill_owned", {});
    }
    
    loadSkillAuto(): void {
        let e = LocalStorageTool.getItemLocal("cc_user_skill_auto_release", false);
        this._auto = 1 == e || "true" == e;
    }
    
    lvup(e) {
        const t = this.getData(e);
        if (t == null) {
            return false;
        }
        let n = t.level;
        const o = _SkillConfig.Instance.get(e);
        const r = _SkillLevelConfig.Instance.getMaxLevel(o.quality);
        while (t.level < r) {
            const i = this.getLvupMaxCnt(e, t.level);
            if (!(i > 0 && t.count >= i)) {
                break;
            }
            t.level++;
            t.count -= i;
        }
        const c = t.level;
        const u = {
            curr: c,
            id: t.id,
            prev: n
        };
        this.calcAllProp();
        this.saveOwnedData();
        SoundPlayerComp.Instance.playEffect("Audios/levelup_gear");
        cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.EnhanceSkill);
        cc.director.emit(GlobalEventName.SkillLevelUp, u);
        return u;
    }
    
    lvupAll() {
        const t = [];
        _.each(this.ownedDatas, (n) => {
            const o = n.level;
            const r = _SkillConfig.Instance.get(n.id);
            const i = _SkillLevelConfig.Instance.getMaxLevel(r.quality);
            while (n.level < i) {
                const a = this.getLvupMaxCnt(n.id, n.level);
                if (!(a > 0 && n.count >= a)) {
                    break;
                }
                n.count -= a;
                n.level++;
            }
            const s = n.level;
            if (s > o) {
                t.push({
                    id: n.id,
                    prev: o,
                    curr: s
                });
            }
        });
        if (t.length > 0) {
            this.calcAllProp();
            this.saveOwnedData();
            SoundPlayerComp.Instance.playEffect("Audios/levelup_gear");
            cc.director.emit(GlobalEventName.QuestBatchCommit, E_QUEST_ACTIVE_ID.EnhanceSkill, t.length);
            cc.director.emit(GlobalEventName.SkillLevelUpAll, t);
        }
        return t;
    }
    
    lvupAllEnable() {
        return Object.values(this.ownedDatas).some((t: any) => {
            const n = _SkillConfig.Instance.get(t.id);
            const o = _SkillLevelConfig.Instance.getMaxLevel(n.quality);
            const r = this.getLvupMaxCnt(t.id, t.level);
            return t.level < o && r > 0 && t.count >= r;
        });
    }
    
    lvupEnable(e) {
        const t = this.getData(e);
        if (t == null) {
            return false;
        }
        const n = _SkillConfig.Instance.get(e);
        const o = _SkillLevelConfig.Instance.getMaxLevel(n.quality);
        if (t.level < o) {
            const r = this.getLvupMaxCnt(e, t.level);
            return r && t.count >= r;
        }
        return false;
    }
    
    saveEquipedData(): void {
        LocalStorageTool.setItemLocal("cc_user_skill_equiped", this.equippedIds);
    }
    
    saveOwnedData(): void {
        LocalStorageTool.setItemLocal("cc_user_skill_owned", this.ownedDatas);
    }
    
    public transNext(e: number) {
        const t = this.getData(e);
        if (!t)
            return false;
        const n = Math.floor(t.count / GameConst.SKILLMAXLEVEL_NUM);
        const o = _SkillConfig.Instance.get(e).next;
        if (o > 0) {
            t.count %= GameConst.SKILLMAXLEVEL_NUM;
            this.addSkill(o, n);
        }
        const r = {
            count: n,
            id: o,
            prev: e
        };
        cc.director.emit(GlobalEventName.SkillTrans, r);
        return r;
    }
    
    public transNextAll() {
        const t = [];
        const n = [];
        _.each(this.ownedDatas, o => {
            const r = _SkillConfig.Instance.get(o.id);
            const i = _SkillLevelConfig.Instance.getMaxLevel(r.quality);
            if (o.level >= i && r.next > 0 && o.count >= GameConst.SKILLMAXLEVEL_NUM) {
                const s = Math.floor(o.count / GameConst.SKILLMAXLEVEL_NUM);
                o.count %= GameConst.SKILLMAXLEVEL_NUM;
                let c = this.getData(r.next)!;
                if (!c) {
                    c = {
                        id: r.next,
                        level: 1,
                        count: s,
                        total: s
                    };
                    this.ownedDatas[c.id] = c;
                    n.push({
                        id: c.id,
                        prev: 0,
                        curr: 1
                    });
                }
                else {
                    c.count += s;
                    c.total += s;
                }
                t.push({
                    id: r.next,
                    prev: o.id,
                    count: s
                });
            }
        });
        if (t.length > 0) {
            if (n.length > 0) {
                this.calcAllProp();
                cc.director.emit(GlobalEventName.SkillOwnedChange);
                cc.director.emit(GlobalEventName.SkillLevelUpAll, n);
            }
            this.saveOwnedData();
            cc.director.emit(GlobalEventName.SkillTransAll, t);
        }
        return t;
    }
    
    public transNextAllEnable() {
        return null != _.find(this.ownedDatas, e => {
            const t = _SkillConfig.Instance.get(e.id);
            const n = _SkillLevelConfig.Instance.getMaxLevel(t.quality);
            return e.level >= n && t.next > 0 && e.count >= GameConst.SKILLMAXLEVEL_NUM;
        });
    }
    
    transNextEnable(e) {
        const t = this.getData(e);
        if (t == null) {
            return false;
        }
        const n = _SkillConfig.Instance.get(e);
        const o = _SkillLevelConfig.Instance.getMaxLevel(n.quality);
        return t.level >= o && n.next > 0 && t.count >= GameConst.SKILLMAXLEVEL_NUM;
    }
    
    unequip(e: number): void {
        let t = this.equippedIds[e];
        this.equippedIds[e] = -1;
        this.saveEquipedData();
        cc.director.emit(GlobalEventName.SkillEquipedChange, e, t);
    }
    ;
    set auto(e: boolean) {
        if (this._auto != e) {
            this._auto = e;
            LocalStorageTool.setItemLocal("cc_user_skill_auto_release", e);
        }
    }
    get auto(): boolean {
        return this._auto;
    }
    set equippedIds(value: number[]) {
        this._equippedIds = value;
    }
    get equippedIds(): number[] {
        return this._equippedIds;
    }
    set heroSkillId(value) {
        const t = this._heroSkillId;
        this._heroSkillId = value;
        cc.director.emit(GlobalEventName.ChangeHeroSkill, value, t);
    }
    get heroSkillId() {
        return this._heroSkillId;
    }
}
