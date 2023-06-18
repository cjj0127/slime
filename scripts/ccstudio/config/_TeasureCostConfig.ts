// var e = require;
// var t = module;
// var n = exports;
// var o, r = this && this.__extends || (o = function(e, t) {
//     return (o = Object.setPrototypeOf || {
//         __proto__: []
//     }
//     instanceof Array &&
//     function(e, t) {
//         e.__proto__ = t
//     } ||
//     function(e, t) {
//         for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
//     })(e, t)
// },
// function(e, t) {
//     function n() {
//         this.constructor = e
//     }
//     o(e, t),
//     e.prototype = null == t ? Object.create(t) : (n.prototype = t.prototype, new n)
// }),
// i = this && this.__decorate ||
// function(e, t, n, o) {
//     var r, i = arguments.length,
//     a = i < 3 ? t: null == o ? o = Object.getOwnPropertyDescriptor(t, n) : o;
//     if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, o);
//     else for (var s = e.length - 1; s >= 0; s--)(r = e[s]) && (a = (i < 3 ? r(a) : i > 3 ? r(t, n, a) : r(t, n)) || a);
//     return i > 3 && a && Object.defineProperty(t, n, a),
//     a
// };
// Object.defineProperty(n, "__esModule", {
//     value: !0
// });
// var a = e("Singleton"),
// s = e("_BaseParse"),
// c = cc._decorator,
// l = c.ccclass,
// u = (c.property, globalThis._),
// p = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "treasureCost",
//         t.idData = {},
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
//         var e = this;
//         u.each(this.cfg,
//         function(t) {
//             t.costNum = t.costNum,
//             e.idData[t.treasureId] = {
//                 treasureId: t.treasureId,
//                 costNum: t.costNum
//             }
//         })
//     },
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     t.prototype.getDataByTeasureId = function(e) {
//         return this.idData[e]
//     },
//     n = i([l, a.Singleton], t)
// } (s.default);
// n.default = p
// import Singleton from 'Singleton';
// import _BaseParse from '_BaseParse';
// import { ccclass, property } from cc._decorator;
import _BaseParse from "./_BaseParse";
const { ccclass, property } = cc._decorator;
@ccclass
export default class _TeasureCostConfig extends _BaseParse {
    private static _instance: _TeasureCostConfig = null;
    idData = {};
    jsonName = "treasureCost";
    get(e) {
        return this.cfg[e];
    }
    getDataByTeasureId(e) {
        return this.idData[e];
    }
    loaded() {
        Object.entries(this.cfg).forEach(([_, t]) => {
            t.costNum = t.costNum;
            this.idData[t.treasureId] = {
                treasureId: t.treasureId,
                costNum: t.costNum
            };
        });
    }
    static get Instance() {
        return this._instance || (this._instance = new _TeasureCostConfig());
    }
}
