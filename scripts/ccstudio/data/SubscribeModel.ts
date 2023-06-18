import { SdkBridge } from "../utils/SdkBridge";
import GuideMgr from "../../modules/guide/GuideMgr";
import LanMgr from "../../modules/common/Language";
import LocalStorageTool from "../utils/LocalStorage";
import ShopModel from "./ShopModel";
import Model from "./Model";
import NumberPlus from "../utils/NumberPlus";
import MyTools from "../utils/MyTools";
import CCSdk from "../../modules/sdk/ZtSdk";
import { GameConst } from "../../modules/common/Const";
import { eChannelType } from "../../modules/common/ChannelManager";
import WxAdManager from "../../modules/ads/WxAdManager";
const moment = window['moment'];
export enum E_SUBSCRIBE_ID {
    SUB_NUMBER_OF_CHALLENGE = "",//'0-aQ3F2Dh4k6YcAgcG7t6XrjOROcmcT5OYc5qe1jMCc',
    SUB_EARN_OF_HANGUP = "",//'TzdcflN1sAjr8EBK9ofjA8Z2a6jGaguJk6nG3wzCIJw',
    SUB_STORE_REFRESH = "",//'id_Bp9LQdbD0-qnL-nQMrigmBjFP1booSsSKmRQwhSo',
    SUB_UPDATE_VERSION = "",//'jU6y8aZDXmQV2ztNMFOa1hSIRYLvbMp5678XawdsebU'
}
export default class SubscribeModel {
    private SUBSCRIBE_DATA: string = 'subscribeData';
    private static _instance: SubscribeModel;
    private subscribeData: any;
    public async checkEctypeAndVersion() {
        if (SdkBridge.getChannelType() !== eChannelType.WECHAT || GuideMgr.instance.isInGuide()) {
            return;
        }
        else {
            let e: any[] = [];
            if ("" == this.getSubscribeTime(E_SUBSCRIBE_ID.SUB_NUMBER_OF_CHALLENGE)) {
                e.push(E_SUBSCRIBE_ID.SUB_NUMBER_OF_CHALLENGE);
            }
            else if (await this.checkGetPermissions(E_SUBSCRIBE_ID.SUB_NUMBER_OF_CHALLENGE)) {
                e.push(E_SUBSCRIBE_ID.SUB_NUMBER_OF_CHALLENGE);
            }
            if ("" == this.getSubscribeTime(E_SUBSCRIBE_ID.SUB_UPDATE_VERSION)) {
                e.push(E_SUBSCRIBE_ID.SUB_UPDATE_VERSION);
            }
            else if (await this.checkGetPermissions(E_SUBSCRIBE_ID.SUB_UPDATE_VERSION)) {
                e.push(E_SUBSCRIBE_ID.SUB_UPDATE_VERSION);
            }
            if (e.length > 0) {
                await WxAdManager.Instance().getSubscribePermissions(e);
            }
        }
    }
    public checkGetPermissions(key: string): boolean {
        return Number(this.getSubscribeTime(key)) < Number(MyTools.GetTimeNow());
    }
    public async checkHangUpSubscribe() {
        if (SdkBridge.getChannelType() !== eChannelType.WECHAT || GuideMgr.instance.isInGuide()) {
            return;
        }
        else if ("" == this.getSubscribeTime(E_SUBSCRIBE_ID.SUB_EARN_OF_HANGUP)) {
            return;
        }
        else if (await this.checkGetPermissions(E_SUBSCRIBE_ID.SUB_EARN_OF_HANGUP)) {
            await WxAdManager.Instance().getSubscribePermissions([E_SUBSCRIBE_ID.SUB_EARN_OF_HANGUP]);
        }
        else {
            this.sendSubscribe(E_SUBSCRIBE_ID.SUB_EARN_OF_HANGUP, this.getHangUpMsg(), this.getSurpuseCollectTime());
        }
    }
    public async checkShopSubscribe() {
        if (SdkBridge.getChannelType() !== eChannelType.WECHAT || GuideMgr.instance.isInGuide()) {
            return;
        }
        else if ("" == this.getSubscribeTime(E_SUBSCRIBE_ID.SUB_STORE_REFRESH)) {
            return;
        }
        else if (await this.checkGetPermissions(E_SUBSCRIBE_ID.SUB_STORE_REFRESH)) {
            await WxAdManager.Instance().getSubscribePermissions([E_SUBSCRIBE_ID.SUB_STORE_REFRESH]);
        }
        else {
            this.sendSubscribe(E_SUBSCRIBE_ID.SUB_STORE_REFRESH, this.getShopMsg(), this.getShopCd());
        }
    }
    public checkSubscribePermission(permission: string): boolean {
        return permission == "accept" || permission == "acceptWithAudio";
    }
    public getChallengeCd(): number {
        const e = Model.level.lastAutoReplenished;
        let t = moment(e).add(24, "hours").diff(moment());
        t = Math.max(0, t);
        return Number(t);
    }
    public getChallengeRecoverMsg(): Record<string, {
        value: string;
    }> {
        const e = LanMgr.Instance.getLangByID("Subscribe_Clallenge_Msg");
        const value = "Subscribe_Clallenge_Msg" == e || e.length > 20 ? "副本钥匙补充完毕，快来继续挑战吧！" : e;
        return { character_string1: { value: "2/2" }, thing2: { value } };
    }
    public getHangUpMsg(): Record<string, {
        value: string;
    }> {
        const e = LanMgr.Instance.getLangByID("Subscribe_Hangup_Msg");
        const t = moment.utc(6e4 * GameConst.IDLE_REWARD_MAX_TIME).format("HH:mm").toString();
        const value = "Subscribe_Hangup_Msg" == e || e.length > 20 ? "挂机收益已满，快来上线领取吧！" : e;
        return {
            thing1: { value: `金币：${this.getOverCollectCoin()}` },
            thing2: { value },
            time3: { value: t },
            thing4: { value: `金币：${this.getOverCollectCoin()}` }
        };
    }
    public getOverCollectCoin(): string {
        const idleInfo = Model.obtain.getIdleInfo();
        const coins = idleInfo.coins;
        const collectSpeed = Model.obtain.getCollectSpeed();
        const surpuseCollectTime = this.getSurpuseCollectTime();
        const o = coins + Number(collectSpeed) * Math.floor(surpuseCollectTime / 6e4);
        return NumberPlus.format(o);
    }
    private getPromissionCd(e: any) {
        switch (e) {
            case E_SUBSCRIBE_ID.SUB_STORE_REFRESH:
                return GameConst.SUBSCRIBE_PROMISS_STORE_CD;
            case E_SUBSCRIBE_ID.SUB_EARN_OF_HANGUP:
                return GameConst.SUBSCRIBE_PROMISS_HANGUP_CD;
            case E_SUBSCRIBE_ID.SUB_NUMBER_OF_CHALLENGE:
                return GameConst.SUBSCRIBE_PROMISS_CHALLENGE_CD;
            case E_SUBSCRIBE_ID.SUB_UPDATE_VERSION:
                return GameConst.SUBSCRIBE_PROMISS_VERSION_CD;
            default:
                return 48;
        }
    }
    private getRejectCd(e: any) {
        switch (e) {
            case E_SUBSCRIBE_ID.SUB_STORE_REFRESH:
                return GameConst.SUBSCRIBE_REJECT_STORE_CD;
            case E_SUBSCRIBE_ID.SUB_EARN_OF_HANGUP:
                return GameConst.SUBSCRIBE_REJECT_HANGUP_CD;
            case E_SUBSCRIBE_ID.SUB_NUMBER_OF_CHALLENGE:
                return GameConst.SUBSCRIBE_REJECT_CHALLENGE_CD;
            case E_SUBSCRIBE_ID.SUB_UPDATE_VERSION:
                return GameConst.SUBSCRIBE_REJECT_VERSION_CD;
            default:
                return 48;
        }
    }
    public getShopCd(): number {
        const e = Model.shop.dailyOpenMoment;
        const t = moment(e).add(24, "hours");
        const n = moment();
        let diff = t.diff(n);
        diff = Number(diff);
        return diff;
    }
    public getShopMsg(): Record<string, {
        value: string;
    }> {
        const e = LanMgr.Instance.getLangByID("Subscribe_Shop_Msg");
        const now = MyTools.GetDateNow();
        const t = moment(now);
        let r = moment(t).add(24, "hours");
        if (t.hours() >= 8) {
            r = moment(r).add(24, "hours");
        }
        const i = moment(r).add(24, "hours");
        const value = "Subscribe_Shop_Msg" == e || e.length > 20 ? "免费钻石冷却完毕，快上线领取吧！" : e;
        return {
            thing1: { value },
            time2: { value: t.format("yyyy-M-d HH:mm") },
            time3: { value: `${r.format("yyyy-M-d")} 08:00` },
            time4: { value: `${r.format("yyyy-M-d")} 08:00~${i.format("yyyy-M-d")} 08:00` }
        };
    }
    public getSubscribeTime(key: string): string {
        let time = "";
        if (this.subscribeData[key]) {
            time = this.subscribeData[key];
        }
        return time;
    }
    public getSurpuseCollectTime(): number {
        return 1e3 * (60 * GameConst.IDLE_REWARD_MAX_TIME - Model.obtain.getCollectTime());
    }
    public init() {
        let e = LocalStorageTool.getItemLocal(this.SUBSCRIBE_DATA);
        if (e) {
            try {
                e = JSON.parse(e);
            }
            catch (t) { }
            this.subscribeData = e;
        }
        else {
            this.subscribeData = {};
            this.saveSubscribeData();
        }
    }
    reportSubscribePromission(e) {
        const t = {
            Push_Type: (() => {
                switch (e) {
                    case E_SUBSCRIBE_ID.SUB_STORE_REFRESH:
                        return "ShopRefresh";
                    case E_SUBSCRIBE_ID.SUB_EARN_OF_HANGUP:
                        return "IdleReward";
                    case E_SUBSCRIBE_ID.SUB_NUMBER_OF_CHALLENGE:
                        return "KeyRefresh";
                    case E_SUBSCRIBE_ID.SUB_UPDATE_VERSION:
                        return "GameNew";
                    default:
                        return e;
                }
            })()
        };
    }
    public repostHangUpMsg() {
        if (SdkBridge.getChannelType() == eChannelType.WECHAT && "" !== this.getSubscribeTime(E_SUBSCRIBE_ID.SUB_EARN_OF_HANGUP) && !this.checkGetPermissions(E_SUBSCRIBE_ID.SUB_EARN_OF_HANGUP) && this.getSurpuseCollectTime() > 1000) {
            this.sendSubscribe(E_SUBSCRIBE_ID.SUB_EARN_OF_HANGUP, this.getHangUpMsg(), this.getSurpuseCollectTime());
        }
    }
    // private subscribeData: { [key: string]: string } = {};
    // private readonly SUBSCRIBE_DATA = "SUBSCRIBE_DATA";
    public repostVersionMsg(): void {
        const version = E_SUBSCRIBE_ID.SUB_UPDATE_VERSION;
        if (SdkBridge.getChannelType() == eChannelType.WECHAT && this.getSubscribeTime(version) !== "") {
            CCSdk.instance.updateUserVersion(version);
        }
    }
    saveRejectTime(e) {
        const t = 36e5 * this.getRejectCd(e);
        this.saveSubscribeTime(e, t);
    }
    private saveSubscribeData(): void {
        let data = this.subscribeData;
        try {
            data = JSON.stringify(this.subscribeData);
        }
        catch (error) { }
        LocalStorageTool.setItemLocal(this.SUBSCRIBE_DATA, data);
    }
    public saveSubscribeTime(key: string, time: number): void {
        const newTime = Number(MyTools.GetTimeNow()) + Number(time);
        this.subscribeData[key] = newTime.toString();
        this.saveSubscribeData();
    }
    async sendSubscribe(e, t, n) {
        if (SdkBridge.getChannelType() == eChannelType.WECHAT) {
            cc.warn("subscribe Msg: ", e, t, n);
            CCSdk.instance.sendSubscribeMsg(e, t, n);
        }
    }
    async sendSubscribeMsg(e) {
        const t = E_SUBSCRIBE_ID.SUB_STORE_REFRESH;
        const o = E_SUBSCRIBE_ID.SUB_EARN_OF_HANGUP;
        const a = E_SUBSCRIBE_ID.SUB_NUMBER_OF_CHALLENGE;
        const s = E_SUBSCRIBE_ID.SUB_UPDATE_VERSION;
        if (e[t]) {
            if (this.checkSubscribePermission(e[t])) {
                this.sendSubscribe(t, this.getShopMsg(), this.getShopCd());
                this.reportSubscribePromission(t);
            }
            else {
                this.saveRejectTime(t);
            }
        }
        if (e[o]) {
            if (this.checkSubscribePermission(e[o])) {
                this.sendSubscribe(o, this.getHangUpMsg(), this.getSurpuseCollectTime());
                this.reportSubscribePromission(o);
            }
            else {
                this.saveRejectTime(o);
            }
        }
        if (e[a]) {
            if (this.checkSubscribePermission(e[a])) {
                this.sendSubscribe(a, this.getChallengeRecoverMsg(), this.getChallengeCd());
                this.reportSubscribePromission(a);
            }
            else {
                this.saveRejectTime(a);
            }
        }
        if (e[s]) {
            if (this.checkSubscribePermission(e[s])) {
                CCSdk.instance.updateUserVersion(s);
                this.reportSubscribePromission(s);
            }
            else {
                this.saveRejectTime(s);
            }
        }
        return [2];
    }
    public static get Instance(): SubscribeModel {
        if (!this._instance) {
            this._instance = new SubscribeModel();
        }
        return this._instance;
    }
}
