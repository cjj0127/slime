import AdsManager from "../ads/AdsManager";
import BasicSocialPlayer from "../common/BasicSocialPlayer";
import LocalStorageTool from "../../ccstudio/utils/LocalStorage";
// async function o(e: any, t: any, n?: any, o?: any) {
//     return new (n || (Promise))(function(r: any, i: any) {
//         function a(e: any) {
//             try {
//                 c(o.next(e));
//             } catch(t) {
//                 i(t);
//             }
//         }
//         function s(e: any) {
//             try {
//                 c(o.throw(e));
//             } catch(t) {
//                 i(t);
//             }
//         }
//         function c(e: any) {
//             let t;
//             if (e.done) {
//                 r(e.value);
//             } else {
//                 t = e.value;
//                 if (t instanceof n) {
//                     t.then(a, s);
//                 } else {
//                     new n(function(e) {
//                         e(t);
//                     }).then(a, s);
//                 }
//             }
//         }
//         c((o = o.apply(e, t || [])).next());
//     });
// }
// function* r(e: any, t: any) {
//     var n: any, o: any, r: any, i: any, a = {
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
//         i[Symbol.iterator] = function() {
//             return this;
//         };
//     }
//     return i;
//     function s(e: any) {
//         return function(t: any) {
//             return c([e, t]);
//         };
//     }
//     function c(i: any) {
//         if (n) throw new TypeError("Generator is already executing.");
//         for (; a;) try {
//             if (n = 1, o && (r = 2 & i[0] ? o.return : i[0] ? o.throw || ((r = o.return) && r.call(o), 0) : o.next) && !(r = r.call(o, i[1])).done) return r;
//             switch (o = 0, r && (i = [2 & i[0], r.value]), i[0]) {
//                 case 0:
//                 case 1:
//                     r = i;
//                     break;
//                 case 4:
//                     return a.label++, { value: i[1], done: !1 };
//                 case 5:
//                     a.label++, o = i[1], i = [0];
//                     continue;
//                 case 7:
//                     i = a.ops.pop(), a.trys.pop();
//                     continue;
//                 default:
//                     if (! (r = (r = a.trys).length > 0 && r[r.length - 1]) && (6 == i[0] || 2 == i[0])) {
//                         a = 0;
//                         continue;
//                     }
//                     if (3 == i[0] && (!r || i[1] > r[0] && i[1] < r[3])) {
//                         a.label = i[1];
//                         break;
//                     }
//                     if (6 == i[0] && a.label < r[1]) {
//                         a.label = r[1], r = i;
//                         break;
//                     }
//                     if (r && a.label < r[2]) {
//                         a.label = r[2], a.ops.push(i);
//                         break;
//                     }
//                     r[2] && a.ops.pop(), a.trys.pop();
//                     continue;
//             }
//             i = t.call(e, a);
//         } catch(s) {
//             i = [6, s], o = 0;
//         } finally {
//             n = r = 0;
//         }
//         if (5 & i[0]) throw i[1];
//         return { value: i[0] ? i[1] : void 0, done: !0 };
//     }
// }
export class TestAdWrapper {
    _adsManager: AdsManager;
    init(e) { }
    constructor() {
        this._adsManager = new AdsManager();
    }
}
export class TestSdkWrapper {
    private static BANNER_NODE_NAME: string = "test_ad_banner";
    private static LAYER_ID: number = 1 << 25;
    private _socialPlayer: BasicSocialPlayer;
    private adMgr: TestAdWrapper | null = null;
    private connectedPlayers: any[] = [];
    private static instance: TestSdkWrapper = null;
    public static kCloudDataPrefix: string = "sim_cloud_";
    private me: BasicSocialPlayer = new BasicSocialPlayer();
    private _getCanvasNode(node: any): any {
        const canvas = node.getComponentInChildren(cc.Canvas);
        return canvas ? canvas.node : null;
    }
    private getBannerLayer(): any {
        // const t: cc.Node = s(cc.director.getScene());
        // if (t) { return t.getChildByName(TestAdWrapper.BANNER_NODE_NAME); }
    }
    public getEntryPointData(): any {
        return {
            returnReward: { ts: 1110 },
            referrer: 0x8b5c4aed95df
        };
    }
    public getGameInfo(): string {
        return "plateForm is web, Development and debugging";
    }
    public static getInstance(): TestSdkWrapper {
        return TestSdkWrapper.instance;
    }
    public getIsNetConnect(): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            resolve(true);
        });
    }
    public getPlatform(): string {
        return "WEB";
    }
    public getPlayerId(): any {
        return this.me.getID();
    }
    public getPlayerName(): any {
        return this.me.getName();
    }
    public getPlayerPhotoUrl(): any {
        return this.me.getPhoto();
    }
    public getSupportedAPIs(): string[] {
        return ["switchGameAsync"];
    }
    public hideBanner(): void {
        const bannerLayer: any = this.getBannerLayer();
        if (bannerLayer) {
            bannerLayer.active = false;
        }
    }
    public init(e: any): void {
        this.adMgr = new TestAdWrapper();
        this.adMgr.init(e);
    }
    public inviteAsync(): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, 500);
        });
    }
    public isInterstitialAvailable(): boolean {
        return Math.random() < .95;
    }
    public isVideoAvailable(): boolean {
        return Math.random() < .9;
    }
    public playVibration() { }
    public preloadInterstitial(): void { }
    public preloadVideo(): void { }
    public share(): void { }
    public shareAsync(): Promise<void> {
        return new Promise<void>((resolve: any) => {
            resolve();
        });
    }
    public showBanner(): void {
        const bannerLayer: any = this.getBannerLayer();
        if (bannerLayer) {
            bannerLayer.active = true;
        }
    }
    public async showBannerAsync(): Promise<void> {
        return new Promise<void>((resolve: any) => {
            resolve();
        });
    }
    public showInterstitial(e: any): void {
        if (e && e.showCallback) {
            e.showCallback();
        }
        if (e && e.closeCallback) {
            e.closeCallback();
        }
    }
    public showModel() { }
    public showRightUpShare() {
    }
    public async showVideo(e: any): Promise<void> {
        return new Promise<void>((resolve: any) => {
            if (Math.random() < .1) {
                if (e && e.onFail) {
                    e.onFail();
                }
                resolve(LocalStorageTool.VideoStatus.Fail);
            }
            else {
                if (e && e.onBegin) {
                    e.onBegin();
                }
                if (e && e.onSucceed) {
                    e.onSucceed();
                }
                resolve(LocalStorageTool.VideoStatus.Success);
            }
        });
    }
    constructor(player: BasicSocialPlayer) {
        this._socialPlayer = player;
    }
}
