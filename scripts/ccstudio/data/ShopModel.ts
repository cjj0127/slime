import HeroData from "../../modules/hero/HeroData";
import LocalStorageTool from "../utils/LocalStorage";
import ModeBase from "./ModelBase";
import Model from "./Model";
import _ShopConfig from "../config/_ShopConfig";
import MyTools from "../utils/MyTools";
import UserData, { AssetGetType } from "../../modules/user/UserData";
import { EVideoType, EOpenUIType } from "../../modules/common/ViedioType";
import { GlobalEventName } from "../../modules/common/Events";
import { E_SHOP_TRIGGER_ID, WEEK_SECONDS, E_SHOP_TYPE, DAY_SECONDS, E_ASSET_TYPE, GameConst, E_CYCLE_TYPE } from "../../modules/common/Const";
import AdsManager, { EVideoStatus } from "../../modules/ads/AdsManager";
import UIAssetReceiveView from "../../modules/asset/UIAssetReceiveView";
const _: any = window["_"];
const m: any = window["moment"];
export enum E_ActionType {
    EClose,
    EOpen
}
export default class ShopModel extends ModeBase {
    private _dailyOpenMoment: any = null;
    private _payTotal = 0;
    private _weekOpenMoment: any = null;
    private checkMethods: any = {};
    private datas: any = {};
    calcOpenDate(shop) {
        const triggers = shop.trigger;
        const data = this.getData(shop.id);
        const now = m(MyTools.GetTimeNow()).subtract(8, "hours").startOf("days").add(8, "hour");
        for (let i = 0; i < triggers.length; i++) {
            const trigger = triggers[i];
            switch (trigger.type) {
                case E_SHOP_TRIGGER_ID.Interval:
                    if (data) {
                        const openDate = m(data.openDate);
                        const diff = now.diff(openDate, "days") % Number(trigger.value);
                        return now.subtract(diff, "days");
                    }
                    return now;
                case E_SHOP_TRIGGER_ID.StartDate:
                    return m(trigger.value).add(8, "hours");
            }
        }
        return now;
    }
    checkCloseDate(dateStr) {
        const date = m(dateStr).add(8, "hours");
        return m(MyTools.GetTimeNow()).isBefore(date);
    }
    private checkHero(e: number): boolean {
        const t = HeroData.Instance.getData(e);
        return !!t && t.level > 0;
    }
    private checkInterval(): boolean {
        return true;
    }
    checkLevel(level) {
        return HeroData.Instance.totalLevel >= level;
    }
    checkLimitEnable(e) {
        var t;
        t = "number" == typeof e ? _ShopConfig.Instance.get(e) : e = e.id;
        var n = this.getData(e);
        if (!n)
            return !0;
        var o = t.limitCycle, r = t.limitCnt;
        if (o == E_CYCLE_TYPE.None || 0 == r)
            return !0;
        switch (o) {
            case E_CYCLE_TYPE.Daily:
                var i = m(MyTools.GetTimeNow()).subtract(8, "hours").startOf("days").add(8, "hours");
                return _.reduce(n.payList, function (e, t) {
                    var n = m(t);
                    return n.isAfter(i) && e.push(n),
                        e;
                }, []).length < r;
            case E_CYCLE_TYPE.Weekly:
            case E_CYCLE_TYPE.Month:
                var a = n.openDate;
                return _.reduce(n.payList, function (e, t) {
                    var n = m(t);
                    return n.isAfter(a) && e.push(n),
                        e;
                }, []).length < r;
            case E_CYCLE_TYPE.Forever:
                return n.payList.length < r;
        }
        return !0;
    }
    checkLogin() {
        return true;
    }
    private checkPass(e: number): boolean {
        return Model.pass.passId != e;
    }
    private checkPayLower(e: number): boolean {
        return this.payTotal >= e;
    }
    private checkPayUpper(e: number): boolean {
        return this.payTotal <= e;
    }
    private checkShopEnable(e: any): boolean {
        const n = e.trigger, o = e.duration;
        if (n.length == 0)
            return true;
        if (!_.every(n, (n: any) => {
            const o = n.type, r = n.value, i = this.checkMethods[o];
            return i && i.call(this, r, e);
        }))
            return false;
        const r = this.getData(e.id);
        if (o > 0) {
            const i = m(r.openDate).add(o, "days"), a = m(MyTools.GetTimeNow());
            return i.isAfter(a);
        }
        return true;
    }
    checkStartDate(dateStr) {
        const date = m(dateStr).add(8, "hours");
        return m(MyTools.GetTimeNow()).isAfter(date);
    }
    private checkSys(): boolean {
        return true;
    }
    createData(id, openDate, adCnt = 0, status = E_ActionType.EOpen) {
        return {
            id,
            payList: [],
            openDate,
            status,
            adCnt
        };
    }
    fixedUpdate() {
        let isChanged = false;
        _.each(this.datas, (data) => {
            const shop = _ShopConfig.Instance.get(data.id);
            if (data.status == E_ActionType.EClose) {
                if (this.checkShopEnable(shop)) {
                    data.status = E_ActionType.EOpen;
                    data.openDate = m(MyTools.GetTimeNow());
                    isChanged = true;
                }
            }
            else {
                if (!this.checkShopEnable(shop)) {
                    data.status = E_ActionType.EClose;
                    isChanged = true;
                }
            }
        });
        const now = m(MyTools.GetTimeNow());
        if (now.diff(this.weekOpenMoment, "seconds") >= WEEK_SECONDS) {
            this.weekOpenMoment = m(now);
            this.saveWeekOpenTime();
            const weeklyShops = _ShopConfig.Instance.getTypes(E_SHOP_TYPE.Weekly);
            _.each(weeklyShops, (shop) => {
                this.getData(shop.id).openDate = this.weekOpenMoment;
            });
            isChanged = true;
            cc.director.emit(GlobalEventName.ShopWeekRefresh);
        }
        if (now.diff(this.dailyOpenMoment, "seconds") >= DAY_SECONDS) {
            this.dailyOpenMoment = m(now).subtract(8, "hours").startOf("days").add(8, "hour");
            this.saveDailyOpenTime();
            const dailyShops = _ShopConfig.Instance.getTypes(E_SHOP_TYPE.Daily);
            _.each(dailyShops, (shop) => {
                this.getData(shop.id).openDate = this.dailyOpenMoment;
            });
            isChanged = true;
            cc.director.emit(GlobalEventName.ShopDailyefresh);
        }
        if (isChanged) {
            this.saveData();
        }
    }
    getCyclePayCount(e) {
        var t;
        t = "number" == typeof e ? _ShopConfig.Instance.get(e) : e = e.id;
        var n = this.getData(e);
        if (!n)
            return 0;
        var o = t.limitCycle;
        switch (t.limitCnt, o) {
            case E_CYCLE_TYPE.Daily:
                var r = m(MyTools.GetTimeNow()).subtract(8, "hours").startOf("days").add(8, "hours");
                return _.reduce(n.payList, function (e, t) {
                    var n = m(t);
                    return n.isAfter(r) && e.push(n),
                        e;
                }, []).length;
            case E_CYCLE_TYPE.Weekly:
            case E_CYCLE_TYPE.Month:
                var i = n.openDate;
                return _.reduce(n.payList, function (e, t) {
                    var n = m(t);
                    return n.isAfter(i) && e.push(n),
                        e;
                }, []).length;
        }
        return n.payList.length;
    }
    public getData(e: any) {
        return this.datas[e];
    }
    public getFreeEnable() {
        const e = this.getData(GameConst.SHOP_FREE_ID);
        return _.isNil(e) || this.checkLimitEnable(GameConst.SHOP_FREE_ID);
    }
    initLoadData() {
        // this.schedule(this.fixedUpdate, 1, cc.macro.REPEAT_FOREVER, Math.random());
        // cc.game.on(cc.game.EVENT_HIDE, () => {
        //     this.unschedule(this.fixedUpdate);
        // });
        // cc.game.on(GlobalEvent.GameResume, () => {
        //     this.schedule(this.fixedUpdate, 1, cc.macro.REPEAT_FOREVER, Math.random());
        // });
    }
    load() {
        this.checkMethods[E_SHOP_TRIGGER_ID.Level] = this.checkLevel;
        this.checkMethods[E_SHOP_TRIGGER_ID.Login] = this.checkLogin;
        this.checkMethods[E_SHOP_TRIGGER_ID.StartDate] = this.checkStartDate;
        this.checkMethods[E_SHOP_TRIGGER_ID.CloseDate] = this.checkCloseDate;
        this.checkMethods[E_SHOP_TRIGGER_ID.PayLower] = this.checkPayLower;
        this.checkMethods[E_SHOP_TRIGGER_ID.PayUpper] = this.checkPayUpper;
        this.checkMethods[E_SHOP_TRIGGER_ID.Sys] = this.checkSys;
        this.checkMethods[E_SHOP_TRIGGER_ID.Hero] = this.checkHero;
        this.checkMethods[E_SHOP_TRIGGER_ID.Pass] = this.checkPass;
        this.checkMethods[E_SHOP_TRIGGER_ID.Interval] = this.checkInterval;
        const t = LocalStorageTool.getItemLocal('user-shop-data', {});
        this.payTotal = LocalStorageTool.getItemLocal('user-shop-total-pay', 0);
        let n = false;
        this.datas = {};
        if (!_.isEmpty(t)) {
            _.each(t, (t: any) => {
                const o = t.id;
                let r = t.status;
                const i = t.payList;
                let a = t.openDate;
                const s = t.adCnt;
                const l = _ShopConfig.Instance.get(o);
                if (l) {
                    if (r == E_ActionType.EClose) {
                        if (this.checkShopEnable(l)) {
                            r = E_ActionType.EOpen;
                            a = this.calcOpenDate(l);
                            n = true;
                        }
                    }
                    else if (!this.checkShopEnable(l)) {
                        r = E_ActionType.EClose;
                        n = true;
                    }
                }
                a = m(a);
                const u = this.createData(o, a, s, r);
                u.payList = i;
                this.datas[o] = u;
            });
        }
        const o = _ShopConfig.Instance.getAll();
        _.each(o, (t: any) => {
            if (!this.datas[t.id]) {
                let o = E_ActionType.EClose;
                const r = m(MyTools.GetTimeNow());
                if (this.checkShopEnable(t)) {
                    o = E_ActionType.EOpen;
                }
                const i = this.createData(t.id, r, 0, o);
                this.datas[t.id] = i;
                n = true;
            }
        });
        const r = m(MyTools.GetTimeNow());
        let i = LocalStorageTool.getItemLocal('user-week-open-moment');
        if (_.isNil(i)) {
            this.weekOpenMoment = m(MyTools.GetTimeNow()).weekday(1).startOf('days').add(8, 'hour');
            this.saveWeekOpenTime();
        }
        else {
            this.weekOpenMoment = m(i);
            if (r.isBefore(this.weekOpenMoment) || r.diff(this.weekOpenMoment, 'seconds') >= WEEK_SECONDS) {
                this.weekOpenMoment = m(MyTools.GetTimeNow()).weekday(1).startOf('days').add(8, 'hour');
                this.saveWeekOpenTime();
                const a = _ShopConfig.Instance.getTypes(E_SHOP_TYPE.Weekly);
                _.each(a, (t: any) => {
                    this.getData(t.id).openDate = this.weekOpenMoment;
                });
                n = true;
            }
        }
        i = LocalStorageTool.getItemLocal('user-daily-open-moment');
        if (_.isNil(i)) {
            this.dailyOpenMoment = m(MyTools.GetTimeNow()).subtract(8, 'hours').startOf('days').add(8, 'hour');
        }
        else {
            this.dailyOpenMoment = m(i);
            if (r.diff(this.dailyOpenMoment, 'seconds') >= DAY_SECONDS) {
                this.dailyOpenMoment = m(MyTools.GetTimeNow()).subtract(8, 'hours').startOf('days').add(8, 'hour');
                this.saveDailyOpenTime();
                const a = _ShopConfig.Instance.getTypes(E_SHOP_TYPE.Daily);
                _.each(a, (t: any) => {
                    this.getData(t.id).openDate = this.dailyOpenMoment;
                });
                n = true;
            }
        }
        if (n) {
            this.saveData();
            this.saveTotalPay();
        }
    }
    async requestBuy(e, t) {
        const n = _ShopConfig.Instance.get(e);
        const o = n.currency;
        const r = n.price;
        const i = this.getData(e);
        if (i.status === E_ActionType.EClose) {
            return Promise.resolve(false);
        }
        if (!this.checkLimitEnable(e)) {
            return Promise.resolve(null);
        }
        if (r === 0) { //免费
            await this.sendReward(e, t);
            this.payTotal += n.price;
            return Promise.resolve(true);
        }
        if (o !== E_ASSET_TYPE.Cash) {
            //   return Promise.resolve(false);
        }
        // const purchaseResult = await NativeBridge.Instance.requestBuy(n.name, n.price);
        // if (purchaseResult) {
        //     this.payTotal += n.price;
        //     await this.sendReward(e, t);
        //     return Promise.resolve(true);
        // } else {
        //     return Promise.resolve(false);
        // }
        if (o !== E_ASSET_TYPE.Ad) {
            return Promise.resolve(false);
        }
        const a = () => { };
        const u = EVideoType.AdShop + "_" + e;
        const p = {
            AdsType: u,
            OpenUi: EOpenUIType.Shop,
            onSucceed: a,
        };
        const adStatus = await AdsManager.getInstance().showRewardedVideo(p);
        if (adStatus === EVideoStatus.Success) {
            if (i.adCnt++ >= n.price) {
                i.adCnt -= n.price;
                await this.sendReward(e, t);
                return Promise.resolve(true);
            }
            this.saveData();
        }
        return Promise.resolve(false);
        // if (S.parseInt(_.UserData.Instance.getItem(o)) < r) {
        //     const y = d.default.Instance.get(o);
        //     g.default.warn("Not enough " + y.name + "s");
        //     return Promise.resolve(false);
        // } else {
        //     _.UserData.Instance.subItem(o, r);
        //     await this.sendReward(e, t);
        //     return Promise.resolve(true);
        // }
    }
    saveDailyOpenTime() {
        LocalStorageTool.setItemLocal('user-daily-open-moment', this.dailyOpenMoment.format());
    }
    // private checkMethods = {};
    // private datas = {};
    // private weekOpenMoment: any;
    // private dailyOpenMoment: any;
    // private payTotal = 0;
    saveData() {
        const data = {};
        _.each(this.datas, (t: any, n: string) => {
            const o = parseInt(n);
            data[o] = {
                id: t.id,
                openDate: t.openDate.format(),
                payList: t.payList,
                status: t.status,
                adCnt: t.adCnt,
            };
        });
        LocalStorageTool.setItemLocal('user-shop-data', data);
    }
    saveTotalPay() {
        LocalStorageTool.setItemLocal('user-shop-total-pay', this.payTotal);
    }
    saveWeekOpenTime() {
        LocalStorageTool.setItemLocal('user-week-open-moment', this.weekOpenMoment.format());
    }
    sendReward(shopId: number, t) {
        const shop = _ShopConfig.Instance.get(shopId);
        const goods = shop.goods;
        const firstDouble = shop.firstDouble;
        let data = this.getData(shopId);
        if (_.isNil(data)) {
            data = this.datas[shopId] = this.createData(shopId, m(MyTools.GetTimeNow()));
        }
        const cyclePayCount = this.getCyclePayCount(shop);
        const isFirstDouble = firstDouble && cyclePayCount == 0;
        const rewards = [];
        _.each(goods, (good) => {
            let count = good.count;
            if (isFirstDouble) {
                count *= 2;
            }
            rewards.push({
                id: good.id,
                count: count
            });
            UserData.Instance.addItem(good.id, count);
        });
        let assetGetType = AssetGetType.Shop;
        if (shop.price == 0) {
            assetGetType = AssetGetType.ShopFree;
        }
        UIAssetReceiveView.open(rewards, assetGetType);
        const payList = _.get(data, "payList", []);
        payList.push(m(MyTools.GetTimeNow()).format());
        _.set(data, "payList", payList);
        cc.director.emit(GlobalEventName.ShopPurchaseSuccess, shopId, isFirstDouble);
        cc.director.emit(GlobalEventName.ShopPurchaseSuccess + shopId, isFirstDouble);
        this.saveData();
        return rewards;
    }
    set dailyOpenMoment(value) {
        this._dailyOpenMoment = value;
    }
    get dailyOpenMoment() {
        return this._dailyOpenMoment;
    }
    set payTotal(value) {
        this._payTotal = value;
        this.saveTotalPay();
    }
    get payTotal() {
        return this._payTotal;
    }
    set weekOpenMoment(value) {
        this._weekOpenMoment = value;
    }
    get weekOpenMoment() {
        return this._weekOpenMoment;
    }
}
