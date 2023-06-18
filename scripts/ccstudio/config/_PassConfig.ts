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
// l = (c.ccclass, c.property, globalThis._),
// u = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "pass",
//         t.ids = [],
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
//         var e = l.keys(this.cfg);
//         this.ids = l.map(e, Number)
//     },
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     t.prototype.getFirstId = function() {
//         return l.first(this.ids)
//     },
//     t.prototype.getNext = function(e) {
//         var t = l.indexOf(this.ids, e);
//         return cc.error("ids", this.ids, e),
//         t >= this.ids.length - 1 ? l.first(this.ids) : this.ids[t + 1]
//     },
//     n = i([a.Singleton], t)
// } (s.default);
// n.default = u
// import Singleton from "./Singleton";
// import _BaseParse from "./_BaseParse";
import _BaseParse from "./_BaseParse";
const { ccclass, property } = cc._decorator;
@ccclass
export default class _PassConfig extends _BaseParse {
    private ids: Array<number> = [];
    private static instance: _PassConfig;
    jsonName: string = "pass";
    public get(e: number) {
        return this.cfg[e];
    }
    public getFirstId() {
        return this.ids[0];
    }
    public getNext(e: number) {
        const t = this.ids.indexOf(e);
        if (t >= this.ids.length - 1) {
            return this.ids[0];
        }
        return this.ids[t + 1];
    }
    public loaded() {
        const e = Object.keys(this.cfg);
        this.ids = e.map(Number);
    }
    public static get Instance() {
        if (!this.instance) {
            this.instance = new _PassConfig();
        }
        return this.instance;
    }
}
