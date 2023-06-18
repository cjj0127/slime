import { Reporter } from "./DummyReporter";
export class AggregatedReporter {
    private reporters: Reporter[] = [];
    public beginTimeEvent(event: string): void {
        for (const reporter of this.reporters) {
            reporter.beginTimeEvent(event);
        }
    }
    public incUserProperty(property: any): void {
        for (const reporter of this.reporters) {
            reporter.incUserProperty(property);
        }
    }
    public init(): void {
        for (const reporter of this.reporters) {
            reporter.init();
        }
    }
    public reportEvent(event: string, data: any): void {
        for (const reporter of this.reporters) {
            reporter.reportEvent(event, data);
        }
    }
    public setOnceUserProperty(property: any): void {
        for (const reporter of this.reporters) {
            reporter.setOnceUserProperty(property);
        }
    }
    public setReporters(reporters: Reporter[]): void {
        this.reporters = reporters;
    }
    public setUserProperty(property: any): void {
        for (const reporter of this.reporters) {
            reporter.setUserProperty(property);
        }
    }
}
