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
//         return t.jsonName = "summonExtra",
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
//         u.each(this.cfg,
//         function(e) {
//             e.widgets = u.values(e)
//         })
//     },
//     t.prototype.get = function(e) {
//         return this.cfg[e].widgets
//     },
//     n = i([l, a.Singleton], t)
// } (s.default);
// n.default = p
// import { Singleton } from "Singleton";
import _BaseParse from "./_BaseParse";
const _: any = window["_"];
// import { _BaseParse } from "_BaseParse";
const { ccclass, property } = cc._decorator;
@ccclass
export default class _SummonExtraConfig extends _BaseParse {
    private static _instance: _SummonExtraConfig = null;
    public jsonName: string = "summonExtra";
    public get(e: number): any {
        return this.cfg[e].widgets;
    }
    public loaded() {
        _.each(this.cfg, (e: any) => {
            e.widgets = Object.values(e);
        });
    }
    public static get Instance(): _SummonExtraConfig {
        return this._instance || (this._instance = new _SummonExtraConfig());
    }
}
