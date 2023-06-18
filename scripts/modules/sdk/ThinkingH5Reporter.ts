export class ThinkingH5Reporter {
    public beginTimeEvent(eventName: string): void {
        // if (this.ta) {
        //   this.ta.timeEvent(eventName);
        // }
    }
    public incUserProperty(userProps: object): void {
        // if (this.ta) {
        //   this.ta.userAdd(userProps);
        // }
    }
    // private ta: ThinkingAnalyticsAPI | null = null;
    public init(): void {
        // const instance = new ThinkingAnalyticsAPI({
        //   appId: "bb2cf89074004128a3982c1be3079393",
        //   serverUrl: "https://rtsyx.higgsyx.com",
        //   send_method: "ajax",
        //   showLog: true,
        //   autoTrack: {
        //     appShow: true,
        //     appHide: true,
        //   },
        // });
        // window.ta = instance;
        // this.ta = instance;
        // instance.setSuperProperties({
        //   wxproject: "bz",
        // });
        // instance.userSetOnce({
        //   channel: "bz_wx",
        // });
        // instance.init();
    }
    public reportEvent(eventName: string, eventProps?: object): void {
        // if (this.ta) {
        //   this.ta.track(eventName, eventProps);
        // }
    }
    public setOnceUserProperty(userProps: object): void {
        // if (this.ta) {
        //   this.ta.userSetOnce(userProps);
        // }
    }
    public setUserProperty(userProps: object): void {
        // if (this.ta) {
        //   this.ta.userSet(userProps);
        // }
    }
}
