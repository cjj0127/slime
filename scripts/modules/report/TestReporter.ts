export class TestReporter {
    public beginTimeEvent(): void { }
    public incUserProperty(): void { }
    public init(): void { }
    public reportEvent(e: string, t: any): void {
        JSON.stringify(t);
    }
    public setOnceUserProperty(): void { }
    public setUserProperty(): void { }
}
