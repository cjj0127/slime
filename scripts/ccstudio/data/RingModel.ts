import LocalStorageTool from "../utils/LocalStorage";
import ModeBase from "./ModelBase";
import NumberPlus from "../utils/NumberPlus";
import PropAddationEventTarget from "../../modules/common/PropAddation";
import _RingConfig from "../config/_RingConfig";
import _RingLevelConfig from "../config/_RingLevelConfig";
import _RingQualityLevelConfig from "../config/_RingQualityLevelConfig";
import MyTools from "../utils/MyTools";
import UserData, { AssetGetType } from "../../modules/user/UserData";
import { GlobalEventName } from "../../modules/common/Events";
import { E_ASSET_TYPE, ENUM_PROP_TYPE } from "../../modules/common/Const";
import UIAssetReceiveView from "../../modules/asset/UIAssetReceiveView";
const _: any = window['_'];
export class RingInfoData {
    createTime; // = MyTools.GetNowTime();
    id; // = this.createRingId(originId//);
    originId; // = this.createOriginId(e.quality);
    propData; // = new Array();
    quality;
    ringLevel; // = e.ringLevel;
    strengthenLv; // = 0;
}
export class RingPropInfo {
    propId;
    value;
}
export default class RingModel extends ModeBase {
    chooseList: number[] = [];
    curEquipId: number;
    private maxRingCount: number = 30;
    multiple: number = 1e3;
    propAddtionList: any[] = [];
    ringData: Array<any> = new Array();
    ringDataKey: string = "ringDataKey";
    ringEquipKey: string = "ringEquipKey";
    selectId: number = -1;
    public HasProp(e: number, t: any[]): number {
        for (let n = 0; n < t.length; n++)
            if (e == t[n].prop)
                return n;
        return -1;
    }
    Init(): void {
        const e = LocalStorageTool.getItemLocal(this.ringDataKey) || "[]";
        this.ringData = JSON.parse(e);
        this.curEquipId = parseInt(LocalStorageTool.getItemLocal(this.ringEquipKey)) || -1;
        this.reCalAddation();
    }
    public activeAddtion(): void {
        for (let e = 0; e < this.propAddtionList.length; e++)
            this.propAddtionList[e].active();
    }
    addRingProp(e: number, t: any): void {
        const n = this.getRingData(e);
        if (n) {
            n.propData.push(t);
            this.saveRingDataById(e, n);
        }
        else {
            cc.error("戒指不存在->" + e);
        }
    }
    breakDownRing(e: number, t = true): void {
        let n;
        let o = 0;
        UserData.Instance.addItem(E_ASSET_TYPE.RingChip, this.getBreakCount(e));
        for (let r = 0; r < this.ringData.length; r++) {
            if (this.ringData[r].id == e) {
                n = this.ringData[r];
                o = this.getBreakCount(e);
                this.ringData.splice(r, 1);
                break;
            }
        }
        cc.director.emit(GlobalEventName.RemoveRing, e);
        this.setSelectId(this.getEquipRingId());
        this.saveRingData();
        if (t) {
            this.showBreakPop(o);
        }
        const i = {
            RingChip_Count: parseInt(this.getRingChipCount()),
            RingChip_Num: o,
            Ring_Id: e,
            Ring_Level: n.ringLevel,
            Ring_Quality: n.quality,
            Ring_StrengLevel: n.strengthenLv,
        };
    }
    breakSelectRing(): void {
        let e = 0;
        for (let t = this.chooseList.length - 1; t >= 0; t--) {
            e += this.getBreakCount(this.chooseList[t]);
            this.breakDownRing(this.chooseList[t], false);
            this.chooseList.splice(t, 1);
        }
        cc.director.emit(GlobalEventName.UpdateSelectView);
        this.showBreakPop(e);
    }
    public canStrengthen(e: number): boolean {
        let t = this.getRingData(e), n = _RingQualityLevelConfig.Instance.getMaxLevel(t.quality);
        return t.strengthenLv < n;
    }
    public clearSelect(): void {
        this.chooseList = [];
    }
    createOriginId(e: number): number {
        const t = _RingConfig.Instance.getCfgsByQuality(e);
        let n = 0;
        let o = -1;
        let r = 0;
        for (let i = 0; i < t.length; i++) {
            n += t[i].rate;
        }
        const a = Math.random() * n;
        for (let s = 0; s < t.length; s++) {
            if (a <= (r += t[s].rate)) {
                o = s;
                break;
            }
        }
        return t[o].id;
    }
    createRing(e: {
        quality: number;
        ringLevel: number;
    }): any {
        const t = new RingInfoData();
        t.originId = this.createOriginId(e.quality);
        t.id = this.createRingId(t.originId);
        t.propData = new Array();
        t.createTime = MyTools.GetTimeNow();
        t.ringLevel = e.ringLevel;
        t.strengthenLv = 0;
        t.quality = e.quality;
        this.ringData.push(t);
        this.saveRingDataById(t.id, t);
        return t;
    }
    createRingId(e: number): number {
        return this.getLastIdByOriginId(e) + 1;
    }
    public disableAddtion(): void {
        for (let e = 0; e < this.propAddtionList.length; e++)
            this.propAddtionList[e].disable();
    }
    equipRing(e: number): void {
        const RingModel = this.curEquipId;
        this.curEquipId = e;
        this.setSelectId(this.getEquipRingId());
        LocalStorageTool.setItemLocal(this.ringEquipKey, this.curEquipId);
        cc.director.emit(GlobalEventName.FreshRingView, RingModel);
        cc.director.emit(GlobalEventName.FreshRingView, e);
        cc.director.emit(GlobalEventName.EquipRing);
        this.reCalAddation();
    }
    public getAllRingData(): any[] {
        return this.ringData;
    }
    public getAtkUp(id: number): number {
        let t = this.getRingData(id);
        return _RingLevelConfig.Instance.get(t.quality, t.ringLevel + t.strengthenLv).atkUP;
    }
    getBreakChooseCount(): number {
        return this.chooseList.length;
    }
    public getBreakCount(e: number): number {
        let t = this.getQualityLevelCfg(e);
        return t.breakNum > 0 ? t.breakNum : 0;
    }
    getCanBreakList(): number[] {
        const e: number[] = [];
        for (let t = 0; t < this.ringData.length; t++) {
            if (this.ringData[t].id != this.getEquipRingId()) {
                e.push(this.ringData[t].id);
            }
        }
        return e;
    }
    //     t.prototype.getChooseRingChipCount = function() {
    //         for (var e = 0,
    //         t = 0; t < this.chooseList.length; t++) {
    //             var n = this.getRingData(this.chooseList[t]);
    //             e += this.getQualityLevelCfg(n.id).breakNum
    //         }
    //         return e
    //     },
    public getChooseRingChipCount(): number {
        let e = 0;
        for (let t = 0; t < this.chooseList.length; t++) {
            let n = this.getRingData(this.chooseList[t]);
            e += this.getQualityLevelCfg(n.id).breakNum;
        }
        return e;
    }
    public getChooseRingCount(): number {
        return this.chooseList.length;
    }
    public getCostCount(e: number): number {
        let t = this.getRingData(e);
        return _RingQualityLevelConfig.Instance.get(t.quality, t.strengthenLv).costNum;
    }
    getCurEquipString(): string {
        const e = this.getRingData(this.curEquipId);
        let t = -1;
        if (!_.isNil(e)) {
            t = e.originId;
        }
        return `${this.curEquipId}|${t}`;
    }
    getEquipRingId(): number {
        return this.curEquipId;
    }
    public getHpUp(e: number): number {
        let t = this.getRingData(e);
        return _RingLevelConfig.Instance.get(t.quality, t.ringLevel + t.strengthenLv).hpUP;
    }
    getLastIdByOriginId(e: number): number {
        let t = e * this.multiple;
        for (let n = 0; n < this.ringData.length; n++) {
            if (this.ringData[n].originId == e &&
                this.ringData[n].id > t) {
                t = this.ringData[n].id;
            }
        }
        return t;
    }
    public getLastRingData(): any {
        return this.ringData[this.ringData.length - 1];
    }
    public getMaxRingCount(): number {
        return this.maxRingCount;
    }
    public getPropList(e: number): any[] {
        let t = [], n = this.getRingData(e), o = new PropAddationEventTarget();
        o.setProp(ENUM_PROP_TYPE.ATK);
        o.value = NumberPlus.add(0, this.getAtkUp(e));
        t.push(o);
        let r = new PropAddationEventTarget();
        r.setProp(ENUM_PROP_TYPE.HP);
        r.value = NumberPlus.add(0, this.getHpUp(e));
        t.push(r);
        for (let i = 0; i < n.propData.length; i++) {
            let s = this.HasProp(n.propData[i].propId, t);
            if (-1 == s) {
                let c = new PropAddationEventTarget();
                c.setProp(n.propData[i].propId);
                c.value = NumberPlus.add(0, n.propData[i].value);
                t.push(c);
            }
            else
                t[s].value = NumberPlus.add(t[s].value, n.propData[i].value);
        }
        return t;
    }
    public getPropListString(e: number): string {
        let t = "", n = this.getRingData(e), o = 0;
        for (let r = 0; r < n.propData.length; r++) {
            if (0 == r)
                t = Number(n.propData[r].propId).toString() + "|" + n.propData[r].value;
            else
                t += "," + Number(n.propData[r].propId).toString() + "|" + n.propData[r].value;
        }
        return t;
    }
    public getQualityLevelCfg(e: number): any {
        let t = this.getRingData(e);
        return _RingQualityLevelConfig.Instance.get(t.quality, t.strengthenLv);
    }
    getRingCfg(e: number): any {
        const t = this.getRingData(e)?.originId;
        return _RingConfig.Instance.get(t);
    }
    public getRingChipCount(): string {
        return UserData.Instance.getItem(E_ASSET_TYPE.RingChip);
    }
    getRingCount(): number {
        return this.ringData.length;
    }
    getRingData(e: number): any {
        for (let t = 0; t < this.ringData.length; t++) {
            if (this.ringData[t].id == e) {
                return this.ringData[t];
            }
        }
        return null;
    }
    public getRingLevelCfg(e: number): any {
        let t = this.getRingData(e);
        return _RingLevelConfig.Instance.get(t.quality, t.ringLevel);
    }
    getSelectId(): number {
        return this.selectId;
    }
    public getSkillAddtion(e: number): number {
        if (-1 == this.getEquipRingId())
            return 0;
        let t = this.getRingData(this.getEquipRingId()), n = this.getRingCfg(t.id);
        if (n.skillID != e)
            return 0;
        let o = n.skillUP + n.skillUPLevel * t.ringLevel;
        return NumberPlus.add(0, o);
    }
    initLoadData(): void { }
    isRingFull(): boolean {
        return this.getRingCount() >= this.maxRingCount;
    }
    load(): void {
        this.Init();
    }
    lvUpRingQuality(e: number, RingModel = 1): number {
        for (let n = 0; n < this.ringData.length; n++) {
            if (this.ringData[n].id == e) {
                this.ringData[n].quality += RingModel;
                if (this.ringData[n].quality > 7) {
                    this.ringData[n].quality = 7;
                }
                this.ringData[n].originId = this.createOriginId(this.ringData[n].quality);
                this.ringData[n].id = this.createRingId(this.ringData[n].originId);
                this.saveRingData();
                return this.ringData[n].id;
            }
        }
        cc.error("升级品质错误");
        return -1;
    }
    public reCalAddation(): void {
        if (-1 != this.getEquipRingId()) {
            this.disableAddtion();
            this.propAddtionList = [];
            this.propAddtionList = this.getPropList(this.getEquipRingId());
            this.activeAddtion();
        }
    }
    saveRingData(): void {
        cc.sys.localStorage.setItem(this.ringDataKey, JSON.stringify(this.ringData));
    }
    saveRingDataById(e: number, t: any): void {
        let n = false;
        for (let o = 0; o < this.ringData.length; o++) {
            if (this.ringData[o].id == e) {
                this.ringData[o] = t;
                n = true;
            }
        }
        if (!n) {
            this.ringData.push(t);
        }
        this.saveRingData();
    }
    //     t.prototype.selectAllRing = function(e) {
    //         for (var t = this.getCanBreakList(), n = 0; n < t.length; n++) this.selectRing(t[n], e)
    //     },
    selectAllRing(e: boolean): void {
        const t = this.getCanBreakList();
        for (let n = 0; n < t.length; n++) {
            this.selectRing(t[n], e);
        }
    }
    selectRing(e: number, t: boolean): void {
        if (t) {
            if (this.chooseList.indexOf(e) == -1) {
                this.chooseList.push(e);
            }
        }
        else {
            const n = this.chooseList.indexOf(e);
            if (n !== -1) {
                this.chooseList.splice(n, 1);
            }
        }
        cc.director.emit(GlobalEventName.SelectRing, e, RingModel);
    }
    setSelectId(e: number): void {
        this.selectId = e;
        cc.director.emit(GlobalEventName.FreshRingInfoView);
    }
    showBreakPop(e: number): void {
        const RingModel = [{ id: E_ASSET_TYPE.RingChip, count: e }];
        UIAssetReceiveView.open(RingModel, AssetGetType.Ring);
    }
    strengthenRing(e: number) {
        let t, n;
        for (let o = 0; o < this.ringData.length; o++) {
            if (this.ringData[o].id == e) {
                t = this.ringData[o];
                n = this.getCostCount(e);
                UserData.Instance.subItem(E_ASSET_TYPE.RingChip, this.getCostCount(e));
                this.ringData[o].strengthenLv += 1;
            }
        }
        this.setSelectId(this.selectId);
        this.saveRingData();
        cc.director.emit(GlobalEventName.FreshRingView, e);
        this.reCalAddation();
        const r = {
            RingChip_Count: parseInt(this.getRingChipCount()),
            RingChip_Num: n,
            Ring_Id: e,
            Ring_Level: t.ringLevel,
            Ring_Quality: t.quality,
            Ring_StrengLevel: t.strengthenLv
        };
        // AnalyticsManager.getInstance().reportRingStreng(r)
    }
    unEquipRing(): void {
        const e = this.curEquipId;
        this.curEquipId = -1;
        LocalStorageTool.setItemLocal(this.ringEquipKey, this.curEquipId);
        cc.director.emit(GlobalEventName.FreshRingView, e);
        cc.director.emit(GlobalEventName.EquipRing);
        this.disableAddtion();
    }
    ;
}
