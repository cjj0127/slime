import _BuildingConfig from "../config/_BuildingConfig";
import _BuildingLevelConfig from "../config/_BuildingLevelConfig";
import Config from "../configs/Config";
import _HeroConfig from "../config/_HeroConfig";
import HeroData from "../../modules/hero/HeroData";
import LocalStorageTool from "../utils/LocalStorage";
import ModeBase from "./ModelBase";
import Model from "./Model";
import NumberPlus from "../utils/NumberPlus";
import _PlunderHeroConfig from "../config/_PlunderHeroConfig";
import PlunderLevel from "../../modules/common/PlunderLevel";
import MyTools from "../utils/MyTools";
import UserData from "../../modules/user/UserData";
import { GlobalEventName } from "../../modules/common/Events";
import { GameConst, MapUIPrefabs } from "../../modules/common/Const";
import MapCtr_ from "../../modules/battle/MapCtr_";
export enum E_RobQuestState {
    S_NotComplete,
    S_Complete,
    S_Receive
}
export enum E_RobQuestType {
    T_Build = 1,
    T_RobLevel
}
const _: any = window['_'];
export default class RobModel extends ModeBase {
    private isShowRobReward: boolean;
    private isShowRobRewardKey: string = 'isShowRobRewardKey';
    private mapCtr: MapCtr_;
    public robData: any;
    private robDataKey: string = 'robDataKey';
    private robQuestData: {
        questData: {
            id: number;
            state: number;
        }[];
        curQuestId: number;
    };
    private robQuestKey: string = 'robQuestKey';
    private timeIndex: number = 0;

    LvUpBuild(e: number): void {
        const t = this.getBuildInfo(e);
        if (this.canLvUpBuild(e)) {
            const n = _BuildingConfig.Instance.get(e), o = _BuildingLevelConfig.Instance.getCfg(e, t.level), r = n.levelUpId;
            UserData.Instance.subItem(r, o.levelCost);
            t.level++;
            this.refreshBuildMaxStock(e);
            this.saveRobBuildInfo(e, t);
            this.checkQuest(E_RobQuestType.T_Build, e);
        }
    }

    addRobExp(e: number): Array<number> {
        const t = [];
        this.robData.robExp = NumberPlus.add(this.robData.robExp, e);
        let n = PlunderLevel.Instance.getNeedExp(this.robData.robLevel);
        if (n != "0") {
            while (NumberPlus.compare(this.robData.robExp, n) && !(this.robData.robLevel >= this.getRobMaxLevel())) {
                this.robData.robLevel++;
                if (this.robData.robLevel > 1) {
                    t.push(this.robData.robLevel);
                }
                this.robData.robExp = NumberPlus.sub(this.robData.robExp, n);
                n = PlunderLevel.Instance.getNeedExp(this.robData.robLevel);
            }
            if (this.robData.robExp < 0) {
                this.robData.robExp = 0;
            }
            this.saveRobData();
            return t;
        }
    }

    addSpeedUp(): void {
        if (this.canSpeedUp()) {
            const nowTime = MyTools.GetTimeNow();
            cc.director.emit(GlobalEventName.RobSpeedUp, true);
            if (this.robData.speedUpEndTime == -1) {
                this.robData.speedUpEndTime = nowTime + 60000 * GameConst.PLUNDER_SPEEDUP_TIME;
                this.robData.lastSpeedUpTime = nowTime;
            }
            else {
                this.robData.speedUpEndTime += 60000 * GameConst.PLUNDER_SPEEDUP_TIME;
            }
            this.saveRobData();
        }
        else {
            cc.log("不能加速了");
        }
    }
    
    public caculateOutCoin(e: number, t: number): number {
        const n = this.getBuildInfo(t);
        if (n.heroId == -1) {
            return parseInt(n.stockCoin);
        }
        const o = NumberPlus.mul(e, this.getBaseOutCoin(n));
        return parseInt(o);
    }
    
    caculateOutExp(e: number, t: number, n: number): number {
        const o = this.getBuildInfo(t);
        if (o.heroId == -1)
            return parseInt(o.stockExp);
        const r = _BuildingConfig.Instance.get(t);
        e > n && (e = n);
        const i = NumberPlus.mul(e, r.outExpNum);
        return parseInt(i);
    }
    
    canLvUpBuild(e: number): boolean {
        const t = this.getBuildInfo(e);
        if (!(t.level >= this.getBuildMaxLevel(e))) {
            const n = _BuildingConfig.Instance.get(e), o = _BuildingLevelConfig.Instance.getCfg(e, t.level), r = n.levelUpId, i = UserData.Instance.getItem(r);
            if (NumberPlus.compare(i, o.levelCost)) {
                return true;
            }
        }
        cc.log("最大等级不可以升级");
        return false;
    }
    
    canSpeedUp(): boolean {
        if (this.isSpeedUp() && this.getSpeedUpRemainTime() >= GameConst.PLUNDER_SPEEDUP_MAXTIME - GameConst.PLUNDER_SPEEDUP_TIME) {
            return false;
        }
        return true;
    }

    public changeBuildHero(e: number, t: number): void {
        this.unEquipHero(t);
        const n = this.getBuildInfo(e);
        n.startTime = this.resetTime(MyTools.GetTimeNow());
        n.heroId = t;
        n.maxStock = this.getBaseMaxStock(n);
        this.saveRobBuildInfo(e, n);
    }

    checkQuest(e: E_RobQuestType, t: number = -1): void {
        const n = this;
        const o = Config.plunderQuest.values;
        if (e == E_RobQuestType.T_Build) {
            _.each(o, (e) => {
                if (e.questType == E_RobQuestType.T_Build) {
                    const o = n.getBuildInfo(t);
                    if (o && t == e.buildingId && o.level >= e.needLevel && n.getQuestState(e.id) == E_RobQuestState.S_NotComplete) {
                        n.completeQuest(e.id);
                    }
                }
            });
        }
        else if (e == E_RobQuestType.T_RobLevel) {
            _.each(o, function (e) {
                if (e.questType == E_RobQuestType.T_RobLevel && n.robData.robLevel >= e.needLevel && n.getQuestState(e.id) == E_RobQuestState.S_NotComplete) {
                    n.completeQuest(e.id);
                }
            });
        }
    }

    checkRobUpdate(): void { }

    checkSpeedUp(): void {
        if (this.robData != null && this.robData.speedUpEndTime != -1) {
            if (!this.isSpeedUp()) {
                cc.director.emit(GlobalEventName.RobSpeedUp, false);
                this.robData.speedUpEndTime = -1;
                this.robData.lastSpeedUpTime = -1;
                this.saveRobData();
            }
        }
    }

    completeQuest(e: number): void {
        this.saveRobQuestState(e, E_RobQuestState.S_Complete);
        cc.director.emit(GlobalEventName.FinishRoblevel);
    }

    public fixedUpdate(e: number): void {
        if ((e < 0 || e > .2) && (e = 1 / 60), this.timeIndex += e, this.timeIndex >= 1 && (this.timeIndex = 0, this.checkSpeedUp()), this.robData && this.robData.buildInfo.length > 0) {
            for (let t = 0; t < this.robData.buildInfo.length; t++) {
                const n = this.robData.buildInfo[t];
                if (n.startTime > -1 && !this.isMaxStockCoin(n.id)) {
                    const o = this.resetTime(MyTools.GetTimeNow());
                    if (0 == (o - n.startTime) / 1000 % this.getOutTime(n.id)) {
                        this.resetBuildInfo(o, n);
                    }
                }
            }
        }
    }

    public getAllRate(e: any): number {
        const t = _BuildingConfig.Instance.get(e.id);
        let n = 1;
        if (e.heroId != -1) {
            if (_HeroConfig.Instance.get(e.heroId).heroType == t.buildingType) {
                n += GameConst.PLUNDER_BUILDINGTYPE_ADD / 100;
            }
            n -= this.getRobHeroOutDiff(e.id, e.heroId);
        }
        return n + PlunderLevel.Instance.getAddRate(this.robData.robLevel) / 100;
    }

    public getBaseMaxStock(e: any): string {
        const t = this.getAllRate(e);
        const n = _BuildingLevelConfig.Instance.getCfg(e.id, e.level);
        let o = NumberPlus.mul(n.maxStock, t);
        const r = Math.floor(Number(NumberPlus.decode(o)) + 0.5).toString();
        return NumberPlus.number_format(r, 0);
    }

    public getBaseOutCoin(e: any): string {
        const t = this.getAllRate(e);
        const n = _BuildingLevelConfig.Instance.getCfg(e.id, e.level);
        let o = NumberPlus.mul(n.outNum, t);
        const r = Math.floor(Number(NumberPlus.decode(o)) + 0.5).toString();
        return NumberPlus.number_format(r, 0);
    }

    getBuildByHero(e: number) {
        for (let t = 0; t < this.robData.buildInfo.length; t++) {
            if (this.robData.buildInfo[t].heroId == e) {
                return this.robData.buildInfo[t];
            }
        }
        return null;
    }

    public getBuildInfo(e: number): any {
        for (let i = 0; i < this.robData.buildInfo.length; i++) {
            if (this.robData.buildInfo[i].id == e) {
                return this.robData.buildInfo[i];
            }
        }
        return null;
    }
    
    public getBuildInfoByHero(e: number): any {
        for (let i = 0; i < this.robData.buildInfo.length; i++) {
            if (this.robData.buildInfo[i].heroId == e) {
                return this.robData.buildInfo[i];
            }
        }
        return null;
    }

    public getBuildMaxLevel(e: number): any {
        return _BuildingLevelConfig.Instance.getBuildMaxLevel(e);
    }

    public getBuildOutCoinCount(e: number, t: number): string {
        if (!this.isUnlockBuild(e)) {
            return "0";
        }
        const n = this.getBuildInfo(e);
        if (n.heroId == -1 || this.isMaxStockCoin(e)) {
            return n.stockCoin;
        }
        let o = "0", r = 0;
        if (t > this.robData.lastSpeedUpTime && t < this.robData.speedUpEndTime) {
            if (n.startTime > this.robData.lastSpeedUpTime) {
                r = t - n.startTime;
                r = Math.floor(r / 1e3 / this.getSpeedUpOutTime(e));
                o = this.caculateOutCoin(r, e).toString();
            }
            else {
                let i = this.robData.lastSpeedUpTime - n.startTime;
                i = Math.floor(i / 1e3 / this.getConfigOutTime(e));
                const a = this.caculateOutCoin(i, e);
                let s = t - this.robData.lastSpeedUpTime;
                s = Math.floor(s / 1e3 / this.getSpeedUpOutTime(e)),
                    o = (NumberPlus.add(a, this.caculateOutCoin(s, e))).toString();
            }
        }
        else {
            r = t - n.startTime;
            r = Math.floor(r / 1e3 / this.getOutTime(e));
            o = this.caculateOutCoin(r, e).toString();
        }
        o = NumberPlus.add(o, n.stockCoin);
        if (NumberPlus.compare(o, this.getBaseMaxStock(n))) {
            o = this.getBaseMaxStock(n);
        }
        if (NumberPlus.compare("0", o)) {
            o = "0";
        }
        return o;
    }

    getBuildOutExp(e: number, t: number): string {
        if (!this.isUnlockBuild(e))
            return "0";
        const n = this.getBuildInfo(e);
        if (n.heroId == -1)
            return n.stockExp;
        let o = "";
        let r = 0;
        const i = this.getMaxSheaves(e);
        if (t > this.robData.lastSpeedUpTime && t < this.robData.speedUpEndTime) {
            if (n.startTime > this.robData.lastSpeedUpTime) {
                const a = t - n.startTime;
                const s = Math.floor(a / 1000 / this.getSpeedUpOutTime(e));
                o = this.caculateOutExp(s, e, i).toString();
            }
            else {
                let c;
                let l = 0;
                const u = this.robData.lastSpeedUpTime - n.startTime;
                const p = Math.floor(u / 1000 / this.getConfigOutTime(e));
                c = this.caculateOutExp(p, e, i);
                if (p < i) {
                    const f = t - this.robData.lastSpeedUpTime;
                    const d = Math.floor(f / 1000 / this.getSpeedUpOutTime(e));
                    const h = i - p;
                    const g = d < h ? d : h;
                    l = this.caculateOutExp(g, e, i);
                }
                o = (c + l).toString();
            }
        }
        else {
            const a = t - n.startTime;
            r = Math.floor(a / 1000 / this.getOutTime(e));
            o = this.caculateOutExp(r, e, i).toString();
        }
        o = NumberPlus.add(o, n.stockExp);
        const y = Math.floor(Number(NumberPlus.decode(o)) + 0.5).toString();
        o = NumberPlus.number_format(y, 0);
        NumberPlus.compare("0", o) && (o = "0");
        return o;
    }

    public getBuildingCfg(e: number): any {
        return _BuildingConfig.Instance.get(e);
    }

    getConfigOutTime(e: number): number {
        return _BuildingConfig.Instance.get(e).time;
    }
x
    getCurQuestId(): number {
        return this.robQuestData.curQuestId;
    }

    getHeroAddRate(e: number): number {
        const t = this.getBuildInfo(e);
        return t.heroId == -1 ? 0 : 1 - this.getRobHeroOutDiff(e, t.heroId);
    }

    getIsShowRobReward() {
        return this.isShowRobReward;
    }

    public getMapCtr(): MapCtr_ {
        return this.mapCtr;
    }

    getMaxSheaves(e: number): number {
        const t = this.getBuildInfo(e);
        if (t.heroId == -1)
            return 0;
        const n = Number(NumberPlus.decode(NumberPlus.div(NumberPlus.sub(this.getBaseMaxStock(t), t.stockCoin), this.getBaseOutCoin(t))));
        return Math.ceil(n);
    }

    getOutTime(e: number): number {
        let t = _BuildingConfig.Instance.get(e).time;
        if (this.robData.speedUpEndTime && this.robData.speedUpEndTime !== -1) {
            t /= GameConst.PLUNDER_SPEEDUP_NUM;
        }
        return t;
    }

    getQuestData(e: number) {
        for (let t = 0; t < this.robQuestData.questData.length; t++) {
            if (this.robQuestData.questData[t].id == e) {
                return this.robQuestData.questData[t];
            }
        }
        return null;
    }

    getQuestState(e: number): E_RobQuestState {
        const t = this.getQuestData(e);
        if (e == -1 || t == null) {
            return E_RobQuestState.S_NotComplete;
        }
        return t.state;
    }

    getRobDataInfo() {
        return this.robData;
    }

    getRobHeroOutDiff(e: number, t: number): number {
        const n = _BuildingConfig.Instance.get(e);
        const o = HeroData.Instance.getData(t).level;
        const r = n.goodLevel - o;
        return r <= 0 ? 0 : Config.plunderHero.get(r).outLow / 100;
    }

    getRobMaxLevel(): number {
        return PlunderLevel.Instance.getMaxLevel();
    }

    getSpeedUpOutTime(e: number): number {
        return _BuildingConfig.Instance.get(e).time / GameConst.PLUNDER_SPEEDUP_NUM;
    }

    getSpeedUpProgress(): number {
        if (this.robData.speedUpEndTime == -1)
            return 0;
        return this.getSpeedUpRemainTime() / GameConst.PLUNDER_SPEEDUP_MAXTIME;
    }

    getSpeedUpRemainTime(): number {
        if (this.robData.speedUpEndTime == -1)
            return 0;
        const nowTime = MyTools.GetTimeNow();
        return (this.robData.speedUpEndTime - nowTime) / 1000 / 60;
    }

    public getUnlockBuildNum(): number {
        let t = 0;
        const n = _BuildingConfig.Instance.getAll();
        _.forEach(n, (n) => {
            if (this.isUnlockBuild(n.id)) {
                t++;
            }
        });
        return t;
    }

    public heroLevelChange(e: number) {
        const t = this.getBuildByHero(e);
        if (t) {
            this.refreshBuildMaxStock(t.id);
        }
    }

    public initBuildInfo() {
        const buildInfos = _BuildingConfig.Instance.getAll();
        _.each(buildInfos, (buildInfo: any) => {
            if (this.getBuildInfo(buildInfo.id) == null) {
                const n = buildInfo.id;
                const o = {
                    heroId: -1,
                    id: n,
                    level: 0,
                    maxStock: "0",
                    startTime: -1,
                    stockCoin: "0",
                    stockExp: "0"
                };
                o.maxStock = this.getBaseMaxStock(o);
                this.robData.buildInfo.push(o);
                this.saveRobBuildInfo(n, o);
            }
        });
    }

    initLoadData() { }

    initQuest() {
        let t = Config.plunderQuest.values;
        _.each(t, (t) => {
            let n = false;
            for (let o = 0; o < this.robQuestData.questData.length; o++) {
                if (this.robQuestData.questData[o].id == t.id) {
                    n = true;
                    break;
                }
            }
            if (!n) {
                let i = {
                    id: t.id,
                    state: E_RobQuestState.S_NotComplete
                };
                this.robQuestData.questData.push(i);
            }
        });
        this.saveRobQuestData();
    }

    public isHeroEquiped(e: number): boolean {
        return null != this.getBuildByHero(e);
    }

    isMaxStockCoin(e: number): boolean {
        const t = this.getBuildInfo(e);
        return NumberPlus.compare(t.stockCoin, t.maxStock);
    }

    isSpeedUp(): boolean {
        if (this.robData.speedUpEndTime != -1 && MyTools.GetTimeNow() <= this.robData.speedUpEndTime) {
            return true;
        }
        return false;
    }

    isUnlockBuild(e: number): boolean {
        const t = _BuildingConfig.Instance.get(e);
        return this.robData.robLevel >= t.unlockLevel;
    }

    load() {
        cc.director.on(GlobalEventName.HeroLevelChange, this.heroLevelChange, this);
        let e = LocalStorageTool.getItemLocal(this.robDataKey, "{}");
        if ("{}" == e) {
            e = JSON.stringify({
                buildInfo: [],
                speedUpEndTime: -1,
                lastSpeedUpTime: -1,
                robLevel: 1,
                robExp: 0
            });
        }
        this.robData = JSON.parse(e);
        if (this.robData.robExp < 0) {
            this.robData.robExp = 0;
        }
        this.initBuildInfo();
        let t = LocalStorageTool.getItemLocal(this.robQuestKey, "{}");
        if ("{}" == t) {
            t = JSON.stringify({
                questData: [],
                curQuestId: 1
            });
        }
        this.robQuestData = JSON.parse(t);
        this.isShowRobReward = LocalStorageTool.getItemLocal(this.isShowRobRewardKey, false);
        this.initQuest();
    }

    onDisable() {
        // this.unscheduleAllCallbacks();
        cc.director.targetOff(this);
    }

    public popLevelUpView(upLevels: any, curIndex: number): void {
        Model.ui.openViewAsync(MapUIPrefabs.RobLevelUpViewUI, {
            data: {
                upLevels,
                curIndex
            }
        });
    }
 
    receiveOutCoinAndExp(e: number): any {
        const t = {
            coin: "",
            coinType: 0,
            exp: "",
            levelUpList: [],
        };
        const n = _BuildingConfig.Instance.get(e);
        const o = n.outId;
        const r = this.getBuildInfo(e).stockCoin;
        UserData.Instance.addItem(o, r);
        const a = this.getBuildInfo(e).stockExp;
        t.coin = r;
        t.exp = a;
        t.coinType = n.outId;
        const s = this.addRobExp(a);
        t.levelUpList = s;
        const c = this.getBuildInfo(e);
        c.stockCoin = "0";
        c.stockExp = "0";
        const l = MyTools.GetTimeNow();
        c.startTime = this.resetTime(l);
        this.saveRobBuildInfo(e, c);
        this.checkQuest(E_RobQuestType.T_RobLevel);
        return t;
    }

    receiveQuest(e: number): void {
        if (this.getQuestState(e) == E_RobQuestState.S_Complete) {
            this.robQuestData.curQuestId++;
            this.saveRobQuestState(e, E_RobQuestState.S_Receive);
        }
    }

    public refreshBuildMaxStock(e: number): void {
        const t = this.isMaxStockCoin(e), n = this.getBuildInfo(e);
        if (!t) {
            n.maxStock = this.getBaseMaxStock(n);
        }
        this.saveRobBuildInfo(e, n);
    }

    public resetBuildInfo(e: number, t: any): void {
        if (t !== null) {
            const { id } = t;
            t.stockExp = this.getBuildOutExp(id, e);
            t.stockCoin = this.getBuildOutCoinCount(id, e);
            t.startTime = this.resetTime(e);
            this.refreshBuildMaxStock(id);
            this.saveRobBuildInfo(id, t);
        }
    }
   
    public resetTime(e: number): number {
        return 1000 * Math.floor(2 * e / 1000 + .5) / 2;
    }

    saveRobBuildInfo(e: number, t: any) {
        let n = false;
        for (let o = 0; o < this.robData.buildInfo.length; o++) {
            if (this.robData.buildInfo[o].id == e) {
                this.robData.buildInfo[o] = t;
                n = true;
                break;
            }
        }
        if (!n) {
            this.robData.buildInfo.push(t);
        }
        this.saveRobData();
    }

    saveRobData() {
        LocalStorageTool.setItemLocal(this.robDataKey, JSON.stringify(this.robData));
    }

    saveRobQuestData() {
        LocalStorageTool.setItemLocal(this.robQuestKey, JSON.stringify(this.robQuestData));
    }
    saveRobQuestState(e: number, t: number) {
        for (let n = 0; n < this.robQuestData.questData.length; n++) {
            if (this.robQuestData.questData[n].id == e) {
                this.robQuestData.questData[n].state = t;
                break;
            }
        }
        this.saveRobQuestData();
    }

    public setMapCtr(e: MapCtr_): void {
        this.mapCtr = e;
    }

    setShowRobReward() {
        this.isShowRobReward = true;
        LocalStorageTool.setItemLocal(this.isShowRobRewardKey, this.isShowRobReward);
    }

    public showRedPoint(): boolean {
        let t = 0;
        const n = _BuildingConfig.Instance.getAll();
        _.forEach(n, (n) => {
            const { heroId } = this.getBuildInfo(n.id);
            if (heroId > -1 && this.isMaxStockCoin(n.id)) {
                t++;
            }
        });
        return t > 0;
    }

    public unEquipHero(e: number): void {
        const t = this.getBuildByHero(e);
        if (t != null) {
            t.heroId = -1;
            t.startTime = -1;
            t.maxStock = this.getBaseMaxStock(t);
            this.saveRobBuildInfo(t.id, t);
        }
    }
}
