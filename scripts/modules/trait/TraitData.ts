import { E_ASSET_TYPE, GameConst } from "../common/Const";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import PropAddationEventTarget from "../common/PropAddation";
import _TraitConfig from "../../ccstudio/config/_TraitConfig";
import _TraitComboConfig from "../../ccstudio/config/_TraitComboConfig";
import _TraitKindConfig from "../../ccstudio/config/_TraitKindConfig";
import _TraitLevelConfig from "../../ccstudio/config/_TraitLevelConfig";
import UserData from "../user/UserData";
const g: any = window["_"];
const { ccclass, property } = cc._decorator;
// import * as UserData from "UserData";
export const TRAIT_SLOT_COUNT: number = 5;
@ccclass
export default class TraitData {
    // props: any;
    // comboProps: any;
    // constructor() {
    //     this.traitDatas = [];
    //     this.comboDatas = {};
    //     this.props = {};
    //     this.comboProps = {};
    // }
    private static _instance: TraitData = null;
    // traitDatas: any[];
    comboDatas: any;
    // private comboDatas: { kind: number, count: number, level: number }[] = [];
    private comboProps: {
        [key: string]: any;
    } = {};
    private props: {
        [key: string]: any;
    } = {};
    private traitDatas: {
        id: number;
        kind: number;
        lock: boolean;
    }[] = [];
    activeProps(): void {
        for (const prop in this.props) {
            this.props[prop].active();
        }
        for (const comboProp in this.comboProps) {
            this.comboProps[comboProp].active();
        }
    }
    public calcCombo(): void {
        this.comboDatas = {};
        g.each(this.traitDatas, (t: {
            id: number;
            kind: number;
            lock: boolean;
        }) => {
            const n = t.id, o = t.kind;
            if (n >= 0 && o >= 0) {
                let r = this.comboDatas[o];
                if (!r) {
                    r = {
                        kind: o,
                        count: 1,
                        level: 0
                    };
                    this.comboDatas[o] = r;
                }
                else {
                    r.count++;
                }
            }
        });
        for (const t in this.comboDatas) {
            const n = this.comboDatas[t].kind, o = this.comboDatas[t].count, r = _TraitComboConfig.Instance.getComboLevel(n, o);
            this.comboDatas[t].level = r;
            if (r > 0) {
                const i = this.calcComboProp(n), a = i.prop, c = i.value, l = this.getComboPropObj(a);
                l.value = NumberPlus.add(l.value, c);
            }
        }
    }
    public calcComboProp(e): {
        prop: any;
        value: any;
    } {
        const t = this.getComboData(e).level;
        const n = _TraitComboConfig.Instance.getComboWithLevel(e, t - 1);
        const o = _TraitComboConfig.Instance.get(n);
        return {
            prop: _TraitKindConfig.Instance.get(e).prop,
            value: o.value
        };
    }
    // public traitDatas;
    // public comboDatas;
    // public props;
    // public comboProps;
    public calcTraitProp(e): {
        prop: any;
        value: any;
    } {
        const t = _TraitConfig.Instance.get(e);
        return {
            prop: t.propType,
            value: t.propAdd
        };
    }
    public change(): void {
        g.each(this.props, (e) => {
            e.value = "0";
        });
        g.each(this.comboProps, (e) => {
            e.value = "0";
        });
        g.each(this.traitDatas, (t) => {
            if (!t.lock) {
                const n = _TraitKindConfig.Instance.random();
                const o = _TraitLevelConfig.Instance.random();
                const r = _TraitConfig.Instance.random(o);
                t.id = r;
                t.kind = n;
            }
            const i = this.calcTraitProp(t.id);
            const s = i.prop;
            const u = i.value;
            const f = this.getPropObj(s);
            f.value = NumberPlus.add(f.value, u);
        });
        this.comboDatas = {};
        g.each(this.traitDatas, (t) => {
            const n = t.kind;
            const o = this.comboDatas[n];
            if (o) {
                o.count++;
            }
            else {
                this.comboDatas[n] = {
                    kind: n,
                    count: 1,
                    level: 0
                };
            }
        });
        g.each(this.comboDatas, (t) => {
            const n = t.kind;
            const o = t.count;
            const r = _TraitComboConfig.Instance.getComboLevel(n, o);
            if (t.level = r, r > 0) {
                const i = this.calcComboProp(n);
                const a = i.prop;
                const c = i.value;
                const l = this.getComboPropObj(a);
                l.value = NumberPlus.add(l.value, c);
            }
        });
        this.activeProps();
        this.save();
    }
    public getAllCombo(): any[] {
        const e = [];
        g.each(this.comboDatas, (t) => {
            const n = t.kind;
            const o = t.level;
            e.push({
                kind: n,
                level: o
            });
        });
        return e;
    }
    public getComboData(e): any {
        return this.comboDatas[e];
    }
    private getComboPropObj(e: string): any {
        let t = this.comboProps[e];
        if (g.isNil(t)) {
            t = new PropAddationEventTarget();
            t.setProp(e);
            t.value = "0";
            this.comboProps[e] = t;
        }
        return t;
    }
    private getPropObj(e: string): any {
        let t = this.props[e];
        if (g.isNil(t)) {
            t = new PropAddationEventTarget();
            t.setProp(e);
            t.value = "0";
            this.props[e] = t;
        }
        return t;
    }
    public getSlotData(e): any {
        return this.traitDatas[e];
    }
    public init(): void {
        this.props = {};
        g.each(this.traitDatas, (t: {
            id: number;
            kind: number;
            lock: boolean;
        }) => {
            const n = t.id;
            if (n > 0) {
                const o = this.calcTraitProp(n), r = o.prop, i = o.value, a = this.getPropObj(r);
                a.value = NumberPlus.add(a.value, i);
            }
        });
        this.calcCombo();
        this.activeProps();
    }
    public load(): void {
        const t = JSON.parse(LocalStorageTool.getItemLocal("cc_user-trait-datas2", "[]"));
        if (g.isEmpty(t)) {
            for (let o = 0; o < TRAIT_SLOT_COUNT; o++) {
                this.traitDatas.push({
                    id: -1,
                    kind: -1,
                    lock: false
                });
            }
            UserData.Instance.setItem(E_ASSET_TYPE.Tailt, GameConst.TRAIT_INITIAL);
            this.save();
        }
        else {
            this.traitDatas.length = TRAIT_SLOT_COUNT;
            g.each(t, (t: {
                id: number;
                kind: number;
                lock: boolean;
            }, n: number) => {
                const o = t.id, r = t.kind, i = t.lock;
                this.traitDatas[n] = {
                    id: o,
                    kind: r,
                    lock: i
                };
            });
        }
    }
    public save(): void {
        const e: {
            id: number;
            kind: number;
            lock: boolean;
        }[] = [];
        g.each(this.traitDatas, (t: {
            id: number;
            kind: number;
            lock: boolean;
        }, n: number) => {
            const o = t.id, r = t.kind, i = t.lock;
            e[n] = {
                id: o,
                kind: r,
                lock: i
            };
        });
        LocalStorageTool.setItemLocal("cc_user-trait-datas2", JSON.stringify(e));
    }
    static get Instance(): TraitData {
        if (TraitData._instance == null) {
            TraitData._instance = new TraitData();
        }
        return TraitData._instance;
    }
}
