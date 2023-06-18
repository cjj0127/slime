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
//         return t.jsonName = "buildingLevel",
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
//             e.outNum = s.default.decode(e.outNum),
//             e.levelCost = s.default.decode(e.levelCost),
//             e.maxStock = s.default.decode(e.maxStock)
//         })
//     },
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     t.prototype.getCfg = function(e, t) {
//         var n = null;
//         return p.each(this.cfg,
//         function(o) {
//             o.buildingId == e && o.buildingLevel == t && (n = o)
//         }),
//         n
//     },
//     t.prototype.getBuildMaxLevel = function(e) {
//         var t = 0;
//         return p.each(this.cfg,
//         function(n) {
//             n.buildingId == e && n.buildingLevel > t && (t = n.buildingLevel)
//         }),
//         t
//     },
//     n = i([u, a.Singleton], t)
// } (c.default);
// n.default = f
// import Singleton from "Singleton";
// import NumberPlus from "NumberPlus";
import NumberPlus from "../utils/NumberPlus";
// import _BaseParse from "_BaseParse";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class _BuildingLevelConfig extends _BaseParse {
    private static _instance: _BuildingLevelConfig = null;
    jsonName = "buildingLevel";
    getBuildMaxLevel(e: number) {
        let t = 0;
        _.each(this.cfg, n => {
            n.buildingId == e && n.buildingLevel > t && (t = n.buildingLevel);
        });
        return t;
    }
    getCfg(buildingId: number, buildingLevel: number) {
        let n = null;
        _.each(this.cfg, o => {
            o.buildingId == buildingId && o.buildingLevel == buildingLevel && (n = o);
        });
        return n;
    }
    loaded() {
        _.each(this.cfg, e => {
            e.outNum = NumberPlus.decode(e.outNum),
                e.levelCost = NumberPlus.decode(e.levelCost),
                e.maxStock = NumberPlus.decode(e.maxStock);
        });
    }
    public static get Instance() {
        if (!_BuildingLevelConfig._instance) {
            _BuildingLevelConfig._instance = new _BuildingLevelConfig();
        }
        return _BuildingLevelConfig._instance;
    }
}
