import _BaseParse from "./_BaseParse";
// var a = e("Singleton"),
// s = e("NumberPlus"),
// c = e("_BaseParse"),
// l = (e("_RelicConfig"), cc._decorator),
// u = l.ccclass,
// p = (l.property, globalThis._),
// f = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "relicCost",
//         t
//     }
//     var n;
//     return r(t, e),
//     n = t,
//     Object.defineProperty(t, "Instance", {
//         get: function() {
//             return a.Singleton.get(n)
//         },
//         enumerable: !1,
//         configurable: !0
//     }),
//     t.prototype.loaded = function() {
//         p.each(this.cfg,
//         function(e) {
//             e.cost = s.default.decode(e.cost)
//         })
//     },
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     n = i([u, a.Singleton], t)
// } (c.default);
// n.default = f
// import Singleton from "Singleton";
// import NumberPlus from "NumberPlus";
// import _BaseParse from "_BaseParse";
// import _RelicConfig from "_RelicConfig";
import NumberPlus from "../utils/NumberPlus";
const _: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class _RelicCostConfig extends _BaseParse {
    private static _instance: _RelicCostConfig = null;
    jsonName: string = "relicCost";
    get(e: any) {
        return this.cfg[e];
    }
    loaded() {
        _.each(this.cfg, (e: any) => {
            e.cost = NumberPlus.decode(e.cost);
        });
    }
    static get Instance() {
        if (!this._instance) {
            this._instance = new _RelicCostConfig();
        }
        return this._instance;
    }
}
