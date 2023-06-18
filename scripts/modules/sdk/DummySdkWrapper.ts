// n.DummySdkWrapper = n.DummyAdWrapper = void 0;
// var i = e("AdsManager"),
// a = e("BasicSocialPlayer");
// function s(e) {
//     var t = e.getComponentInChildren(cc.Canvas);
//     return t ? t.node: null
// }
// var c = function() {
//     function e() {
//         this.higgsGaming = null
//     }
//     return e.prototype.init = function(e) {
//         cc.log("DummyAdWrapper.init()"),
//         this.higgsGaming = e
//     },
//     e.prototype.isVideoAvailable = function() {
//         return Math.random() < 0
//     },
//     e.prototype.isInterstitialAvailable = function() {
//         return Math.random() < 0
//     },
//     e.prototype.showVideo = function(e) {
//         var t = this;
//         return new Promise(function(n) {
//             return o(t, void 0, void 0,
//             function() {
//                 var t;
//                 return r(this,
//                 function() {
//                     return cc.log("DummyAdWrapper showVideo"),
//                     t = {
//                         type: "Rewarded",
//                         name: e.AdsType,
//                         onOpen: function() {
//                             e && e.onBegin && e.onBegin()
//                         },
//                         onSuccess: function() {
//                             e && e.onSucceed && (e.onSucceed(), n(i.VideoStatus.Success))
//                         },
//                         onFailed: function() {
//                             e && e.onFail && (e.onFail(), n(i.VideoStatus.Fail))
//                         }
//                     },
//                     this.higgsGaming && this.higgsGaming.showAds(t),
//                     [2]
//                 })
//             })
//         })
//     },
//     e.prototype.getBannerLayer = function() {
//         var t = s(cc.director.getScene());
//         if (t) return t.getChildByName(e.BANNER_NODE_NAME)
//     },
//     e.prototype.showBanner = function() {
//         cc.log("DummyAdWrapper showBanner")
//     },
//     e.prototype.showInterstitial = function(e) {
//         var t = {
//             type: "Interstitial",
//             name: e.OpenUi,
//             onOpen: function() {},
//             onSuccess: function() {
//                 e && e.closeCallback && e.closeCallback()
//             },
//             onFailed: function() {
//                 e && e.errCallback && e.errCallback()
//             }
//         };
//         this.higgsGaming && this.higgsGaming.showAds(t)
//     },
//     e.prototype.hideBanner = function() {
//         var e = this.getBannerLayer();
//         e && (e.active = !1)
//     },
//     e.BANNER_NODE_NAME = "test_ad_banner",
//     e.LAYER_ID = 1 << 25,
//     e
// } ();
// n.DummyAdWrapper = c;
// var l = function() {
//     function e() {
//         this.adMgr = null,
//         this.me = new a.BasicSocialPlayer,
//         this.connectedPlayers = [],
//         this.gameId = "1638263114",
//         this.higgsGaming = null
//     }
//     return e.getInstance = function() {
//         return e.instance
//     },
//     e.prototype.getHiggsGaming = function() {
//         return this.higgsGaming
//     },
//     e.prototype.init = function() {
//         this.adMgr = new c,
//         this.connectedPlayers.push(this.me),
//         this.higgsGaming = HiggsGaming.createHiggsInstance(this.gameId),
//         this.adMgr.init(this.higgsGaming),
//         this.initSocials()
//     },
//     e.prototype.initSocials = function() {
//         this.me.id = "dummy_me_123456",
//         this.me.name = "me_123",
//         this.me.photo = "1";
//         var e = new a.BasicSocialPlayer;
//         e.id = "dummy_albert_888",
//         e.name = "Albert",
//         e.photo = "2",
//         this.connectedPlayers = [e]
//     },
//     e.prototype.getSupportedAPIs = function() {
//         return ["switchGameAsync"]
//     },
//     e.prototype.getEntryPointData = function() {
//         return {
//             returnReward: {
//                 ts: 1110
//             },
//             referrer: 0x8b5c4aed95df
//         }
//     },
//     e.prototype.shareAsync = function(e) {
//         return new Promise(function(t) {
//             cc.log("shareAsync(), payload=", e),
//             t()
//         })
//     },
//     e.prototype.share = function() {},
//     e.prototype.getPlayerId = function() {
//         return this.me.getID()
//     },
//     e.prototype.getPlayerName = function() {
//         return this.me.getName()
//     },
//     e.prototype.getPlayerPhotoUrl = function() {
//         return this.me.getPhoto()
//     },
//     e.prototype.getContextType = function() {
//         return "CHALLENGE"
//     },
//     e.prototype.getContextId = function() {
//         return "context_test_987"
//     },
//     e.prototype.createContextAsync = function() {
//         return new Promise(function(e) {
//             e()
//         })
//     },
//     e.prototype.chooseContextAsync = function() {
//         return new Promise(function(e) {
//             e()
//         })
//     },
//     e.prototype.preloadVideo = function() {
//         cc.log("DummySdkWrapper.preloadVideo().")
//     },
//     e.prototype.preloadInterstitial = function() {
//         cc.log("DummySdkWrapper.preloadInterstitial().")
//     },
//     e.prototype.showVideo = function(e) {
//         return this.adMgr.showVideo(e)
//     },
//     e.prototype.isVideoAvailable = function() {
//         return this.adMgr.isVideoAvailable()
//     },
//     e.prototype.showInterstitial = function(e) {
//         this.adMgr.showInterstitial(e)
//     },
//     e.prototype.isInterstitialAvailable = function() {
//         return this.adMgr.isInterstitialAvailable()
//     },
//     e.prototype.showBannerAsync = function() {
//         return o(this, void 0, Promise,
//         function() {
//             return r(this,
//             function() {
//                 return [2]
//             })
//         })
//     },
//     e.prototype.hideBanner = function() {},
//     e.prototype.inviteAsync = function() {
//         return new Promise(function(e) {
//             setTimeout(function() {
//                 e()
//             },
//             500)
//         })
//     },
//     e.prototype.postSessionScoreAsync = function(e) {
//         return new Promise(function(t) {
//             setTimeout(function() {
//                 cc.log("postSessionScoreAsync(" + e + ") done."),
//                 t()
//             },
//             500)
//         })
//     },
//     e.prototype.playVibration = function() {
//         cc.log("playVibration")
//     },
//     e.prototype.getPlatform = function() {
//         return "WEB"
//     },
//     e.prototype.getIsNetConnect = function() {
//         return new Promise(function(e) {
//             setTimeout(function() {
//                 e(!0)
//             },
//             500)
//         })
//     },
//     e.prototype.showRightUpShare = function() {
//         cc.log("閿熸枻鎷烽敓杈冭鍑ゆ嫹閿熸枻鎷烽敓鏂ゆ嫹閿熸枻鎷烽敓缂寸櫢鎷�")
//     },
//     e.prototype.getGameInfo = function() {
//         return "plateForm is web, Development and debugging"
//     },
//     e.prototype.showModel = function() {},
//     e.kCloudDataPrefix = "sim_cloud_",
//     e.instance = new e,
//     e
// } ();
// n.DummySdkWrapper = l
// import { AdsManager } from "AdsManager";
// import { BasicSocialPlayer } from "BasicSocialPlayer";
// class DummyAdWrapper {}
// class DummySdkWrapper {}
// async function o(e, t, n, o) {
//     return new (n || (n = Promise))(function (r, i) {
//         function a(e: any) {
//             try { c(o.next(e)); } catch(t) { i(t); }
//         }
//         function s(e: any) {
//             try { c(o.throw(e)); } catch(t) { i(t); }
//         }
//         function c(e: any) {
//             var t;
//             if (e.done) { r(e.value); }
//             else {
//                 t = e.value;
//                 if (t instanceof n) { t; }
//                 else {
//                     new n(function(e) { e(t); }).then(a, s);
//                 }
//             }
//         }
//         c((o = o.apply(e, t || [])).next());
//     });
// }
// function* r(e: any, t: any) {
//     var n, o, r, i, a = {
//         label: 0,
//         sent: function() {
//             if (1 & r[0]) throw r[1];
//             return r[1];
//         },
//         trys: [],
//         ops: []
//     };
//     i = {
//         next: s(0),
//         throw: s(1),
//         return: s(2)
//     };
//     if (typeof Symbol == "function") {
//         i[Symbol.iterator] = function() { return this; };
//     }
//     return i;
//     function s(e: any) {
//         return function(t: any) {
//             return c([e, t]);
//         };
//     }
//     function c(i: any) {
//         if (n) throw new TypeError("Generator is already executing.");
//         for (; a;) {
//             try {
//                 if (n = 1, o && (r = 2 & i[0] ? o.return : i[0] ? o.throw || ((r = o.return) && r.call(o), 0) : o.next) && !(r = r.call(o, i[1])).done) return r;
//                 switch (o = 0, r && (i = [2 & i[0], r.value]), i[0]) {
//                     case 0:
//                     case 1:
//                         r = i;
//                         break;
//                     case 4:
//                         a.label++;
//                         return { value: i[1], done: false };
//                     case 5:
//                         a.label++;
//                         o = i[1];
//                         i = [0];
//                         continue;
//                     case 7:
//                         i = a.ops.pop();
//                         a.trys.pop();
//                         continue;
//                     default: 
//                         if (!((r = a.trys).length > 0 && r[r.length - 1]) && (6 == i[0] || 2 == i[0])) {
//                             a = 0;
//                             continue;
//                         }
//                         if (3 == i[0] && (!r || i[1] > r[0] && i[1] < r[3])) {
//                             a.label = i[1];
//                             break;
//                         }
//                         if (6 == i[0] && a.label < r[1]) {
//                             a.label = r[1];
//                             r = i;
//                             break;
//                         }
//                         if (r && a.label < r[2]) {
//                             a.label = r[2];
//                             a.ops.push(i);
//                             break;
//                         }
//                         r[2] && a.ops.pop();
//                         a.trys.pop();
//                         continue;
//                 }
//                 i = t.call(e, a);
//             } catch(s) {
//                 i = [6, s];
//                 o = 0;
//             } finally {
//                 n = r = 0;
//             }
//         }
//     }
// }
// function s(e: any) {
//     const t = e.getComponentInChildren(cc.Canvas);
//     return t ? t.node : null;
// }
// class c {
//     constructor() {
//         this.higgsGaming = null;
//     }
// }
// class E {
//     public getSupportedAPIs(): string[] {
//         return ["switchGameAsync"];
//     }
//     public getEntryPointData(): any {
//         return {
//             returnReward: {
//                 ts: 1110
//             },
//             referrer: 0x8b5c4aed95df
//         };
//     }
//     public shareAsync(e: any): Promise<any> {
//         return new Promise(function(t) {
//             cc.log("shareAsync(), payload=", e);
//             t();
//         });
//     }
//     public share() {}
//     public getPlayerId(): any {
//         return this.me.getID();
//     }
//     public getPlayerName(): any {
//         return this.me.getName();
//     }
//     public getPlayerPhotoUrl(): any {
//         return this.me.getPhoto();
//     }
//     public getContextType(): string {
//         return "CHALLENGE";
//     }
//     public getContextId(): string {
//         return "context_test_987";
//     }
//     public createContextAsync(): Promise<any> {
//         return new Promise(function(e) {
//             e();
//         });
//     }
//     public chooseContextAsync(): Promise<any> {
//         return new Promise(function(e) {
//             e();
//         });
//     }
//     public preloadVideo(): void {
//         cc.log("DummySdkWrapper.preloadVideo().");
//     }
//     public preloadInterstitial(): void {
//         cc.log("DummySdkWrapper.preloadInterstitial().");
//     }
//     public showVideo(e: any): any {
//         return this.adMgr.showVideo(e);
//     }
//     public isVideoAvailable(): boolean {
//         return this.adMgr.isVideoAvailable();
//     }
//     public showInterstitial(e: any): void {
//         this.adMgr.showInterstitial(e);
//     }
//     public isInterstitialAvailable(): boolean {
//         return this.adMgr.isInterstitialAvailable();
//     }
//     public showBannerAsync(): Promise<any> {
//         return new Promise(async function() {
//             return [2];
//         });
//     }
//     public hideBanner(): void {}
//     public inviteAsync(): Promise<any> {
//         return new Promise(function(e) {
//             setTimeout(function() {
//                 e();
//             },
//             500);
//         });
//     }
//     public postSessionScoreAsync(e: number): Promise<any> {
//         return new Promise(function(t) {
//             setTimeout(function() {
//                 cc.log(`postSessionScoreAsync(${e}) done.`);
//                 t();
//             },
//             500);
//         });
//     }
//     public playVibration(): void {
//         cc.log("playVibration");
//     }
//     public getPlatform(): string {
//         return "WEB";
//     }
//     public getIsNetConnect(): Promise<boolean> {
//         return new Promise(function(e) {
//             setTimeout(function() {
//                 e(true);
//             },
//             500);
//         });
//     }
// }
// class e {
//     public static kCloudDataPrefix: string = "sim_cloud_";
//     public static instance: e = new e();
//     public showRightUpShare(): void {
//         console.log("閸欏厖绗傜憴鎺戝瀻娴滎偅鍨氶崝锟�");
//     }
//     public getGameInfo(): string {
//         return "plateForm is web, Development and debugging";
//     }
//     public showModel(): void {}
// }
// class l {
//     constructor() {}
// }
// n.DummySdkWrapper = l;
// class DummyAdWrapper {
//     static BANNER_NODE_NAME = "test_ad_banner";
//     static LAYER_ID = 1 << 25;
//     private higgsGaming: any;
//     constructor() {
//         this.higgsGaming = null;
//     }
//     public init(e: any) {
//         cc.log("DummyAdWrapper.init()");
//         this.higgsGaming = e;
//     }
//     public isVideoAvailable(): boolean {
//         return Math.random() < 0;
//     }
//     public isInterstitialAvailable(): boolean {
//         return Math.random() < 0;
//     }
//     public showVideo(e: any): Promise<any> {
//         const t = this;
//         return new Promise(function(n) {
//             return (async () => {
//                 cc.log("DummyAdWrapper showVideo");
//                 const adConfig = {
//                     type: "Rewarded",
//                     name: e.AdsType,
//                     onOpen: function() {
//                         if (e && e.onBegin) {
//                             e.onBegin();
//                         }
//                     },
//                     onSuccess: function() {
//                         if (e && e.onSucceed) {
//                             e.onSucceed();
//                             n(i.VideoStatus.Success);
//                         }
//                     },
//                     onFailed: function() {
//                         if (e && e.onFail) {
//                             e.onFail();
//                             n(i.VideoStatus.Fail);
//                         }
//                     }
//                 };
//                 if (t.higgsGaming) {
//                     await t.higgsGaming.showAds(adConfig);
//                 }
//             })();
//         });
//     }
//     public getBannerLayer(): any {
//         const scene = s(cc.director.getScene());
//         if (scene) {
//             return scene.getChildByName(DummyAdWrapper.BANNER_NODE_NAME);
//         }
//     }
//     public showBanner(): void {
//         cc.log("DummyAdWrapper showBanner");
//     }
//     public showInterstitial(e: any): void {
//         const adConfig = {
//             type: "Interstitial",
//             name: e.OpenUi,
//             onOpen: function() {},
//             onSuccess: function() {
//                 if (e && e.closeCallback) {
//                     e.closeCallback();
//                 }
//             },
//             onFailed: function() {
//                 if (e && e.errCallback) {
//                     e.errCallback();
//                 }
//             }
//         };
//         if (this.higgsGaming) {
//             this.higgsGaming.showAds(adConfig);
//         }
//     }
//     public hideBanner(): void {
//         const bannerLayer = this.getBannerLayer();
//         if (bannerLayer) {
//             bannerLayer.active = false;
//         }
//     }
// }
// class MyClass {
//     private adMgr: any;
//     private me: any;
//     private connectedPlayers: any[];
//     private gameId: string;
//     private higgsGaming: any;
//     constructor() {
//         this.adMgr = null;
//         this.me = new a.BasicSocialPlayer();
//         this.connectedPlayers = [];
//         this.gameId = "1638263114";
//         this.higgsGaming = null;
//     }
//     public static instance = new MyClass();
//     public static getInstance(): MyClass {
//         return MyClass.instance;
//     }
//     public getHiggsGaming() {
//         return this.higgsGaming;
//     }
//     public init() {
//         this.adMgr = new DummyAdWrapper();
//         this.connectedPlayers.push(this.me);
//         this.higgsGaming = HiggsGaming.createHiggsInstance(this.gameId);
//         this.adMgr.init(this.higgsGaming);
//         this.initSocials();
//     }
//     private initSocials() {
//         this.me.id = "dummy_me_123456";
//         this.me.name = "me_123";
//         this.me.photo = "1";
//         const e = new a.BasicSocialPlayer();
//         e.id = "dummy_albert_888";
//         e.name = "Albert";
//         e.photo = "2";
//         this.connectedPlayers = [e];
//     }
// }
// n.DummyAdWrapper = DummyAdWrapper;
