import _BaseParse from "./_BaseParse";
// var a = e("Singleton"),
// s = e("NumberPlus"),
// c = e("_BaseParse"),
// l = cc._decorator,
// u = l.ccclass,
// p = (l.property, globalThis._),
// f = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "relicLevel",
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
//             p.each(e,
//             function(e) {
//                 e.cost = s.default.decode(e.cost)
//             })
//         })
//     },
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     t.prototype.getCost = function(e, t) {
//         return this.get(e)[t].cost
//     },
//     n = i([u, a.Singleton], t)
// } (c.default);
// n.default = f
// import Singleton from "Singleton";
// import NumberPlus from "NumberPlus";
import NumberPlus from "../utils/NumberPlus";
const _: any = window["_"];
// import _BaseParse from "_BaseParse";
const { ccclass, property } = cc._decorator;
@ccclass
export default class _RelicLevelConfig extends _BaseParse {
    private static _instance: _RelicLevelConfig = null;
    public jsonName: string = "relicLevel";
    public get(key: number): Array<any> {
        return this.cfg[key];
    }
    public getCost(key: number, index: number): number {
        return this.get(key)[index].cost;
    }
    public loaded(): void {
        _.each(this.cfg, (element: any) => {
            _.each(element, (innerElement: any) => {
                innerElement.cost = NumberPlus.decode(innerElement.cost);
            });
        });
    }
    public static get Instance(): _RelicLevelConfig {
        if (!_RelicLevelConfig._instance) {
            _RelicLevelConfig._instance = new _RelicLevelConfig();
        }
        return _RelicLevelConfig._instance;
    }
}
