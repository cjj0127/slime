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
// c = cc._decorator,
// l = c.ccclass,
// u = (c.property, globalThis._),
// p = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "plunderHero",
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
//     t.prototype.loaded = function() {},
//     t.prototype.get = function(e) {
//         var t = 0;
//         return u.each(this.cfg,
//         function(n) {
//             n.heroMinusLevel == e && (t = n.outLow)
//         }),
//         t
//     },
//     n = i([l, s.Singleton], t)
// } (a.default);
// n.default = p
// import _BaseParse from "_BaseParse";
import _BaseParse from "./_BaseParse";
// import Singleton from "Singleton";
const { ccclass, property } = cc._decorator;
const _ = window['_'];
@ccclass
export default class _PlunderHeroConfig extends _BaseParse {
    private static _instance: _PlunderHeroConfig = null;
    jsonName: string = "plunderHero";
    get(e: number) {
        let t = 0;
        _.each(this.cfg, (n) => {
            if (n.heroMinusLevel == e)
                t = n.outLow;
        });
        return t;
    }
    loaded() { }
    public static get Instance() {
        return this._instance || (this._instance = new _PlunderHeroConfig());
    }
}
