// var e = require;
// var t = module;
// var n = exports;
// var o = this && this.__awaiter ||
// function(e, t, n, o) {
//     return new(n || (n = Promise))(function(r, i) {
//         function a(e) {
//             try {
//                 c(o.next(e))
//             } catch(t) {
//                 i(t)
//             }
//         }
//         function s(e) {
//             try {
//                 c(o.
//                 throw (e))
//             } catch(t) {
//                 i(t)
//             }
//         }
//         function c(e) {
//             var t;
//             e.done ? r(e.value) : (t = e.value, t instanceof n ? t: new n(function(e) {
//                 e(t)
//             })).then(a, s)
//         }
//         c((o = o.apply(e, t || [])).next())
//     })
// },
// r = this && this.__generator ||
// function(e, t) {
//     var n, o, r, i, a = {
//         label: 0,
//         sent: function() {
//             if (1 & r[0]) throw r[1];
//             return r[1]
//         },
//         trys: [],
//         ops: []
//     };
//     return i = {
//         next: s(0),
//         throw: s(1),
//         return: s(2)
//     },
//     "function" == typeof Symbol && (i[Symbol.iterator] = function() {
//         return this
//     }),
//     i;
//     function s(e) {
//         return function(t) {
//             return c([e, t])
//         }
//     }
//     function c(i) {
//         if (n) throw new TypeError("Generator is already executing.");
//         for (; a;) try {
//             if (n = 1, o && (r = 2 & i[0] ? o.
//             return: i[0] ? o.
//             throw || ((r = o.
//             return) && r.call(o), 0) : o.next) && !(r = r.call(o, i[1])).done) return r;
//             switch (o = 0, r && (i = [2 & i[0], r.value]), i[0]) {
//                 case 0:
//                 case 1:
//                     r = i;
//                 break;
//                 case 4:
//                     return a.label++,
//                 {
//                     value: i[1],
//                     done: !1
//                 };
//                 case 5:
//                     a.label++,
//                 o = i[1],
//                 i = [0];
//                 continue;
//                 case 7:
//                     i = a.ops.pop(),
//                 a.trys.pop();
//                 continue;
//                 default: if (! (r = (r = a.trys).length > 0 && r[r.length - 1]) && (6 == i[0] || 2 == i[0])) {
//                     a = 0;
//                     continue
//                 }
//                 if (3 == i[0] && (!r || i[1] > r[0] && i[1] < r[3])) {
//                     a.label = i[1];
//                     break
//                 }
//                 if (6 == i[0] && a.label < r[1]) {
//                     a.label = r[1],
//                     r = i;
//                     break
//                 }
//                 if (r && a.label < r[2]) {
//                     a.label = r[2],
//                     a.ops.push(i);
//                     break
//                 }
//                 r[2] && a.ops.pop(),
//                 a.trys.pop();
//                 continue;
//             }
//             i = t.call(e, a)
//         } catch(s) {
//             i = [6, s],
//             o = 0
//         } finally {
//             n = r = 0
//         }
//         if (5 & i[0]) throw i[1];
//         return {
//             value: i[0] ? i[1] : void 0,
//             done: !0
//         }
//     }
// };
// Object.defineProperty(n, "__esModule", {
//     value: !0
// }),
// n.AndroidSdkWrapper = n.AndroidAdWrapper = void 0;
// var i = e("AdsManager"),
// a = function() {
//     function e() {}
//     return e.prototype.init = function() {},
//     e.prototype.isVideoAvailable = function() {
//         return ! 0
//     },
//     e.prototype.isInterstitialAvailable = function() {
//         return ! 0
//     },
//     e.prototype.showVideo = function(e) {
//         var t = this;
//         return new Promise(function(n) {
//             return o(t, void 0, void 0,
//             function() {
//                 return r(this,
//                 function() {
//                     return e.onSucceed(),
//                     n(i.VideoStatus.Success),
//                     [2]
//                 })
//             })
//         })
//     },
//     e.prototype.showBanner = function() {},
//     e.prototype.showInterstitial = function() {},
//     e.prototype.hideBanner = function() {},
//     e
// } ();
// n.AndroidAdWrapper = a;
// var s = function() {
//     function e() {
//         this.adMgr = null
//     }
//     return e.prototype.share = function() {
//         throw new Error("Method not implemented.")
//     },
//     e.prototype.showRightUpShare = function() {
//         throw new Error("Method not implemented.")
//     },
//     e.prototype.getSupportedAPIs = function() {
//         throw new Error("Method not implemented.")
//     },
//     e.getInstance = function() {
//         return e.instance
//     },
//     e.prototype.init = function() {
//         this.adMgr = new a,
//         this.adMgr.init()
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
//     e.prototype.getPlayerId = function() {
//         return ""
//     },
//     e.prototype.getPlayerName = function() {
//         return ""
//     },
//     e.prototype.getPlayerPhotoUrl = function() {
//         return ""
//     },
//     e.prototype.getContextType = function() {
//         return ""
//     },
//     e.prototype.getContextId = function() {
//         return ""
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
//         cc.log("AndroidSdkWrapper.preloadVideo().")
//     },
//     e.prototype.preloadInterstitial = function() {
//         cc.log("AndroidSdkWrapper.preloadInterstitial().")
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
//         return "Android"
//     },
//     e.prototype.getIsNetConnect = function() {
//         return new Promise(function(e) {
//             e(cc.sys.getNetworkType() != cc.sys.NetworkType.NONE)
//         })
//     },
//     e.prototype.getGameInfo = function() {
//         return "android plateform"
//     },
//     e.prototype.showModel = function() {},
//     e.kCloudDataPrefix = "sim_cloud_",
//     e.instance = new e,
//     e
// } ();
// n.AndroidSdkWrapper = s
// class AndroidAdWrapper {
//     public init(): void {}
//     public isVideoAvailable(): boolean {
//         return true;
//     }
//     public isInterstitialAvailable(): boolean {
//         return true;
//     }
//     public async showVideo(e: any): Promise<i.VideoStatus> {
//         return new Promise((resolve) => {
//             (async () => {
//                 e.onSucceed();
//                 resolve(i.VideoStatus.Success);
//             })();
//         });
//     }
//     public showBanner(): void {}
//     public showInterstitial(): void {}
//     public hideBanner(): void {}
// }
// class FacebookSdkWrapper {
//     private adMgr: AndroidAdWrapper | null = null;
//     public static instance: FacebookSdkWrapper = new FacebookSdkWrapper();
//     public share(): void {
//         throw new Error("Method not implemented.")
//     }
//     public showRightUpShare(): void {
//         throw new Error("Method not implemented.")
//     }
//     public getSupportedAPIs(): void {
//         throw new Error("Method not implemented.")
//     }
//     public init(): void {
//         this.adMgr = new AndroidAdWrapper();
//         this.adMgr.init();
//     }
//     public getEntryPointData(): any {
//         return {
//             returnReward: {
//                 ts: 1110
//             },
//             referrer: 0x8b5c4aed95df
//         };
//     }
//     public async shareAsync(e: any): Promise<void> {
//         return new Promise((resolve) => {
//             cc.log("shareAsync(), payload=", e);
//             resolve();
//         });
//     }
//     public getPlayerId(): string {
//         return "";
//     }
//     public getPlayerName(): string {
//         return "";
//     }
//     public getPlayerPhotoUrl(): string {
//         return "";
//     }
//     public getContextType(): string {
//         return "";
//     }
//     public getContextId(): string {
//         return "";
//     }
//     public createContextAsync(): Promise<void> {
//         return new Promise((resolve) => {
//             resolve();
//         });
//     }
//     public chooseContextAsync(): Promise<void> {
//         return new Promise((resolve) => {
//             resolve();
//         });
//     }
//     public preloadVideo(): void {
//         cc.log("AndroidSdkWrapper.preloadVideo().");
//     }
//     public preloadInterstitial(): void {
//         cc.log("AndroidSdkWrapper.preloadInterstitial().");
//     }
//     public async showInterstitial(e: any): Promise<void> {
//         this.adMgr?.showInterstitial(e);
//     }
//     public isVideoAvailable(): boolean {
//         return !!this.adMgr?.isVideoAvailable();
//     }
//     public async showVideo(e: any): Promise<i.VideoStatus> {
//         return this.adMgr?.showVideo(e) || i.VideoStatus.Fail;
//     }
// }
// import AdsManager from "AdsManager";
// export class AndroidAdWrapper {
//   // implementation here
// }
// export class AndroidSdkWrapper {
//   // implementation here
// }
// export default {
//   AndroidAdWrapper,
//   AndroidSdkWrapper
// };
// // Note: The implementation of `o` and `r` functions cannot be directly converted to TypeScript or ES6 syntax as they are generator functions introduced in ES2015. They have a specific syntax and cannot be converted by simply replacing the `function` keyword with an arrow function. Therefore, you should keep these functions unchanged, even when refactoring the rest of the code to TypeScript or ES6."
// class e {
//     public isInterstitialAvailable(): boolean {
//         return this.adMgr.isInterstitialAvailable();
//     }
//     public async showBannerAsync(): Promise<void> {
//         await new Promise((resolve) => {
//             setTimeout(() => {
//                 resolve();
//             }, 500);
//         });
//     }
//     public hideBanner(): void {}
//     public async inviteAsync(): Promise<void> {
//         await new Promise((resolve) => {
//             setTimeout(() => {
//                 resolve();
//             }, 500);
//         });
//     }
//     public async postSessionScoreAsync(e: number): Promise<void> {
//         await new Promise((resolve) => {
//             setTimeout(() => {
//                 cc.log(`postSessionScoreAsync(${e}) done.`);
//                 resolve();
//             }, 500);
//         });
//     }
//     public playVibration(): void {
//         cc.log("playVibration");
//     }
//     public getPlatform(): string {
//         return "Android";
//     }
//     public async getIsNetConnect(): Promise<boolean> {
//         return cc.sys.getNetworkType() != cc.sys.NetworkType.NONE;
//     }
//     public getGameInfo(): string {
//         return "android plateform";
//     }
//     public showModel(): void {}
//     public static kCloudDataPrefix: string = "sim_cloud_";
//     public static instance: e = new e();
// }
// export const AndroidSdkWrapper = s;
