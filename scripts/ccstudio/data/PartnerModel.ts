import SoundPlayerComp from "../utils/SoundPlayerComp";
import LocalStorageTool from "../utils/LocalStorage";
import ModeBase from "./ModelBase";
import Model from "./Model";
import NumberPlus from "../utils/NumberPlus";
import _PartnerConfig from "../config/_PartnerConfig";
import _PartnerLevelConfig from "../config/_PartnerLevelConfig";
import PropAddationEventTarget from "../../modules/common/PropAddation";
import { GlobalEventName } from "../../modules/common/Events";
import { EUNLOCKSYS_ID, E_UNLOCK_STATE, ENUM_PROP_TYPE, GameConst } from "../../modules/common/Const";
const PLACE_COUNT: number = 5;
const _: any = window["_"];
export default class PartnerModel extends ModeBase {
    private _equippedIds: number[] = [];
    public ownedAtkPropAddation: PropAddationEventTarget | null = null;
    public ownedDatas: {
        [key: string]: any;
    } = {};
    public panterProps: {
        [key: string]: any;
    } = {};
    public partnerViewScale: {
        [key: string]: any;
    } = {};
    transNextAll = () => {
        const t = [];
        const n = [];
        _.each(this.ownedDatas, (o) => {
            const r = _PartnerConfig.Instance.get(o.id);
            const i = _PartnerLevelConfig.Instance.getMaxLevel(r.quality);
            if (o.level >= i && r.next > 0 && o.count >= GameConst.PARTNERMAXLEVEL_NUM) {
                const s = Math.floor(o.count / GameConst.PARTNERMAXLEVEL_NUM);
                o.count %= GameConst.PARTNERMAXLEVEL_NUM;
                const c = r.next;
                let u = this.getData(c);
                if (u) {
                    u.count += s;
                    u.total += s;
                }
                else {
                    u = this.ownedDatas[c] = {
                        id: c,
                        level: 1,
                        count: s,
                        total: s
                    };
                    n.push({
                        id: c,
                        prev: 0,
                        curr: 1
                    });
                }
                t.push({
                    id: c,
                    prev: o.id,
                    count: s
                });
            }
        });
        if (t.length > 0) {
            if (n.length > 0) {
                this.calcAllProp();
                cc.director.emit(GlobalEventName.PartnerOwnedChange);
                cc.director.emit(GlobalEventName.PartnerLevelUpAll, n);
            }
            this.saveDatas("owned", this.ownedDatas);
            cc.director.emit(GlobalEventName.PartnerTransAll, t);
        }
        return t;
    };
    transNextAllEnable = () => {
        return _.some(this.ownedDatas, (e) => {
            const t = _PartnerConfig.Instance.get(e.id);
            const n = _PartnerLevelConfig.Instance.getMaxLevel(t.quality);
            return e.level >= n && t.next > 0 && e.count >= GameConst.PARTNERMAXLEVEL_NUM;
        });
    };
    public addPartner(e: any, t = 1): void {
        let n = this.getData(e);
        if (_.isNil(n)) {
            n = (this.ownedDatas[e] = {
                id: e,
                level: 1,
                count: t,
                total: t,
            });
            this.calcAllProp();
            const o = {
                curr: 1,
                id: n.id,
                prev: 0,
            };
            cc.director.emit(GlobalEventName.PartnerLevelUp, o);
        }
        else {
            n.count += t;
            n.total += t;
        }
        this.saveDatas('owned', this.ownedDatas);
        cc.director.emit(GlobalEventName.PartnerOwnedChange);
    }
    addPartners(e: any[]) {
        const n = [];
        _.each(e, (partner) => {
            let o, r;
            if (typeof partner == "number") {
                o = partner;
                r = 1;
            }
            else {
                o = partner.id;
                r = partner.count || 1;
            }
            let i = this.getData(o);
            if (i == null) {
                i = {
                    id: o,
                    level: 1,
                    count: r,
                    total: r
                };
                this.ownedDatas[o] = i;
                n.push({
                    id: i.id,
                    prev: 0,
                    curr: 1
                });
            }
            else {
                i.count += r;
                i.total += r;
            }
        });
        this.saveDatas("owned", this.ownedDatas);
        if (n.length > 0) {
            cc.director.emit(GlobalEventName.PartnerLevelUpAll, n);
            this.calcAllProp();
        }
        cc.director.emit(GlobalEventName.PartnerOwnedChange);
    }
    calcAllProp() {
        let totalOwnedProp = "0";
        _.each(this.ownedDatas, (ownedData) => {
            const partnerId = ownedData.id;
            const partner = _PartnerConfig.Instance.get(partnerId);
            const ownedProp = this.calcOwnedProp(partner.quality, ownedData.level);
            this.panterProps[partnerId] = {
                atk: "0",
                owned: ownedProp,
                aspd: partner.aspd,
            };
            totalOwnedProp = NumberPlus.add(totalOwnedProp, ownedProp);
        });
        this.ownedAtkPropAddation.value = totalOwnedProp;
        const heroAtk = Model.user.getHeroAtk();
        _.each(this.ownedDatas, (ownedData) => {
            const partnerId = ownedData.id;
            const partner = _PartnerConfig.Instance.get(partnerId);
            this.panterProps[partnerId].atk = this.calcBattleProp(heroAtk, partner.atk, partner.atkUP, ownedData.level, partner.quality);
        });
    }
    calcBattleProp(e, t, n, o, quality) {
        const r = NumberPlus.add(t, NumberPlus.mul(o - 1, n));
        return NumberPlus.div(NumberPlus.mul(e, r), 100);
    }
    calcOwnedProp(e, t) {
        return _PartnerLevelConfig.Instance.get(e, t).owned;
    }
    calcProp(e, t, n) {
        const o = _PartnerConfig.Instance.get(t);
        const r = o.aspd;
        return {
            atk: this.calcBattleProp(e, o.atk, o.atkUP, n, o.quality),
            owned: this.calcOwnedProp(o.quality, n),
            aspd: r,
        };
    }
    convertPartnerSysIdToSlotIndex(e) {
        return e % 100 - 1;
    }
    public equip(e: number, t: number): void {
        const n = this.getEquipedId(e);
        this.equippedIds[e] = t;
        this.saveDatas('equipped', this.equippedIds);
        cc.director.emit(GlobalEventName.PartnerEquipedChange, e, n);
    }
    public findEmptySolt(): number {
        for (let e = 0; e < PLACE_COUNT; e++) {
            if (-1 == _.get(this.equippedIds, e, -1) && !this.isLocked(e)) {
                return e;
            }
        }
    }
    getAllData() {
        return this.ownedDatas;
    }
    getAllPartners() {
        var e = this, t = _PartnerConfig.Instance.getAll();
        return _.reduce(t, function (t, n) {
            var o = e.getData(n.id);
            return t.push({
                cfg: n,
                data: o
            }),
                t;
        }, []);
    }
    public getCurEquipString(): string {
        let e = '';
        for (let t = 0; t < this.equippedIds.length; t++) {
            const n = null == this.getData(this.equippedIds[t]) ? 0 : this.getData(this.equippedIds[t]).level;
            e = 0 == t ? this.equippedIds[t].toString() + '|' + n.toString() : e + ',' + this.equippedIds[t].toString() + '|' + n.toString();
        }
        return e;
    }
    getData(e) {
        return this.ownedDatas[e];
    }
    getEquipTagCnt(e) {
        let t = 0;
        for (let n = 0; n < this.equippedIds.length; n++) {
            const o = this.equippedIds[n];
            if (o > 0 && _PartnerConfig.Instance.get(o).flg.indexOf(e) >= 0) {
                t++;
            }
        }
        return t;
    }
    getEquipedId(e: number) {
        return _.get(this.equippedIds, e, -1);
    }
    public getEquipedIdx(e: number): number {
        return _.findIndex(this.equippedIds, (t) => {
            return t == e;
        });
    }
    getLvupMaxCnt(e: number, t: number) {
        const n = _PartnerConfig.Instance.get(e);
        const o = _PartnerLevelConfig.Instance.get(n.quality, t);
        return o ? o.cost : -1;
    }
    public getMaxOwnId(): number {
        let t = '0';
        const n = _.reduce(this.ownedDatas, (n, o) => {
            if (_.isNil(n)) {
                return o;
            }
            const r = _PartnerConfig.Instance.get(o.id);
            const i = this.calcOwnedProp(r.quality, o.level);
            if (NumberPlus.compare(i, t)) {
                t = i;
                return o;
            }
            else {
                return n;
            }
        }, null);
        return _.isNil(n) ? -1 : n.id;
    }
    public getOwnedCount(): number {
        return _.keys(this.ownedDatas).length;
    }
    // private partnerViewScale: Record<string, number> = {};
    // private ownedDatas: Record<string, any> = {};
    // private equippedIds: number[] = [-1, -1, -1, -1, -1];
    // private ownedAtkPropAddation: any;
    public getPartnerViewScale(e: string): number {
        let n = 1;
        const o = _PartnerConfig.Instance.get(e);
        _.each(o.flg, (e) => {
            if (!_.isNil(this.partnerViewScale[e])) {
                n = Math.max(n, this.partnerViewScale[e]);
            }
        });
        return n;
    }
    getProp(e: any): any {
        let t = this.panterProps[e];
        if (!t) {
            const n = Model.user.getHeroAtk();
            t = this.panterProps[e] = this.calcProp(n, e, 1);
        }
        return t;
    }
    public initLoadData(): void {
        this.ownedAtkPropAddation = new PropAddationEventTarget().setProp(ENUM_PROP_TYPE.ATK).active();
        this.calcAllProp();
    }
    isLocked(e) {
        const t = EUNLOCKSYS_ID.Partner + e;
        return Model.unlock.getData(t).state == E_UNLOCK_STATE.Locked;
    }
    isWaitUnLock(e) {
        const t = EUNLOCKSYS_ID.Skill + e;
        return Model.unlock.getData(t).state == E_UNLOCK_STATE.WaitUnlock;
    }
    public load(): void {
        this.ownedDatas = this.loadDatas('owned', {});
        this.equippedIds = this.loadDatas('equipped', [-1, -1, -1, -1, -1]);
    }
    public loadDatas(e: string, t: any): any {
        return LocalStorageTool.getItemLocal('user_partner_' + e, t);
    }
    lvup(e: number) {
        const t = this.getData(e);
        if (t == null)
            return false;
        const n = t.level;
        const o = _PartnerConfig.Instance.get(e);
        const r = _PartnerLevelConfig.Instance.getMaxLevel(o.quality);
        while (true) {
            const i = this.getLvupMaxCnt(e, t.level);
            if (!(t.level < r && i > 0 && t.count >= i))
                break;
            t.level++;
            t.count -= i;
        }
        const a = t.level;
        const c = {
            curr: a,
            id: t.id,
            prev: n
        };
        this.calcAllProp();
        this.saveDatas("owned", this.ownedDatas);
        SoundPlayerComp.Instance.playEffect("Audios/levelup_gear");
        cc.director.emit(GlobalEventName.PartnerLevelUp, c);
        return c;
    }
    lvupAll() {
        const t = [];
        _.each(this.ownedDatas, (n) => {
            const o = n.level;
            const r = _PartnerConfig.Instance.get(n.id);
            const i = _PartnerLevelConfig.Instance.getMaxLevel(r.quality);
            while (true) {
                const a = this.getLvupMaxCnt(n.id, n.level);
                if (!(n.level < i && a > 0 && n.count >= a))
                    break;
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
            this.saveDatas("owned", this.ownedDatas);
            SoundPlayerComp.Instance.playEffect("Audios/levelup_gear");
            cc.director.emit(GlobalEventName.PartnerLevelUpAll, t);
        }
        return t;
    }
    lvupAllEnable() {
        return _.find(this.ownedDatas, (t) => {
            const n = _PartnerConfig.Instance.get(t.id);
            const o = _PartnerLevelConfig.Instance.getMaxLevel(n.quality);
            const r = this.getLvupMaxCnt(t.id, t.level);
            return t.level < o && r > 0 && t.count >= r;
        }) != null;
    }
    lvupEnable(e: number) {
        const t = this.getData(e);
        if (t == null)
            return false;
        const n = _PartnerConfig.Instance.get(e);
        const o = _PartnerLevelConfig.Instance.getMaxLevel(n.quality);
        if (t.level < o) {
            const r = this.getLvupMaxCnt(e, t.level);
            return r && t.count >= r;
        }
        return false;
    }
    public saveDatas(e: string, t: any): void {
        LocalStorageTool.setItemLocal('user_partner_' + e, t);
    }
    public setPartnerViewScale(e: string, t: number): void {
        this.partnerViewScale[e] = t;
    }
    transNext(e: number): any {
        const t = this.getData(e);
        if (!t)
            return false;
        const n = Math.floor(t.count / GameConst.PARTNERMAXLEVEL_NUM), o = _PartnerConfig.Instance.get(e).next;
        if (o > 0) {
            t.count %= GameConst.PARTNERMAXLEVEL_NUM;
            this.addPartner(o, n);
        }
        const r = {
            count: n,
            id: o,
            prev: e
        };
        cc.director.emit(GlobalEventName.PartnerTrans, r);
        return r;
    }
    transNextEnable(e: number) {
        const t = this.getData(e);
        if (!t)
            return false;
        const n = _PartnerConfig.Instance.get(e);
        const o = _PartnerLevelConfig.Instance.getMaxLevel(n.quality);
        return t.level >= o && n.next > 0 && t.count >= GameConst.PARTNERMAXLEVEL_NUM;
    }
    public unequip(e: number): void {
        const t = this.equippedIds[e];
        this.equippedIds[e] = -1;
        this.saveDatas('equipped', this.equippedIds);
        cc.director.emit(GlobalEventName.PartnerEquipedChange, e, t);
    }
    get allOwnedAtk(): number {
        return this.ownedAtkPropAddation.value;
    }
    set equippedIds(e: number[]) {
        this._equippedIds = e;
    }
    get equippedIds(): number[] {
        return this._equippedIds;
    }
}
