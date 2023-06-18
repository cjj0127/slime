export default class CustomEventTarget {
    private _events: {
        [key: string]: Array<{
            callback: Function;
            target: any;
            priority: number;
        }>;
    } = {};
    static s_targetsInfo: {
        target: any;
        eventTargets: CustomEventTarget[];
    }[] = [];
    public emit(e: string, t: any = null, n: any = null, o: any = null, r: any = null, i: any = null): void {
        const a = this._events[e];
        if (a)
            for (let s = 0; s < a.length; s++) {
                const c = a[s];
                c.callback.call(c.target, t, n, o, r, i);
            }
    }
    static findTargetInfo(e: any): {
        target: any;
        eventTargets: CustomEventTarget[];
    } | undefined {
        for (let t = 0; t < this.s_targetsInfo.length; t++)
            if (this.s_targetsInfo[t].target == e)
                return this.s_targetsInfo[t];
        return undefined;
    }
    public off(e: string, t: Function, n: any): void {
        const o = this._events[e];
        if (o)
            for (let r = 0; r < o.length; r++) {
                const i = o[r];
                i.target == n && t == i.callback && (o.splice(r, 1), r--);
            }
    }
    public on(t: any, n: Function, o: any, r: number = 0): void {
        this._events[t] = this._events[t] || [];
        const i = this._events[t];
        i.push({ callback: n, target: o, priority: r });
        i.sort(function (e, t) {
            return e.priority - t.priority;
        });
        const a = CustomEventTarget.findTargetInfo(o);
        a ? -1 == a.eventTargets.indexOf(this) && a.eventTargets.push(this) : CustomEventTarget.s_targetsInfo.push({
            target: o,
            eventTargets: [this]
        });
    }
    public onMutil(t: string[], n: Function, o: any, r: number = 0): void {
        for (let i = 0; i < t.length; i++) {
            const a = t[i];
            this._events[a] = this._events[a] || [];
            const s = this._events[a];
            s.push({ callback: n, target: o, priority: r });
            s.sort(function (e, t) {
                return e.priority - t.priority;
            });
        }
        const c = CustomEventTarget.findTargetInfo(o);
        c ? -1 == c.eventTargets.indexOf(this) && c.eventTargets.push(this) : CustomEventTarget.s_targetsInfo.push({
            target: o,
            eventTargets: [this]
        });
    }
    static removeAllEventTargets() {
        for (let e = 0; e < this.s_targetsInfo.length; e++)
            for (let t = this.s_targetsInfo[e], n = 0; n < t.eventTargets.length; n++)
                t.eventTargets[n].targetOff(t.target);
        this.s_targetsInfo = [];
    }
    static removeTargetAllEventTargets(e: any): void {
        const t = this.findTargetInfo(e);
        if (t) {
            for (let n = 0; n < t.eventTargets.length; n++)
                t.eventTargets[n].targetOff(t.target);
            const o = this.s_targetsInfo.indexOf(t);
            this.s_targetsInfo.splice(o, 1);
        }
    }
    public targetOff(e: any): void {
        for (let t in this._events)
            for (let n = this._events[t], o = 0; o < n.length; o++)
                n[o].target == e && (n.splice(o, 1), o--);
    }
}
