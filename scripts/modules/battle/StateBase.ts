const { ccclass, property } = cc._decorator;
@ccclass
export default class StateBase {
    __interval_callbacks: Array<{
        id: number;
        callback: Function;
        target: any;
        interval?: number;
        delay?: number;
        duration: number;
    }>;
    id: string | null;
    interval_id: number;
    clearInterval(e: number): void {
        const t = this.__interval_callbacks.findIndex(function (intervalCallback) {
            return intervalCallback.id == e;
        });
        if (t >= 0) {
            this.__interval_callbacks.splice(t, 1);
        }
    }
    clearIntervals(): void {
        this.__interval_callbacks.length = 0;
    }
    clearTimeout(e: number): void {
        this.clearInterval(e);
    }
    invokeIntervals(e: number): void {
        const t = [];
        this.__interval_callbacks.forEach(function (intervalCallback, index) {
            intervalCallback.duration = intervalCallback.duration + e;
            if (intervalCallback.interval) {
                if (intervalCallback.duration >= intervalCallback.interval) {
                    intervalCallback.duration = 0;
                    intervalCallback.callback.call(intervalCallback.target);
                }
            }
            else if (intervalCallback.delay) {
                if (intervalCallback.duration >= intervalCallback.delay) {
                    intervalCallback.callback.call(intervalCallback.target);
                    t.push(index);
                }
            }
        });
        if (t.length > 0) {
            this.__interval_callbacks.splice(t[0], t.length);
        }
    }
    setInterval(e: number, t: Function, n: any): number {
        const o = ++this.interval_id;
        this.__interval_callbacks.push({
            id: o,
            callback: t,
            target: n,
            interval: e,
            duration: 0
        });
        return o;
    }
    setTimeout(e: number, t: Function, n: any): number {
        const o = ++this.interval_id;
        this.__interval_callbacks.push({
            id: o,
            callback: t,
            target: n,
            delay: e,
            duration: 0
        });
        return o;
    }
    constructor(e: string) {
        this.id = null;
        this.__interval_callbacks = [];
        this.interval_id = 0;
        this.id = e;
    }
}
