import { TestSdkWrapper } from "../../modules/sdk/TestSdkWrapper";
import ChannelManager, { eChannelType } from "../../modules/common/ChannelManager";
import TrackingIOManager from "../../modules/battle/TrackingIOManager";
import WxAdManager from "../../modules/ads/WxAdManager";
import { EVideoStatus } from "../../modules/ads/AdsManager";
export class AdVideoOption {
}
export interface SupportAPI {
    switchGameAsync: string;
}
export class SdkBridge {
    static AdVideoOption: typeof AdVideoOption = AdVideoOption;
    static SupportAPI: SupportAPI = {
        switchGameAsync: "switchGameAsync",
    };
    static _channel: eChannelType = eChannelType.Test;
    static inited: boolean = false;
    static sdkName: string = "";
    static sdkWrapper: any = null;

    static getChannelType(): eChannelType {
        return this._channel;
    }
    static getGameInfo() {
        return this.sdkWrapper.getGameInfo();
    }
    static getIsNetConnect() {
        return this.sdkWrapper.getIsNetConnect();
    }
    static getPlatform() {
        return this.sdkWrapper.getPlatform();
    }
    static getPlayerId() {
        return this.sdkWrapper.getPlayerId();
    }
    static getPlayerName() {
        return this.sdkWrapper.getPlayerName();
    }
    static getPlayerPhotoUrl() {
        return this.sdkWrapper.getPlayerPhotoUrl();
    }

    static getSdkName(): string {
        return this.sdkName;
    }
    
    static getSupportedAPIs(): Array<string> {
        return this.sdkWrapper.getSupportedAPIs();
    }

    static hideBanner() {
        try {
            this.sdkWrapper.hideBanner();
        }
        catch (t) { }
    }

    static async initSdk(t: any): Promise<void> {
        if (!this.inited) {
            this.inited = true;
            try {
                const n: eChannelType = ChannelManager.getChannelType();
                let o = null;
                if (n == eChannelType.BYTEDANCE) {
                    // o = TtAdManager.getInstance();
                    this.sdkName = "tt";
                    this._channel = eChannelType.BYTEDANCE;
                }
                else if (n == eChannelType.WECHAT) {
                    o = WxAdManager.Instance();
                    this.sdkName = "wx";
                    this._channel = eChannelType.WECHAT;
                    TrackingIOManager.instance().init();
                }
                else if (n == eChannelType.Test) {
                    o = TestSdkWrapper.getInstance();
                    this.sdkName = "test";
                }
                else if (n == eChannelType.Dummy) {
                    // o = DummySdkWrapper.getInstance();
                    // this.sdkName = "dummy";
                }
                else if (n == eChannelType.ANDROID) {
                    // o = AndroidSdkWrapper.getInstance();
                    // this.sdkName = "android";
                }
                if (o) {
                    this.sdkWrapper = o;
                    this.sdkWrapper.init(t);
                }
            }
            catch (r) { }
        }
    }

    static isRewardVideoAvailable(): boolean {
        let t = false;
        try {
            t = this.sdkWrapper.isVideoAvailable();
        }
        catch (n) { }
        return t;
    }
    
    static isSupportAPI(e: string): boolean {
        return this.getSupportedAPIs().includes(e);
    }
    static playVibration() {
        return this.sdkWrapper.playVibration();
    }

    static preloadInterstitial() { }
    
    static preloadVideo() { }
    static share(t: any) {
        return this.sdkWrapper.share(t);
    }
    
    static shareAsync(t: any) {
        return this.sdkWrapper.shareAsync(t);
    }
    
    static showBannerAsync(t: any) {
        try {
            return this.sdkWrapper.showBannerAsync(t);
        }
        catch (n) { }
    }
   
    static showInterstitial(t: any) {
        try {
            this.sdkWrapper.showInterstitial(t);
        }
        catch (n) { }
    }
    static showModel(t: any) {
        return this.sdkWrapper.showModel(t);
    }
    static showRightUpShare() {
        return this.sdkWrapper.showRightUpShare();
    }
   
    static async showVideo(t: any) {
        try {
            const res = await this.sdkWrapper.showVideo(t);
            return res;
        }
        catch (n) {
            n && t && t.onFail && t.onFail();
            return EVideoStatus.Fail;
        }
    }
}
