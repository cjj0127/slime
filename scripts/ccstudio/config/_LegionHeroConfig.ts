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
//         return t.jsonName = "legionHero",
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
//     t.prototype.loaded = function() {},
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     t.prototype.getDataIdsByAddType = function(e) {
//         var t = [];
//         return u.forEach(this.cfg,
//         function(n) {
//             n.ringAdd == e && t.push(n.id)
//         }),
//         t.sort(function(e, t) {
//             return e - t
//         }),
//         t
//     },
//     t.prototype.getTotalAddValue = function(e, t) {
//         for (var n = 0,
//         o = this.getDataIdsByAddType(t), r = 0; r < o.length; r++) {
//             var i = o[r];
//             i <= e && (n += this.get(i).ringAddNum)
//         }
//         return n
//     },
//     n = i([l, a.Singleton], t)
// } (s.default);
// n.default = p
// import Singleton from "Singleton";
import _BaseParse from "./_BaseParse";
const _: any = window["_"];
// import _BaseParse from "_BaseParse";
const { ccclass, property } = cc._decorator;
@ccclass
export default class _LegionHeroConfig extends _BaseParse {
    private static _instance: _LegionHeroConfig = null;
    jsonName: string = "legionHero";
    get(e: number) {
        return this.cfg[e];
    }
    getDataIdsByAddType(e: number) {
        let t: number[] = [];
        _.values(this.cfg).forEach((n: any) => {
            if (n.ringAdd == e) {
                t.push(n.id);
            }
        });
        t.sort((e, t) => e - t);
        return t;
    }
    getTotalAddValue(e: number, t: number) {
        let n = 0;
        const dataIds = this.getDataIdsByAddType(t);
        for (let i = 0; i < dataIds.length; i++) {
            const id = dataIds[i];
            if (id <= e) {
                n += this.get(id).ringAddNum;
            }
        }
        return n;
    }
    public static get Instance(): _LegionHeroConfig {
        if (_LegionHeroConfig._instance == null) {
            _LegionHeroConfig._instance = new _LegionHeroConfig();
        }
        return _LegionHeroConfig._instance;
    }
}
