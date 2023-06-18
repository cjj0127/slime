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
// var a = e("Singleton"),
// s = e("Utils"),
// c = e("_BaseParse"),
// l = cc._decorator,
// u = l.ccclass,
// p = (l.property, globalThis._),
// f = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "traitLevel",
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
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     t.prototype.random = function() {
//         var e = this,
//         t = p.keys(this.cfg);
//         return s.default.getElementByWeight(t,
//         function(t) {
//             return e.get(t).rate
//         })
//     },
//     n = i([u, a.Singleton], t)
// } (c.default);
// n.default = f
// import Singleton from "Singleton";
// import Utils from "Utils";
import Utils_ from "../utils/Utils";
// import _BaseParse from "_BaseParse";
const { ccclass, property } = cc._decorator;
@ccclass
export default class _TraitLevelConfig extends _BaseParse {
    private static _int: _TraitLevelConfig = null;
    jsonName: string = "traitLevel";
    get(e: any): any {
        return this.cfg[e];
    }
    random(): any {
        const keys = Object.keys(this.cfg);
        return Utils_.getItemByWeight(keys, (t: any) => {
            return this.get(t).rate;
        });
    }
    static get Instance(): _TraitLevelConfig {
        if (!this._int) {
            this._int = new _TraitLevelConfig();
        }
        return this._int;
    }
}
