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
// s = e("NumberPlus"),
// c = e("_BaseParse"),
// l = cc._decorator,
// u = l.ccclass,
// p = (l.property, globalThis._),
// f = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "caveRush",
//         t.maxLevel = 0,
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
//         p.each(this.cfg,
//         function(t, n) {
//             t.id = n,
//             t.reward = s.default.decode(t.reward),
//             t.multiHP = s.default.decode(t.multiHP),
//             t.multiAttack = s.default.decode(t.multiAttack),
//             t.caveHP = s.default.decode(t.caveHP),
//             e.maxLevel = Math.max(e.maxLevel, t.id)
//         })
//     },
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     t.prototype.getMax = function() {
//         return this.maxLevel
//     },
//     n = i([u, a.Singleton], t)
// } (c.default);
// n.default = f
// import Singleton from "Singleton";
// import NumberPlus from "NumberPlus";
import NumberPlus from "../utils/NumberPlus";
// import _BaseParse from "_BaseParse";
const { ccclass, property } = cc._decorator;
const p: any = window["_"];
@ccclass
export default class _CaveRushConfig extends _BaseParse {
    private static _instance: _CaveRushConfig = null;
    public jsonName = "caveRush";
    public maxLevel = 0;
    public get(e) {
        return this.cfg[e];
    }
    public getMax() {
        return this.maxLevel;
    }
    public loaded() {
        let self = this;
        p.each(this.cfg, function (t, n) {
            t.id = n,
                t.reward = NumberPlus.decode(t.reward),
                t.multiHP = NumberPlus.decode(t.multiHP),
                t.multiAttack = NumberPlus.decode(t.multiAttack),
                t.caveHP = NumberPlus.decode(t.caveHP),
                self.maxLevel = Math.max(self.maxLevel, t.id);
        });
    }
    public static get Instance(): _CaveRushConfig {
        if (!this._instance) {
            this._instance = new _CaveRushConfig();
        }
        return this._instance;
    }
}
