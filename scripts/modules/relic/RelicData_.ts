import { GlobalEventName } from "../common/Events";
import { E_QUEST_ACTIVE_ID, GameConst } from "../common/Const";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import PropAddationEventTarget from "../common/PropAddation";
import _RelicConfig from "../../ccstudio/config/_RelicConfig";
export const RELIC_TYPE_COUNT = 7;
export const RELIC_TOTAL_COUNT = 28;
const p: any = window["_"];
// n.default = f
export default class RelicData_ {
    private _drity: boolean = false;
    // private relicDatas: { [key: string]: any } = {};
    // private epuipedRelics: { [key: string]: any } = {};
    // private props: { [key: string]: number } = {};
    // private _drity: boolean = false;
    private static _instance = new RelicData_();
    private epuipedRelics: Record<number, number> = {};
    // private _drity = false;
    // private relicDatas = {};
    // private epuipedRelics = {};
    private props = {};
    private relicDatas: Record<number, any> = {};
    public activeProps(): void {
        p.each(this.props, function (e) {
            e.active();
        });
    }
    public activeRelic(e: number): void {
        this.relicDatas[e] = this.createData(e);
        cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.GetRelic, this.getRelicCount());
        this._drity = true;
    }
    public calcAllProps(): void {
        let e = this;
        p.each(this.props, function (e) {
            e.value = "0";
        });
        let t = {};
        p.each(this.relicDatas, function (e) {
            _RelicConfig.Instance.get(e.id).props.forEach(function (n) {
                let o = t[n] || "0";
                t[n] = NumberPlus.add(o, e.propValue);
            });
        });
        p.each(t, function (t, n) {
            let o = parseInt(n);
            e.getPropObj(o).value = t;
        });
        this.activeProps();
    }
    public createData(e, t = 1): any {
        let n = _RelicConfig.Instance.get(e);
        let o = n.type;
        let i = NumberPlus.add(n.owned, NumberPlus.mul(t - 1, n.ownedUP));
        if (n.maxLevel == t) {
            i = NumberPlus.mul(i, GameConst.RELIC_TIMES);
        }
        return {
            id: e,
            level: t,
            type: o,
            propValue: i,
            effectValue: NumberPlus.add(n.effectValue, NumberPlus.mul(t - 1, n.effectUp))
        };
    }
    public equip(e: number): void {
        const t = this.getData(e).type;
        this.epuipedRelics[t] = e;
        this._drity = true;
    }
    public getAllEquipRelics(): any[] {
        let e = [];
        p.each(this.epuipedRelics, function (t) {
            if (!p.isNil(t) && t > 0) {
                e.push(t);
            }
        });
        return e;
    }
    public getCurEquipString(): string {
        let e = [];
        for (let t = 0; t < RELIC_TYPE_COUNT; t++) {
            e.push(this.getEquip(t + 1));
        }
        return e.join(",");
    }
    public getData(e): any {
        return this.relicDatas[e];
    }
    public getEquip(e: number): number {
        return this.epuipedRelics[e] || -1;
    }
    public getPropObj(e): PropAddationEventTarget {
        let t = this.props[e];
        if (p.isNil(t)) {
            t = this.props[e] = new PropAddationEventTarget();
            t.setProp(e);
            t.value = "0";
        }
        return t;
    }
    public getRelicCount(): number {
        return p.keys(this.relicDatas).length;
    }
    public init(): void {
        let e = this;
        this.props = {};
        p.each(this.relicDatas, function (t) {
            _RelicConfig.Instance.get(t.id).props.forEach(function (n) {
                let o = e.getPropObj(n);
                o.value = NumberPlus.add(o.value, t.propValue);
            });
        });
    }
    public load(): void {
        let e = this;
        let t = LocalStorageTool.getItemLocal("cc_user-relic-data", {});
        let n = p.get(t, "relicDatas", {});
        let o = p.get(t, "epuipedRelics", {});
        let r = {};
        p.isEmpty(n) || p.each(n, function (t, n) {
            let o = parseInt(n);
            r[o] = e.createData(o, t);
        });
        this.relicDatas = r;
        this.epuipedRelics = o;
    }
    public lvup(e: number): void {
        const t = this.getData(e);
        t.level++;
        const n = _RelicConfig.Instance.get(e);
        t.propValue = NumberPlus.add(n.owned, NumberPlus.mul(t.level - 1, n.ownedUP));
        if (n.maxLevel == t.level) {
            t.propValue = NumberPlus.mul(t.propValue, GameConst.RELIC_TIMES);
        }
        t.effectValue = NumberPlus.add(n.effectValue, NumberPlus.mul(t.level - 1, n.effectUp));
        cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.EnhanceRelic);
        this._drity = true;
    }
    public save(): void {
        if (this._drity) {
            this._drity = false;
            let e = {};
            p.each(this.relicDatas, function (t) {
                e[t.id] = t.level;
            });
            let t = {};
            p.set(t, "relicDatas", e);
            p.set(t, "epuipedRelics", this.epuipedRelics);
            LocalStorageTool.setItemLocal("cc_user-relic-data", t);
        }
    }
    public static get Instance(): RelicData_ {
        return RelicData_._instance;
    }
}
