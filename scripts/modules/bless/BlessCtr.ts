import Bless from "./Bless";
import BlessData from "./BlessData";
import { GlobalEventName } from "../common/Events";
const _: any = window["_"];
export default class BlessCtr {
    private blesss: {
        [key: string]: Bless;
    } = {};
    private pool: Bless[] = [];
    public addBless(key: any, t: any, n: number) {
        const bless = this.get();
        bless.initialize(t, n);
        this.blesss[key] = bless;
        return bless;
    }
    // protected onEnable() {
    //     this.schedule(this.timeUpdate, 1, cc.macro.REPEAT_FOREVER);
    // }
    // protected onDisable() {
    //     this.unschedule(this.timeUpdate);
    // }
    fixedUpdate() {
        //         p.each(this.blesss,
        //         function(e, t) {
        //             var n = parseInt(t);
        //             0 == BlessData.Instance.getRemainTime(n) && (e.setDisable(), cc.director.emit(GlobalEvent.BlessTakeEffect, n))
        //         })
        _.each(this.blesss, (e, t) => {
            let n = parseInt(t);
            0 == BlessData.Instance.getRemainTime(n) && (e.setDisable(), cc.director.emit(GlobalEventName.BlessTakeEffect, n));
        });
    }
    public get(): Bless {
        return this.pool.length > 0 ? this.pool.pop() : new Bless();
    }
    public getBless(key: any): Bless {
        return this.blesss[key];
    }
    public put(e: Bless) {
        this.pool.push(e);
    }
}
