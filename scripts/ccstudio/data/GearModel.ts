import SoundPlayerComp from "../utils/SoundPlayerComp";
import _GearConfig from "../config/_GearConfig";
import _GearLevelConfig from "../config/_GearLevelConfig";
import LocalStorageTool from "../utils/LocalStorage";
import ModeBase from "./ModelBase";
import NumberPlus from "../utils/NumberPlus";
import PropAddationEventTarget from "../../modules/common/PropAddation";
import { GlobalEventName } from "../../modules/common/Events";
import { E_GEAR_TYPE, ENUM_PROP_TYPE, GameConst, E_QUEST_ACTIVE_ID } from "../../modules/common/Const";
const _: any = window["_"];
export default class GearModel extends ModeBase {
    armorAddation = null;
    equipedDatas = {};
    getCurEquipString = (): string => {
        return `${this.equipWeaponId.toString()}|${(null == this.getData(this.equipWeaponId) ? "0" : this.getData(this.equipWeaponId).level.toString())},${this.equipArmorId.toString()}|${(null == this.getData(this.equipArmorId) ? "0" : this.getData(this.equipArmorId).level.toString())}`;
    };
    ownedGearDatas = {};
    weaponAddation = null;
    public addGear(e: number, t: number = 1): void {
        const n = _GearConfig.Instance.get(e);
        let o = this.getData(e);
        if (_.isNil(o)) {
            o = {
                type: n.type,
                id: e,
                level: 1,
                count: t,
                total: t
            };
            this.ownedGearDatas[e] = o;
            this.calcAllGearProp(n.type);
            cc.director.emit(GlobalEventName.GearLevelUp, {
                id: o.id,
                prev: 0,
                curr: 1
            });
        }
        else {
            o.count += t;
            o.total += t;
        }
        this.saveDatas("owned", this.ownedGearDatas);
        cc.director.emit(GlobalEventName.GearOwnedChange);
    }
    public addGears(e: Array<{
        id: number;
        count?: number;
    }>): void {
        const n = {}, o = [];
        _.each(e, (e) => {
            let r, i;
            if (typeof e == "number") {
                r = e;
                i = 1;
            }
            else {
                r = e.id;
                i = e.count || 1;
            }
            const a = _GearConfig.Instance.get(r);
            let s = this.getData(r);
            if (_.isNil(s)) {
                s = {
                    type: a.type,
                    id: r,
                    level: 1,
                    count: i,
                    total: i
                };
                this.ownedGearDatas[r] = s;
                n[a.type] = true;
                o.push({
                    id: s.id,
                    prev: 0,
                    curr: 1
                });
            }
            else {
                s.count += i;
                s.total += i;
            }
        });
        if (o.length > 0) {
            cc.director.emit(GlobalEventName.GearLevelUpAll, null, o);
        }
        if (n[E_GEAR_TYPE.WEAPON]) {
            this.calcAllGearProp(E_GEAR_TYPE.WEAPON);
        }
        if (n[E_GEAR_TYPE.ARMOR]) {
            this.calcAllGearProp(E_GEAR_TYPE.ARMOR);
        }
        this.saveDatas("owned", this.ownedGearDatas);
        cc.director.emit(GlobalEventName.GearOwnedChange);
    }
    public calcAllArmorOwnedProp() {
        return _.reduce(this.ownedGearDatas, (t: any, n: any) => {
            if (n.type == E_GEAR_TYPE.ARMOR) {
                const o = this.calcOwnedProp(n.id, n.level);
                return NumberPlus.add(o, t);
            }
            return t;
        }, "0");
    }
    public calcAllArmorProp() {
        const e = this.calcAllArmorOwnedProp();
        const t = this.calcArmorEquipedProp();
        return NumberPlus.add(e, t);
    }
    calcAllGearProp(e: number) {
        switch (e) {
            case E_GEAR_TYPE.WEAPON:
                this.weaponAddation.value = this.calcAllWeaponProp();
                break;
            case E_GEAR_TYPE.ARMOR:
                this.armorAddation.value = this.calcAllArmorProp();
                break;
        }
    }
    calcAllWeaponProp(): any {
        const e = this.caleAllWeaponOwnedProp();
        const t = this.caleWeaponEquipedProp();
        return NumberPlus.add(e, t);
    }
    public calcArmorEquipedProp() {
        if (this.equipArmorId <= 0)
            return "0";
        const e = this.ownedGearDatas[this.equipArmorId];
        return _.isNil(e) ? "0" : this.calcEquipedProp(e.id, e.level);
    }
    calcEquipedProp(e: any, t: any) {
        const n = _GearConfig.Instance.get(e);
        const { equip: o, equipUP: r } = n;
        return NumberPlus.add(o, NumberPlus.mul(t - 1, r));
    }
    calcOwnedProp(e: any, t: any) {
        const n = _GearConfig.Instance.get(e).quality;
        return _GearLevelConfig.Instance.get(n, t).owned;
    }
    public caleAllWeaponOwnedProp() {
        return _.reduce(this.ownedGearDatas, (t: any, n: any) => {
            if (n.type == E_GEAR_TYPE.WEAPON) {
                const o = this.calcOwnedProp(n.id, n.level);
                return NumberPlus.add(o, t);
            }
            return t;
        }, "0");
    }
    public caleWeaponEquipedProp() {
        if (this.equipWeaponId <= 0)
            return "0";
        const e = this.ownedGearDatas[this.equipWeaponId];
        return _.isNil(e) ? "0" : this.calcEquipedProp(e.id, e.level);
    }
    equip(e: number, t: number) {
        switch (e) {
            case E_GEAR_TYPE.ARMOR:
                this.equipArmorId = t;
                break;
            case E_GEAR_TYPE.WEAPON:
                this.equipWeaponId = t;
        }
    }
    getAllGears(e: number): any[] {
        var t = this, n = _GearConfig.Instance.getGears(e);
        return _.reduce(n, function (e: any, n: any) {
            var o = t.getData(n.id);
            e.push({
                cfg: n,
                data: o
            });
            return e;
        }, []);
    }
    getCurrEquipId(e: number): number {
        switch (e) {
            case E_GEAR_TYPE.ARMOR:
                return this.equipArmorId;
            case E_GEAR_TYPE.WEAPON:
                return this.equipWeaponId;
        }
    }
    getData(e: number) {
        return this.ownedGearDatas[e];
    }
    public getLvupMaxCnt(e: number, t: number): number {
        t = Math.max(0, t);
        const n = _GearConfig.Instance.get(e);
        const o = _GearLevelConfig.Instance.get(n.quality, t);
        return o ? o.cost : -1;
    }
    getMaxOwnGear(e: number): number | null {
        var t = this, n = this.getCurrEquipId(e), o = "0";
        if (n >= 0) {
            var r = this.getData(n);
            o = this.calcEquipedProp(n, r.level);
        }
        var i = _.reduce(this.ownedGearDatas, function (n: any, r: any) {
            if (r.type !== e)
                return n;
            if (_.isNil(n))
                return r;
            var i = t.calcEquipedProp(r.id, r.level);
            return NumberPlus.compare(i, o) ? (o = i, r) : n;
        }, null);
        return _.isNil(i) ? null : i.id;
    }
    getOwnedCount(): number {
        return _.keys(this.ownedGearDatas).length;
    }
    getOwnedTypeCount(e: number): number {
        return _.reduce(this.ownedGearDatas, function (t: number, n: any) {
            return n.type == e && t++,
                t;
        }, 0);
    }
    initLoadData() {
        this.weaponAddation = new PropAddationEventTarget().setProp(ENUM_PROP_TYPE.ATK).active(),
            this.armorAddation = new PropAddationEventTarget().setProp(ENUM_PROP_TYPE.HP).active(),
            this.weaponAddation.value = this.calcAllWeaponProp(),
            this.armorAddation.value = this.calcAllArmorProp();
    }
    load() {
        this.ownedGearDatas = this.loadDatas("owned", {}),
            this.equipedDatas = this.loadDatas("equiped", {});
    }
    loadDatas(e: string, t: any) {
        return LocalStorageTool.getItemLocal(`user_gear_${e}`, t);
    }
    public lvup(e: number): any | boolean {
        const t = this.getData(e);
        if (!t) {
            return false;
        }
        const n = t.level;
        const o = _GearConfig.Instance.get(e);
        const r = _GearLevelConfig.Instance.getMaxLevel(o.quality);
        while (true) {
            const i = this.getLvupMaxCnt(e, t.level);
            if (!(t.level < r && i > 0 && t.count >= i)) {
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
        this.calcAllGearProp(t.type);
        this.saveDatas("owned", this.ownedGearDatas);
        SoundPlayerComp.Instance.playEffect("Audios/levelup_gear");
        cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.EnhanceGear);
        cc.director.emit(GlobalEventName.GearLevelUp, u);
        return u;
    }
    lvupAll(e: number): any[] {
        const n: any[] = [];
        _.each(this.ownedGearDatas, (o: any) => {
            if (o.type == e) {
                const r = o.level;
                const i = _GearConfig.Instance.get(o.id);
                const a = _GearLevelConfig.Instance.getMaxLevel(i.quality);
                while (o.level < a) {
                    const s = this.getLvupMaxCnt(o.id, o.level);
                    if (!(s > 0 && o.count >= s)) {
                        break;
                    }
                    o.level++;
                    o.count -= s;
                }
                const c = o.level;
                if (c > r) {
                    n.push({
                        id: o.id,
                        prev: r,
                        curr: c
                    });
                }
            }
        });
        if (n.length > 0) {
            this.calcAllGearProp(e);
            this.saveDatas("owned", this.ownedGearDatas);
            SoundPlayerComp.Instance.playEffect("Audios/levelup_gear");
            cc.director.emit(GlobalEventName.QuestBatchCommit, E_QUEST_ACTIVE_ID.EnhanceGear, n.length);
            cc.director.emit(GlobalEventName.GearLevelUpAll, e, n);
        }
        return n;
    }
    lvupAllEnable(e: number): any | null {
        return _.find(this.ownedGearDatas, (n: any) => {
            if (n.type == e) {
                const o = _GearConfig.Instance.get(n.id);
                const r = _GearLevelConfig.Instance.getMaxLevel(o.quality);
                const i = this.getLvupMaxCnt(n.id, n.level);
                return n.level < r && i > 0 && n.count >= i;
            }
            return false;
        });
    }
    public lvupEnable(e: number): boolean {
        const t = this.getData(e);
        if (!t) {
            return false;
        }
        const n = _GearConfig.Instance.get(e);
        const o = _GearLevelConfig.Instance.getMaxLevel(n.quality);
        if (t.level < o) {
            const r = this.getLvupMaxCnt(e, t.level);
            return r && t.count >= r;
        }
        return false;
    }
    saveDatas(e: string, t: any) {
        LocalStorageTool.setItemLocal(`user_gear_${e}`, t);
    }
    public transNext(e: number): any | boolean {
        const t = this.getData(e);
        if (!t) {
            return false;
        }
        const n = Math.floor(t.count / GameConst.GEARMAXLEVEL_NUM);
        const o = _GearConfig.Instance.get(e).next;
        if (o > 0) {
            t.count %= GameConst.GEARMAXLEVEL_NUM;
            this.addGear(o, n);
        }
        const r = {
            count: n,
            id: o,
            prev: e
        };
        cc.director.emit(GlobalEventName.GearTrans, r);
        return r;
    }
    transNextAll(e: number): any[] {
        const n: any[] = [];
        const o: any[] = [];
        _.each(this.ownedGearDatas, (r: any) => {
            if (r.type == e) {
                const i = _GearConfig.Instance.get(r.id);
                const s = _GearLevelConfig.Instance.getMaxLevel(i.quality);
                if (r.level >= s && i.next > 0 && r.count >= GameConst.GEARMAXLEVEL_NUM) {
                    const c = Math.floor(r.count / GameConst.GEARMAXLEVEL_NUM);
                    r.count %= GameConst.GEARMAXLEVEL_NUM;
                    const u = i.next;
                    let p = this.getData(u);
                    if (p) {
                        p.count += c;
                        p.total += c;
                    }
                    else {
                        p = this.ownedGearDatas[u] = {
                            type: i.type,
                            id: u,
                            level: 1,
                            count: c,
                            total: c
                        };
                        o.push({
                            id: u,
                            prev: 0,
                            curr: 1
                        });
                    }
                    n.push({
                        id: u,
                        prev: r.id,
                        count: c
                    });
                }
            }
        });
        if (n.length > 0) {
            if (o.length > 0) {
                this.calcAllGearProp(e);
                cc.director.emit(GlobalEventName.GearLevelUpAll, null, o);
                cc.director.emit(GlobalEventName.GearOwnedChange);
            }
            this.saveDatas("owned", this.ownedGearDatas);
            cc.director.emit(GlobalEventName.GearTransAll, e, n);
        }
        return n;
    }
    transNextAllEnable(e: number) {
        return _.find(this.ownedGearDatas, (t: any) => {
            if (t.type == e) {
                const n = _GearConfig.Instance.get(t.id);
                const o = _GearLevelConfig.Instance.getMaxLevel(n.quality);
                return t.level >= o && n.next > 0 && t.count >= GameConst.GEARMAXLEVEL_NUM;
            }
            return false;
        });
    }
    public transNextEnable(e: number): boolean {
        const t = this.getData(e);
        if (!t) {
            return false;
        }
        const n = _GearConfig.Instance.get(e);
        const o = _GearLevelConfig.Instance.getMaxLevel(n.quality);
        return t.level >= o && n.next > 0 && t.count >= GameConst.GEARMAXLEVEL_NUM;
    }
    set equipArmorId(e) {
        if (this.equipedDatas[E_GEAR_TYPE.ARMOR] != e) {
            var t = this.equipedDatas[E_GEAR_TYPE.ARMOR];
            this.equipedDatas[E_GEAR_TYPE.ARMOR] = e,
                this.saveDatas("equiped", this.equipedDatas),
                this.armorAddation.value = this.calcAllArmorProp(),
                cc.director.emit(GlobalEventName.EquipArmorChange, e, t);
        }
    }
    get equipArmorId() {
        return this.equipedDatas[E_GEAR_TYPE.ARMOR] || -1;
    }
    set equipWeaponId(id) {
        if (this.equipedDatas[E_GEAR_TYPE.WEAPON] !== id) {
            let prevId = this.equipedDatas[E_GEAR_TYPE.WEAPON];
            this.equipedDatas[E_GEAR_TYPE.WEAPON] = id;
            this.saveDatas("equiped", this.equipedDatas);
            this.weaponAddation.value = this.calcAllWeaponProp();
            cc.director.emit(GlobalEventName.EquipWeaponChange, id, prevId);
        }
    }
    get equipWeaponId() {
        return this.equipedDatas[E_GEAR_TYPE.WEAPON] || -1;
    }
}
