import { ENUM_PROP_TYPE, GameConst } from "../common/Const";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import PropAddationEventTarget from "../common/PropAddation";
import _TeasureConfig from "../../ccstudio/config/_TeasureConfig";
// import * as PropAddation from "PropAddation";
const _ = window["_"];
export const TREASURE_TOTAL_COUNT = 24;
export const TREASURE_TYPE_COUNT = 6;
// @Singleton
export default class CTreasureData {
    private _dirty: boolean = false;
    private static _instance: CTreasureData;
    private equipedTreasures: {
        [key: string]: any;
    } = {};
    private props: {
        [key: string]: any;
    } = {};
    private treasureDatas: {
        [key: string]: any;
    } = {};
    public activeProps(): void {
        for (const key in this.props) {
            this.props[key].active();
        }
    }
    public activeTreasure(e: number): void {
        this.treasureDatas[e] = this.createData(e);
        this._dirty = true;
    }
    public calcAllProps(): void {
        let e = "0";
        let t = "0";
        for (const n in this.treasureDatas) {
            e = NumberPlus.add(e, this.treasureDatas[n].propValueAtk);
            t = NumberPlus.add(t, this.treasureDatas[n].propValueHp);
        }
        let propObj = this.getPropObj(ENUM_PROP_TYPE.ATK);
        propObj.value = e;
        propObj = this.getPropObj(ENUM_PROP_TYPE.HP);
        propObj.value = t;
        this.activeProps();
    }
    public createData(e: number, t: number = 1): {
        [key: string]: any;
    } {
        const n = _TeasureConfig.Instance.get(e);
        const o = n.type;
        let i = NumberPlus.add(n.ownedHp, NumberPlus.mul(t - 1, n.ownedHpUP));
        let s = NumberPlus.add(n.ownedAtk, NumberPlus.mul(t - 1, n.ownedAtkUP));
        if (n.maxLevel == t) {
            i = NumberPlus.mul(i, GameConst.TREASURE_TIMES);
            s = NumberPlus.mul(s, GameConst.TREASURE_TIMES);
        }
        return {
            id: e,
            level: t,
            type: o,
            propValueHp: i,
            propValueAtk: s,
            effectValue: NumberPlus.add(n.effectValue, NumberPlus.mul(t - 1, n.effectUp))
        };
    }
    equip(e: number) {
        const t = this.getData(e).type;
        this.equipedTreasures[t] = e;
        this._dirty = true;
    }
    public getAllEquipTreasure(): number[] {
        const arr = [];
        for (const key in this.equipedTreasures) {
            if (!_.isNil(this.equipedTreasures[key]) && this.equipedTreasures[key] > 0) {
                arr.push(this.equipedTreasures[key]);
            }
        }
        return arr;
    }
    public getCurEquipString(): string {
        const arr = [];
        for (let t = 0; t < TREASURE_TYPE_COUNT; t++) {
            arr.push(this.getEquip(t + 1));
        }
        return arr.join(",");
    }
    public getData(e: number): {
        [key: string]: any;
    } {
        return this.treasureDatas[e];
    }
    getEquip(e: number) {
        return this.equipedTreasures[e] || -1;
    }
    // private props: { [key: string]: any };
    public getPropObj(e: any): any {
        let t = this.props[e];
        if (_.isNil(t)) {
            t = new PropAddationEventTarget();
            t.setProp(e);
            t.value = "0";
            this.props[e] = t;
        }
        return t;
    }
    public getTreasureCount(): number {
        return _.keys(this.treasureDatas).length;
    }
    public init(): void {
        this.props = {};
        let e = "0";
        let t = "0";
        _.each(this.treasureDatas, (n) => {
            e = NumberPlus.add(e, this.treasureDatas[n].propValueAtk);
            t = NumberPlus.add(t, this.treasureDatas[n].propValueHp);
        });
        let propObj = this.getPropObj(ENUM_PROP_TYPE.ATK);
        propObj.value = e;
        propObj = this.getPropObj(ENUM_PROP_TYPE.HP);
        propObj.value = t;
    }
    load() {
        let e = this;
        let t = LocalStorageTool.getItemLocal("cc_user-treasure-data", {});
        let n = _.get(t, "treasureDatas", {});
        let o = _.get(t, "equipedTreasures", {});
        let r = {};
        _.isEmpty(n) || _.each(n, function (t, n) {
            var o = parseInt(n);
            r[o] = e.createData(o, t);
        });
        this.treasureDatas = r;
        this.equipedTreasures = o;
    }
    lvup(e: number) {
        let t = this.getData(e);
        t.level++;
        let n = _TeasureConfig.Instance.get(e);
        t.propValueHp = NumberPlus.add(n.ownedHp, NumberPlus.mul(t.level - 1, n.ownedHpUP));
        t.propValueAtk = NumberPlus.add(n.ownedAtk, NumberPlus.mul(t.level - 1, n.ownedAtkUP));
        if (n.maxLevel == t.level) {
            t.propValueHp = NumberPlus.mul(t.propValueHp, GameConst.TREASURE_TIMES);
            t.propValueAtk = NumberPlus.mul(t.propValueAtk, GameConst.TREASURE_TIMES);
        }
        t.effectValue = NumberPlus.add(n.effectValue, NumberPlus.mul(t.level - 1, n.effectUp));
        this._dirty = true;
    }
    removeEquip(e: number) {
        const t = this.getData(e).type;
        this.equipedTreasures[t] = 0;
        this._dirty = true;
    }
    public save(): void {
        if (this._dirty) {
            this._dirty = false;
            const e: {
                [key: string]: any;
            } = {};
            for (const t in this.treasureDatas) {
                e[t] = this.treasureDatas[t].level;
            }
            const t: {
                [key: string]: any;
            } = {};
            _.set(t, "treasureDatas", e);
            _.set(t, "equipedTreasures", this.equipedTreasures);
            LocalStorageTool.setItemLocal("cc_user-treasure-data", t);
        }
    }
    public static get Instance(): CTreasureData {
        if (!CTreasureData._instance) {
            CTreasureData._instance = new CTreasureData();
        }
        return CTreasureData._instance;
    }
}
