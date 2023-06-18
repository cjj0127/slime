export default class AsyncQueueTool {
    private static _$uuid_count: number = 1;
    private _enable: boolean = true;
    private _isProcessingTaskUUID: number = 0;
    private _queues: any[] = [];
    private _runningAsyncTask: any = null;
    public complete: Function = null;
    public clear(): void {
        this._queues = [];
        this._isProcessingTaskUUID = 0;
        this._runningAsyncTask = null;
    }
    public static excuteTimes(e: number, t?: Function): Function {
        var n = e;
        return function () {
            if (--n == 0 && t) {
                t();
            }
        };
    }
    public next(e: number, t: any = null): void {
        if (this._isProcessingTaskUUID == e) {
            this._isProcessingTaskUUID = 0;
            this._runningAsyncTask = null;
            this.play(t);
        }
        else if (this._runningAsyncTask) {
            cc.log(this._runningAsyncTask);
        }
    }
    public play(e: any = null): void {
        if (!this.isProcessing && this._enable) {
            const n = this._queues.shift();
            if (n) {
                this._runningAsyncTask = n;
                const o = n.uuid;
                this._isProcessingTaskUUID = o;
                const r = n.callbacks;
                if (r.length == 1) {
                    const i = (e: any = null) => {
                        this.next(o, e);
                    };
                    r[0](i, n.params, e);
                }
                else {
                    var a = r.length, s: any[] = [], c = (c = (e: any = null) => {
                        --a;
                        s.push(e || null);
                        if (a == 0) {
                            this.next(o, s);
                        }
                    },
                        a);
                    for (let l = 0; l < c; l++) {
                        r[l](c, n.params, e);
                    }
                }
            }
            else {
                this._isProcessingTaskUUID = 0;
                this._runningAsyncTask = null;
                this.complete && this.complete(e);
            }
        }
    }
    public push(t: Function, n: any = null): number {
        const o = AsyncQueueTool._$uuid_count++;
        this._queues.push({
            uuid: o,
            callbacks: [t],
            params: n
        });
        return o;
    }
    public pushMulti(t: any, ...n: Function[]): number {
        const r = AsyncQueueTool._$uuid_count++;
        this._queues.push({
            uuid: r,
            callbacks: n,
            params: t
        });
        return r;
    }
    public remove(e: number): void {
        if (this._runningAsyncTask?.uuid !== e) {
            for (let n = 0; n < this._queues.length; n++) {
                if (this._queues[n].uuid == e) {
                    this._queues.splice(n, 1);
                    break;
                }
            }
        }
        else {
            cc.warn("正在执行的任务不可以移除");
        }
    }
    public step(): void {
        if (this.isProcessing) {
            this.next(this._isProcessingTaskUUID);
        }
    }
    get enable(): boolean {
        return this._enable;
    }
    set enable(e: boolean) {
        if (this._enable !== e) {
            this._enable = e;
            if (e && this.size > 0) {
                this.play();
            }
        }
    }
    get isProcessing(): boolean {
        return this._isProcessingTaskUUID > 0;
    }
    get isStop(): boolean {
        return !(this._queues.length > 0 || this.isProcessing);
    }
    get queues(): any[] {
        return this._queues;
    }
    get runningParams(): any {
        return this._runningAsyncTask?.params || null;
    }
    public get size(): number {
        return this._queues.length;
    }
}
