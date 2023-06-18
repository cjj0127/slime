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
//         return t.jsonName = "legionRush",
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
//             t.multiHP = s.default.decode(t.multiHP),
//             t.multiAtk = s.default.decode(t.multiAtk),
//             t.qualities = [],
//             t.nums = [],
//             p.each(t.reward,
//             function(n) {
//                 var o = e.convertStrToNumberArr(n, "|");
//                 t.qualities.push(o[0]),
//                 t.nums.push(o[1])
//             }),
//             delete t.reward,
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
const _: any = window["_"];
@ccclass
export default class _LegionRushConfig extends _BaseParse {
    private static _instance: _LegionRushConfig = null;
    jsonName: string = "legionRush";
    private maxLevel: number = 0;
    public get(id: number) {
        return this.cfg[id];
    }
    public getMax() {
        return this.maxLevel;
    }
    loaded() {
        super.loaded();
        _.each(this.cfg, (value, key) => {
            value.id = key;
            value.multiHP = NumberPlus.decode(value.multiHP);
            value.multiAtk = NumberPlus.decode(value.multiAtk);
            value.qualities = [];
            value.nums = [];
            for (const reward of value.reward) {
                const [quality, num] = this.convertStrToNumberArr(reward, "|");
                value.qualities.push(quality);
                value.nums.push(num);
            }
            delete value.reward;
            this.maxLevel = Math.max(this.maxLevel, value.id);
        });
    }
    static get Instance(): _LegionRushConfig {
        if (!this._instance) {
            this._instance = new _LegionRushConfig();
        }
        return this._instance;
    }
}
