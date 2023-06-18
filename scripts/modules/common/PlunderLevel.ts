import _BaseParse from "../../ccstudio/config/_BaseParse";
// import { _BaseParse } from '_BaseParse';
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class PlunderLevel extends _BaseParse {
    private static _instance: PlunderLevel = null;
    jsonName = "plunderLevel";
    get(e) {
        let result = null;
        _.each(this.cfg, (n) => {
            if (n.plunderLevel == e) {
                result = n;
            }
        });
        return result;
    }
    getAddRate(e) {
        let t = 0;
        _.each(this.cfg, (n) => {
            if (n.plunderLevel <= e) {
                t += n.plunderAdd;
            }
        });
        return t;
    }
    getLevelsReward(e) {
        const result = {
            ids: [],
            nums: []
        };
        for (let n = 0; n < e.length; n++) {
            const o = e[n];
            const r = this.get(o);
            if (r !== null) {
                result.ids = result.ids.concat(r.ids);
                result.nums = result.nums.concat(r.nums);
            }
        }
        return result;
    }
    getMaxLevel() {
        let e = 0;
        _.each(this.cfg, (t) => {
            if (t.plunderLevel > e) {
                e = t.plunderLevel;
            }
        });
        return e;
    }
    getNeedExp(e) {
        const t = this.getMaxLevel();
        if (e >= t) {
            e = t;
        }
        return this.get(e).needExp;
    }
    loaded() {
        _.each(this.cfg, (t) => {
            t.ids = [];
            t.nums = [];
            _.each(t.reward, (n) => {
                const o = this.convertStrToNumberArr(n, "|");
                t.ids.push(o[0]);
                t.nums.push(o[1]);
            });
            delete t.reward;
        });
    }
    public static get Instance() {
        return this._instance || (this._instance = new PlunderLevel());
    }
}
