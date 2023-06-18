import MyTools from "../../ccstudio/utils/MyTools";
export default class TrackingIOManager {
    public TKIO: any = null;
    private static _instance: TrackingIOManager | null = null;
    public startTime: number = -1;
    public watchNum: number = 0;
    public addWatchNum(): void {
        this.watchNum++;
        cc.sys.localStorage.setItem("by_hotCloudWatchNum", this.watchNum.toString());
    }
    public init(): void {
        this.TKIO = window['TrackingIO'];
        const storage = cc.sys.localStorage;
        const e = storage.getItem("by_hotCloudStartTime");
        if (e) {
            this.startTime = Number(e);
        }
        else {
            this.startTime = new Date().getTime();
            storage.setItem("by_hotCloudStartTime", this.startTime.toString());
        }
        const t = storage.getItem("by_hotCloudWatchNum");
        if (t) {
            this.watchNum = Number(t);
        }
        else {
            this.watchNum = 0;
            storage.setItem("by_hotCloudWatchNum", this.watchNum.toString());
        }
    }
    public static instance(): TrackingIOManager {
        if (!TrackingIOManager._instance) {
            TrackingIOManager._instance = new TrackingIOManager();
        }
        return TrackingIOManager._instance;
    }
    public reportEvent(): void {
        if (MyTools.GetTimeNow() <= this.startTime + 86400000) {
            let e = this.watchNum;
            if (e > 29) {
                e = 29;
            }
            const t = `event_${e}`;
            const n = {
                customParams_1: `RV${e}`,
            };
            this.TKIO.event(t, n);
        }
    }
    public reportNewPlayer(e: string): void {
        const t = {
            openId: e,
        };
        this.TKIO.event("event_30", t);
    }
    public reportRegister(e: string): void {
        this.TKIO.register(e, {});
    }
}
