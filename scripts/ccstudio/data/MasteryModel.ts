import LanMgr from "../../modules/common/Language";
import LocalStorageTool from "../utils/LocalStorage";
import _MasteryConfig from "../config/_MasteryConfig";
import ModeBase from "./ModelBase";
import NumberPlus from "../utils/NumberPlus";
import PropAddationEventTarget from "../../modules/common/PropAddation";
import MsgHint from "../../modules/common/MsgHint";
import UserData, { AssetUseType } from "../../modules/user/UserData";
import { GlobalEventName } from "../../modules/common/Events";
import { E_ASSET_TYPE, GameConst } from "../../modules/common/Const";
export enum E_MASTERY_STATUS {
    EClose,
    EOpen,
    EMax
}
const _: any = window["_"];
export default class MasteryModel extends ModeBase {
    private datas = {};
    private minResetLayerId = 0;
    private props = {};
    public createAllProps(): void {
        _.each(this.datas, function (t) {
            let n = t.id, o = t.level, r = _MasteryConfig.Instance.get(n);
            _.each(r.propType, (t: string, n: any) => {
                if (o > 0) {
                    let i = r.propAdd[n], a = this.props[t];
                    a || ((a = this.props[t] = new PropAddationEventTarget().setProp(t)).value = "0"),
                        a.value = NumberPlus.add(a.value, "" + i * o);
                }
            });
        }),
            _.each(this.props, function (e: any) {
                e.active();
            });
    }
    public createData(e: number, t: number, n: number): any {
        return {
            id: e,
            level: t,
            status: n
        };
    }
    public doUp(e: number): void {
        let t = _MasteryConfig.Instance.get(e);
        let n = this.getData(e);
        n.level++,
            this.reCalcProp(n),
            t.maxLevel > 0 && n.level == t.maxLevel && (n.status = E_MASTERY_STATUS.EMax, this.reCalcProp(n), this.unlock(e)),
            this.saveData();
    }
    public getAllDatas(): any {
        return this.datas;
    }
    public getData(e: number): any {
        return this.datas[e];
    }
    public getResetEnable(): boolean {
        if (!this.getData(this.minResetLayerId))
            return false;
        if (this.getData(this.minResetLayerId).status !== E_MASTERY_STATUS.EMax)
            return false;
        const e = _MasteryConfig.Instance.get(this.minResetLayerId).layer;
        let t = false;
        _.each(this.datas, function (n) {
            _MasteryConfig.Instance.get(n.id).layer > e && n.level > 0 && (t = true);
        });
        return t;
    }
    public initLoadData(): void {
        this.createAllProps();
    }
    load() {
        var e = this;
        this.datas = [];
        var t = 1;
        this.minResetLayerId = 1;
        var n = LocalStorageTool.getItemLocal("cc_user-mastery-datas", {});
        _.isEmpty(n) ? n[1] = this.createData(1, 0, E_MASTERY_STATUS.EOpen) : _.each(n, function (n, o) {
            var r = parseInt(o);
            n.id = r;
            var i = _MasteryConfig.Instance.get(r);
            i.resetLv && t <= i.layer && (t = i.layer, e.minResetLayerId = r);
        }),
            this.datas = n;
    }
    public lvup(e: number): boolean {
        const t = this.getData(e);
        if (_.isNil(t) || t.status !== E_MASTERY_STATUS.EOpen)
            return false;
        const n = _MasteryConfig.Instance.get(e);
        if (!UserData.Instance.subItem(E_ASSET_TYPE.Sp, n.costSp, {
            type: AssetUseType.Mastery
        })) {
            MsgHint.warn(LanMgr.Instance.getLangByID("Not enough Sp"));
            return false;
        }
        this.doUp(e);
        cc.director.emit(GlobalEventName.MasteryLvChange, e);
        return true;
    }
    public reCalcProp(e): void {
        _.each(this.props, function (e: any) {
            e.value = "0";
        }),
            _.each(this.datas, (t) => {
                let n = t.id, o = t.level, r = _MasteryConfig.Instance.get(n);
                _.each(r.propType, (t: string, n: any) => {
                    if (o > 0) {
                        let i = r.propAdd[n], a = this.props[t];
                        a || ((a = this.props[t] = new PropAddationEventTarget().setProp(t)).value = "0"),
                            a.value = NumberPlus.add(a.value, "" + i * o),
                            a.active();
                    }
                });
            });
    }
    public reset(): void {
        const t = this, n = _MasteryConfig.Instance.get(this.minResetLayerId).layer;
        if (this.getResetEnable()) {
            if (UserData.Instance.subItem(E_ASSET_TYPE.Diamond, GameConst.MASTERY_RESET_PRICE, {
                type: AssetUseType.Mastery
            })) {
                const o = _MasteryConfig.Instance.getUnlockIds(this.minResetLayerId);
                let t = false;
                _.each(this.datas, function (r) {
                    const i = _MasteryConfig.Instance.get(r.id);
                    if (i.layer > n) {
                        if (r.level > 0) {
                            const l = r.level * i.costSp;
                            r.level = 0,
                                this.reCalcProp(r),
                                UserData.Instance.addItem(E_ASSET_TYPE.Sp, l);
                        }
                        _.indexOf(o, r.id) >= 0 ? r.status = E_MASTERY_STATUS.EOpen : r.status = E_MASTERY_STATUS.EClose,
                            t = true,
                            cc.director.emit(GlobalEventName.MasteryLvChange, r.id);
                    }
                });
                if (t)
                    this.saveData();
            }
            else
                MsgHint.tip(LanMgr.Instance.getLangByID("Not enough Gem!"));
        }
    }
    public saveData(): void {
        let e = {};
        _.each(this.datas, function (t) {
            e[t.id] = {
                level: t.level,
                status: t.status
            };
        }),
            LocalStorageTool.setItemLocal("cc_user-mastery-datas", e);
    }
    public unlock(e: number): void {
        let t = this, n = _MasteryConfig.Instance.get(this.minResetLayerId).layer, o = _MasteryConfig.Instance.getUnlockIds(e);
        _.each(o, function (e) {
            let o = _MasteryConfig.Instance.get(e).pre;
            if (_.every(o, function (e) {
                let n = t.getData(e);
                return n && n.status == E_MASTERY_STATUS.EMax;
            })) {
                let r = t.getData(e);
                r ? (r.level = 0, r.status = E_MASTERY_STATUS.EOpen) : r = t.datas[e] = t.createData(e, 0, E_MASTERY_STATUS.EOpen);
                let i = _MasteryConfig.Instance.get(e);
                _.each(i.propType, function () { }),
                    i.resetLv && n < i.layer && (t.minResetLayerId = e),
                    cc.director.emit(GlobalEventName.MasteryUnlock, e);
            }
        });
    }
}
