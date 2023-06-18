import MyTools from "../../ccstudio/utils/MyTools";
export enum EVideoStatus {
    Success = 0,
    Fail = 1,
    Cancel = 2
}
export default class AdsManager {
    private static instance: AdsManager = new AdsManager();
    recentAdTime: Date;
    rewardAdCd: boolean;
    static getInstance() {
        return this.instance;
    }
    showRewardedVideo(e: any): any {
        if (e?.onSucceed)
            e.onSucceed();
        return 0;
    }
    constructor() {
        this.recentAdTime = new Date(MyTools.GetTimeNow());
        this.rewardAdCd = false;
    }
}
