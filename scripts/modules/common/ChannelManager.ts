export enum eChannelType {
    Test,
    Dummy,
    WECHAT,
    BYTEDANCE,
    ANDROID
}
;
export default class ChannelManager {
    static channelType: eChannelType = eChannelType.Test;
    static getChannelType() {
        return this.channelType;
    }
    static init() {
        const platform = cc.sys.platform;
        if (platform == cc.sys.WECHAT_GAME) {
            this.channelType = eChannelType.WECHAT;
        }
        else if (platform == cc.sys.BYTEDANCE_GAME) {
            this.channelType = eChannelType.BYTEDANCE;
        }
        else if (platform == cc.sys.ANDROID) {
            this.channelType = eChannelType.ANDROID;
        }
    }
}
