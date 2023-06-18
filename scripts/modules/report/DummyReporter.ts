export class DummyReporter {
    private higgsGaming: any = null;
    public beginTimeEvent(e): void { }
    public incUserProperty(e): void { }
    public init(): void {
        // this.higgsGaming = DummySdkWrapper.getInstance().getHiggsGaming();
    }
    public reportEvent(name: string, props: object): void {
        console.log(props);
        const eventLogObj = {
            name: name,
            onFailed: function () {
                console.log("eventLog onFailed ==>");
            },
            onSuccess: function () {
                console.log("eventLog success ==>");
            },
            props: props
        };
        this.higgsGaming && this.higgsGaming.eventLog(eventLogObj);
    }
    public setOnceUserProperty(e): void { }
    public setUserProperty(e): void { }
}
