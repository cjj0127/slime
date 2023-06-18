import { EVideoStatus } from "./AdsManager";
import { GlobalEventName } from "../common/Events";
import BattleWorld from "../battle/BattleWorld";
export default class WxAdWrapper {
    private adMgr: adMgr;
    private static instance: WxAdWrapper = null;

    public static Instance(): WxAdWrapper {
        if (this.instance == null) {
            this.instance = new WxAdWrapper();
        }
        return this.instance;
    }


    public getEntryPointData(): void { }

    public getGameInfo(): any {
        return this.adMgr.getGameInfo();
    }

    public getIsNetConnect(): boolean {
        return this.adMgr.getIsNetConnect();
    }

    public getPlatform(): void { }

    public getPlayerId(): string {
        return "";
    }

    public getPlayerName(): string {
        return "";
    }

    public getPlayerPhotoUrl(): string {
        return "";
    }

    public getSubscribePermissions(e: any) {
        // return new Promise(function (resolve, reject) {
        //     window['wx'].requestSubscribeMessage({
        //         tmplIds: e,
        //         success: function (res) {
        //             console.log("Subscribe Success: ", res);
        //             if ("requestSubscribeMessage:ok" == res.errMsg) {
        //                 l.scrMgr.sendSubscribeMsg(res);
        //                 resolve(res);
        //             } else {
        //                 l.scrMgr.sendSubscribeMsg(res);
        //                 reject(res);
        //             }
        //         },
        //         fail: function (res) {
        //             console.log("Subscribe Fail: ", res);
        //             reject(res);
        //         }
        //     });
        // });
    }


    public getSupportedAPIs(): any[] {
        return [];
    }


    public hideBanner(): void {
        this.adMgr.hideBanner();
    }


    public init(e: any): void {
        this.adMgr = new adMgr();
        this.adMgr.init(e);
        this.adMgr.setGameInfo();
    }


    public isInterstitialAvailable(): boolean {
        return true;
    }


    public isVideoAvailable(): boolean {
        return true;
    }

    public playVibration(): void { }


    public preloadInterstitial(): void { }


    public preloadVideo(): void { }

    public share(e: any): void {
        this.adMgr.onShareFunc(e.failCallback, e.successCallback);
    }


    public shareAsync(e: any): Promise<void> {
        return new Promise(function (resolve) {
            cc.log("shareAsync(), payload=", e);
            resolve();
        });
    }


    public showBannerAsync(e: any): Promise<void> {
        const t = this;
        return new Promise(function (resolve) {
            cc.log("showBannerAsync()");
            resolve();
            t.adMgr.showBanner(e);
        });
    }


    public showInterstitial(e: any): any {
        return this.adMgr.showInterstitial(e);
    }

    public showModel(e: any): void {
        this.adMgr.showModel(e);
    }


    public showVideo(e: any): any {
        return this.adMgr.showVideo(e);
    }
}
const wx = window['wx'];
class adMgr {
    static BANNER_NODE_NAME = "test_ad_banner";
    private __bannerExpires: number = 30;
    private __showBanner: boolean = false;
    private __showCallback: any = null;
    private __showInterstital: boolean = false;
    private bannerAd: any = null;
    private bannerAdId: string = "adunit-";
    private insertAdId: string = "adunit-";
    private interstitalCloseCallback: any = null;
    private interstitalErrorCallback: any = null;
    private interstitalShowCallback: any = null;
    private interstitialAd: any = null;
    private isLoading: boolean = false;
    private isReportReyun: boolean = false;
    static isReportReyun: any;
    private lastShowBannerTime: number = 0;
    private localGameInfo: any = null;
    private option: any = null;
    private rewardAdId: string = "adunit-";
    private shareImageId: string[] = []// ["gPbNjmczTQaSBfrR3SYsBg==", "FrjMjy5xQNSbJYkljf8QCA==", "O7ruhIWCT8qABaeA8lhGlA=="];
    private shareImageUrl: string[] = []// ["https://mmocgame.qpic.cn/wechatgame/3S0EBafeOF0hEyFgYkQNgAtib2G2t8bP4TktibU2PBx0GibmxuC13ibw4YG6FWphCHHc/0", "https://mmocgame.qpic.cn/wechatgame/3S0EBafeOF37yLibLJTic7sK8Hb45rsp4O7ibMj5xqfGhpATaDWrssqtibZBZ4gzEGk1/0", "https://mmocgame.qpic.cn/wechatgame/3S0EBafeOF0m6RexM6RtJO8icpoDkLaiaM4RrmBc98wLROFsMibatF40Fxbl8jNcUTk/0"];
    private videoAd: any = null;
    private videoCancelCallback: any = null;
    private videoErrorCallback: any = null;
    private videoShowCallback: any = null;
    private videoSuccessCallback: any = null;

    private _loadBannerComplete() {
        setTimeout(() => {
            if (!this.__showBanner) {
                this.bannerAd?.hide();
            }
        }, 2000);
    }

    public getGameInfo() {
        if (this.localGameInfo && this.localGameInfo.appid) {
            return this.localGameInfo.appid;
        }
        const miniProgramInfo = wx.getAccountInfoSync().miniProgram;
        return miniProgramInfo && miniProgramInfo.appId
            ? (this.localGameInfo = { appid: miniProgramInfo.appId }, miniProgramInfo.appId)
            : "get appid fail: unknow";
    }

    public getIsNetConnect(): boolean {
        return false;
    }

    public static getIsNetConnect() {
        return new Promise((resolve) => {
            wx.getNetworkType({
                success(t: any) {
                    cc.log("getNetwork Succ: ", t);
                    resolve(t.networkType !== "none");
                },
                fail(t: any) {
                    cc.warn("getNetwork Fail: ", t);
                    resolve(false);
                }
            });
        });
    }

    public hideBanner() {
        this.__showBanner = false;
        this.bannerAd?.hide();
    }

    init(e): void {
        console.log("AdManager.init()");
        // this.initAd();
        // this.loadVideo();
    }

    private initAd() {
        this.interstitialAd = wx.createInterstitialAd({
            adUnitId: this.insertAdId,
        });
        this.interstitialAd.onClose(() => {
            this.__showInterstital = false;
            if (this.interstitalCloseCallback)
                this.interstitalCloseCallback();
            this.interstitialAd?.load();
        });
        this.interstitialAd.load();
        this.interstitialAd.onError(() => {
            this.__showInterstital = false;
            if (this.interstitalErrorCallback)
                this.interstitalErrorCallback();
            this.interstitialAd?.offClose();
            this.interstitialAd?.offError();
            this.interstitialAd?.destroy();
            this.interstitialAd = null;
        });
    }

    isInterstitialAvailable(): boolean {
        return true;
    }

    isVideoAvailable(): boolean {
        return true;
    }

    public loadBanner() {
        return
        this.lastShowBannerTime = Date.now();
        const { windowWidth: n, windowHeight: o } = wx.getSystemInfoSync();
        this.bannerAd = wx.createBannerAd({
            adUnitId: this.bannerAdId,
            adIntervals: 30,
            style: {
                left: (n - 300) / 2,
                top: o - 80,
                width: 300,
            }
        });
        this.bannerAd.onResize(() => {
            if (this.bannerAd) {
                this.bannerAd.style.top = o - this.bannerAd.style.realHeight - 1;
            }
        });
        this.bannerAd.onLoad(() => {
            this._loadBannerComplete();
        });
        this.bannerAd.onError(() => {
            this.bannerAd?.hide();
            this.lastShowBannerTime = 0;
        });
    }

    async loadVideo(): Promise<void> {
        return
        this.videoAd = wx.createRewardedVideoAd({
            adUnitId: this.rewardAdId,
            multiton: true
        });
        this.videoAd.onClose((res) => {
            if (res && res.isEnded) {
                this.videoSuccessCallback && this.videoSuccessCallback();
            }
            else {
                this.videoCancelCallback && this.videoCancelCallback();
            }
            this.videoAd.load();
        });
        this.videoAd.onError(() => {
            this.videoAd.offClose();
            this.videoAd.offLoad();
            this.videoAd.offError();
            this.videoAd.destroy();
            this.videoAd = null;
            setTimeout(() => {
                this.videoErrorCallback && this.videoErrorCallback();
                wx.hideLoading();
            }, 2000);
        });
        await this.videoAd.load();
    }

    onShareFunc(e: any, t: any): void {
        const n = Math.floor(Math.random() * this.shareImageId.length);
        wx.shareAppMessage({
            imageUrlId: this.shareImageId[n],
            imageUrl: this.shareImageUrl[n],
            success: function () { },
            fail: function () { }
        });
        setTimeout(() => {
            t && t();
        }, 1000);
    }

    private reportReyunRegister() { }

    public static reportReyunRegister() {
        // if (!this.isReportReyun) {
        //     if (cc.sys.localStorage.getItem("reyun_register")) {
        //         this.isReportReyun = true;
        //     } else {
        //         const userOpenId = cc.sys.localStorage.getItem("userOpenId");
        //         if (userOpenId) {
        //             TrackingIOMgr.reportRegister(userOpenId);
        //         } else {
        //             const uuid = "UUID_" + MyTools.GenerateUUID(30);
        //             TrackingIOMgr.reportRegister(uuid);
        //         }
        //         cc.sys.localStorage.setItem("reyun_register", true);
        //     }
        // }
    }

    public setGameInfo() {
        const miniProgramInfo = wx.getAccountInfoSync().miniProgram;
        if (miniProgramInfo && miniProgramInfo.appId) {
            this.localGameInfo = {
                appid: miniProgramInfo.appId
            };
        }
    }

    public showBanner(callback: {
        showCallback?: Function;
    } = {}) {
        return
        this.__showBanner = true;
        this.__showCallback = callback.showCallback || null;
        if (this.bannerAd) {
            if (Date.now() - this.lastShowBannerTime < 1000 * this.__bannerExpires) {
                return void this.bannerAd.show().then(() => {
                    this.reportReyunRegister();
                    if (this.__showCallback)
                        this.__showCallback();
                    this._loadBannerComplete();
                });
            }
            this.bannerAd.destroy();
        }
        this.loadBanner();
        this.bannerAd?.show().then(() => {
            this.reportReyunRegister();
            if (this.__showCallback)
                this.__showCallback();
            this._loadBannerComplete();
        });
    }

    public showInterstitial(callback: {
        showCallback?: Function;
        closeCallback?: Function;
        errCallback?: Function;
    } = {}) {
        return
        if (this.__showInterstital) {
            cc.error("正在展示插屏");
        }
        else {
            this.__showInterstital = true;
            this.interstitalShowCallback = callback.showCallback || null;
            this.interstitalCloseCallback = callback.closeCallback || null;
            this.interstitalErrorCallback = callback.errCallback || null;
            const showInterstitialAd = () => {
                if (this.interstitialAd) {
                    this.interstitialAd.show().then(() => {
                        this.reportReyunRegister();
                        if (this.interstitalShowCallback)
                            this.interstitalShowCallback();
                    })
                        .catch(() => {
                            this.__showInterstital = false;
                            if (this.interstitalErrorCallback)
                                this.interstitalErrorCallback();
                        });
                }
            };
            if (this.interstitialAd) {
                showInterstitialAd();
            }
            else {
                this.initAd();
                const onLoad = () => {
                    this.interstitialAd?.offLoad(onLoad);
                    showInterstitialAd();
                };
                this.interstitialAd.onLoad(onLoad);
            }
        }
    }

    public showModel(options: any) {
        wx.showModal({
            title: options.title,
            content: options.contentText,
            confirmText: options.confirmText,
            showCancel: options.showCancel,
            cancelText: options.cancelText || "取消",
            success: options.success,
            fail(t: any) {
                options.fail && options.fail();
                cc.error("show Model fail: ", t);
            }
        });
    }

    public showRightUpShare() {
        try {
            wx.showShareMenu({
                withShareTicket: true,
                menus: ["shareAppMessage", "shareTimeline"],
                success() { },
                fail() { },
                complete() { }
            });
            const shareContent = [""];
            const randomContentIndex = Math.floor(Math.random() * shareContent.length);
            const randomImageIndex = Math.floor(Math.random() * this.shareImageId.length);
            wx.onShareAppMessage(function () {
                return {
                    title: shareContent[randomContentIndex],
                    imageUrlId: this.shareImageId[randomImageIndex],
                    imageUrl: this.shareImageUrl[randomImageIndex],
                    success() {
                        cc.log("右上角分享成功");
                    },
                    fail() {
                        cc.log("右上角分享未完成");
                    }
                };
            });
        }
        catch (error) {
            cc.log("右上角分享开启失败，可能不是h5");
        }
    }

    async showVideo(e: {
        onBegin?: () => void;
        onSucceed?: () => void;
        onCancel?: () => void;
        onFail?: () => void;
    }): Promise<EVideoStatus> {
        if (this.isLoading) {
            return null;
        }
        this.isLoading = true;
        return new Promise(async (resolve) => {
            this.videoShowCallback = () => {
                wx.hideLoading();
                e.onBegin && e.onBegin();
            };
            this.videoSuccessCallback = () => {
                this.isLoading = false;
                cc.director.emit(GlobalEventName.ShowMask, false);
                BattleWorld.Instance.resume();
                e.onSucceed && e.onSucceed();
                resolve(EVideoStatus.Success);
            };
            this.videoCancelCallback = () => {
                this.isLoading = false;
                cc.director.emit(GlobalEventName.ShowMask, false);
                BattleWorld.Instance.resume();
                e.onCancel && e.onCancel();
                resolve(EVideoStatus.Cancel);
            };
            this.videoErrorCallback = () => {
                this.isLoading = false;
                cc.director.emit(GlobalEventName.ShowMask, false);
                BattleWorld.Instance.resume();
                e.onFail && e.onFail();
                resolve(EVideoStatus.Fail);
            };
            cc.director.emit(GlobalEventName.ShowMask, true);
            BattleWorld.Instance.pause();
            wx.showLoading({
                title: "广告加载中..."
            });
            this.isLoading = true;
            if (!this.videoAd) {
                await this.loadVideo();
            }
            try {
                await this.videoAd.show();
                this.reportReyunRegister();
                this.videoShowCallback && this.videoShowCallback();
            }
            catch (error) {
                try {
                    await this.videoAd.load();
                    await this.videoAd.show();
                    this.videoShowCallback && this.videoShowCallback();
                }
                catch (error) {
                    wx.showLoading({
                        title: "广告未就绪，请稍后重试！"
                    });
                }
            }
            resolve(null);
        });
    }
}
