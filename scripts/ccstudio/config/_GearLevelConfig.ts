import _BaseParse from "./_BaseParse";
// var a = e("_BaseParse"),
// s = e("Singleton"),
// c = e("NumberPlus"),
// l = cc._decorator,
// u = l.ccclass,
// p = (l.property, globalThis._),
// f = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "gearLevel",
//         t
//     }
//     var n;
//     return r(t, e),
//     n = t,
//     Object.defineProperty(t, "Instance", {
//         get: function() {
//             return s.Singleton.get(n)
//         },
//         enumerable: !1,
//         configurable: !0
//     }),
//     t.prototype.loaded = function() {
//         p.each(this.cfg,
//         function(e) {
//             p.each(e,
//             function(e) {
//                 e.owned = c.default.decode(e.owned)
//             })
//         })
//     },
//     t.prototype.get = function(e, t) {
//         return p.get(this.cfg, [e, t])
//     },
//     t.prototype.getMaxLevel = function(e) {
//         return p.keys(p.get(this.cfg, e)).length
//     },
//     n = i([u, s.Singleton], t)
// } (a.default);
// n.default = f
// import _BaseParse from "_BaseParse";
// import Singleton from "Singleton";
import NumberPlus from "../utils/NumberPlus";
// import NumberPlus from "NumberPlus";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class _GearLevelConfig extends _BaseParse {
    private static _instance: _GearLevelConfig = null;
    jsonName = "gearLevel";
    public get(e: any, t: any) {
        return _.get(this.cfg, [e, t]);
    }
    public getMaxLevel(e: any) {
        // return p.keys(p.get(this.cfg, e)).length
        return _.keys(_.get(this.cfg, e)).length;
    }
    public loaded() {
        _.each(this.cfg, (e: any) => {
            _.each(e, (f: any) => {
                f.owned = NumberPlus.decode(f.owned);
            });
        });
    }
    public static get Instance(): _GearLevelConfig {
        return this._instance || (this._instance = new _GearLevelConfig());
    }
}
