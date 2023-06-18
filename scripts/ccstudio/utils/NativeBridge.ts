import { GlobalEventName } from "../../modules/common/Events";
import { E_QUEST_ACTIVE_ID } from "../../modules/common/Const";
import MsgBox from "../../modules/common/MsgBox";
let c = ["iPhone1,1", "iPhone1,2", "iPhone2,1", "iPhone3,1", "iPhone3,3", "iPhone4,1", "iPhone5,1", "iPhone5,2", "iPhone5,3", "iPhone5,4", "iPhone6,1", "iPhone6,2"];
let l = ["iPhone6", "iPhone7", "iPhone8"];
let u = ["iPhone9", "iPhone10"];
let p = ["iPhone11", "iPhone12", "iPhone13", "iPhone14", "iPhone15"];
export default class NativeBridge {
    private _adHandler?: (success: boolean) => void;
    private _deviceBenchmarkLevel: number | null = null;
    private static _instance: NativeBridge;
    private _purchaseHandler?: (success: boolean) => void;
    public checkIsLowPhone(): boolean {
        if (this._deviceBenchmarkLevel == null) {
            this._deviceBenchmarkLevel = this.getBenchmarkLevel();
        }
        return this._deviceBenchmarkLevel < 20;
    }
    public getBenchmarkLevel(): number {
        if (cc.sys.platform == cc.sys.WECHAT_GAME) {
            const systemInfo = window['wx'].getSystemInfoSync();
            if (cc.sys.os == cc.sys.OS_IOS) {
                const model = systemInfo.model;
                if (p.some(e => model.indexOf(e) >= 0)) {
                    return 30;
                }
                if (u.some(e => model.indexOf(e) >= 0)) {
                    return 20;
                }
                if (l.some(e => model.indexOf(e) >= 0)) {
                    return 10;
                }
                if (c.some(e => model.indexOf(e) >= 0)) {
                    return 5;
                }
                return -1;
            }
            return systemInfo.benchmarkLevel;
        }
        return 50;
    }
    public requestAd(): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            this._adHandler = resolve;
            const dialog = MsgBox.open("I am a simulated ad view!!");
            dialog.confirm(this.resposeAd.bind(this, true), "Watch Succ");
            dialog.cancel(this.resposeAd.bind(this, false), "Watch failed");
        });
    }
    public requestBuy(productName: string, price: number): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            this._purchaseHandler = resolve;
            const dialog = MsgBox.open(`Purchasing: ${productName} price:${price}`);
            dialog.confirm(this.resposeBuyResult.bind(this, true));
            dialog.cancel(this.resposeBuyResult.bind(this, false));
        });
    }
    public resposeAd(success: boolean): void {
        if (this._adHandler) {
            this._adHandler(success);
        }
        if (success) {
            cc.director.emit(GlobalEventName.QuestCommit, E_QUEST_ACTIVE_ID.WatchAds);
        }
    }
    public resposeBuyResult(success: boolean): void {
        if (this._purchaseHandler) {
            this._purchaseHandler(success);
        }
    }
    public static get Instance(): NativeBridge {
        if (!this._instance) {
            this._instance = new NativeBridge();
        }
        return this._instance;
    }
}
