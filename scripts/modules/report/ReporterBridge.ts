import { TestReporter } from "./TestReporter";
import { DummyReporter } from "./DummyReporter";
import { AggregatedReporter } from "./AggregatedReporter";
import { ThinkingH5Reporter } from "../sdk/ThinkingH5Reporter";
import ChannelManager, { eChannelType } from "../common/ChannelManager";
export class ReporterBridge {
    static sReporter: AggregatedReporter | DummyReporter | null = null;
    static beginEventTime(event: any) {
        this.sReporter?.beginTimeEvent(event);
    }
    static incUserProperty(data: any) {
        this.sReporter?.incUserProperty(data);
    }
    static init() {
        if (this.sReporter == null) {
            const channelType = ChannelManager.getChannelType();
            cc.log("channelType is ", channelType);
            let reporter: AggregatedReporter;
            if (channelType == eChannelType.BYTEDANCE) {
                reporter = new AggregatedReporter();
                reporter.setReporters([new ThinkingH5Reporter()]);
                this.sReporter = reporter;
            }
            else if (channelType == eChannelType.WECHAT) {
                reporter = new AggregatedReporter();
                reporter.setReporters([new ThinkingH5Reporter()]);
                this.sReporter = reporter;
            }
            else if (channelType == eChannelType.Test) {
                reporter = new AggregatedReporter();
                reporter.setReporters([new ThinkingH5Reporter()]);
                this.sReporter = reporter;
            }
            else if (channelType == eChannelType.Dummy) {
                this.sReporter = new DummyReporter();
            }
            else if (channelType == eChannelType.ANDROID) {
                reporter = new AggregatedReporter();
                reporter.setReporters([new TestReporter()]);
                this.sReporter = reporter;
            }
        }
        this.sReporter && this.sReporter.init();
    }
    static reportEvent(event: any, params: any) {
        this.sReporter?.reportEvent(event, params);
    }
    static setOnceUserProperty(data: any) {
        this.sReporter?.setOnceUserProperty(data);
    }
    static setUserProperty(data: any) {
        this.sReporter?.setUserProperty(data);
    }
}
