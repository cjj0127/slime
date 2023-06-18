import _BaseParse from "./_BaseParse";
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
// var a = e("_BaseParse"),
// s = e("Singleton"),
// c = e("NumberPlus"),
// l = cc._decorator,
// u = l.ccclass,
// p = (l.property, globalThis._),
// f = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "partnerLevel",
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
// import { _BaseParse } from "_BaseParse";
// import { Singleton } from "Singleton";
// import NumberPlus from "NumberPlus";
import NumberPlus from "../utils/NumberPlus";
const { ccclass, property } = cc._decorator;
const p: any = window["_"];
@ccclass
export default class _PartnerLevelConfig extends _BaseParse {
    private static _instance: _PartnerLevelConfig = null;
    jsonName: string = "partnerLevel";
    get(e: any, t: any) {
        return p.get(this.cfg, [e, t]);
    }
    getMaxLevel(e: any) {
        return p.keys(p.get(this.cfg, e)).length;
    }
    loaded() {
        p.each(this.cfg, (e) => {
            p.each(e, (e) => {
                e.owned = NumberPlus.decode(e.owned);
            });
        });
    }
    static get Instance() {
        return _PartnerLevelConfig._instance || (_PartnerLevelConfig._instance = new _PartnerLevelConfig());
    }
}
