// var e = require;
// var t = module;
// var n = exports;
// var o, r = this && this.__extends || (o = function (e, t) {
//     return (o = Object.setPrototypeOf || {
//         __proto__: []
//     }
//         instanceof Array &&
//         function (e, t) {
//             e.__proto__ = t
//         } ||
//         function (e, t) {
//             for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
//         })(e, t)
// },
//     function (e, t) {
//         function n() {
//             this.constructor = e
//         }
//         o(e, t),
//             e.prototype = null == t ? Object.create(t) : (n.prototype = t.prototype, new n)
//     }),
//     i = this && this.__decorate ||
//         function (e, t, n, o) {
//             var r, i = arguments.length,
//                 a = i < 3 ? t : null == o ? o = Object.getOwnPropertyDescriptor(t, n) : o;
//             if ("object" == typeof Reflect && "function" == typeof Reflect.decorate) a = Reflect.decorate(e, t, n, o);
//             else for (var s = e.length - 1; s >= 0; s--)(r = e[s]) && (a = (i < 3 ? r(a) : i > 3 ? r(t, n, a) : r(t, n)) || a);
//             return i > 3 && a && Object.defineProperty(t, n, a),
//                 a
//         };
// Object.defineProperty(n, "__esModule", {
//     value: !0
// });
// var a = e("Singleton"),
//     s = e("_BaseParse"),
//     c = cc._decorator,
//     l = c.ccclass,
//     u = (c.property, globalThis._),
//     p = function (e) {
//         function t() {
//             var t = null !== e && e.apply(this, arguments) || this;
//             return t.jsonName = "traitComb",
//                 t.kinds = {},
//                 t
//         }
//         var n;
//         return r(t, e),
//             n = t,
//             Object.defineProperty(t, "Instance", {
//                 get: function () {
//                     return a.Singleton.get(n)
//                 },
//                 enumerable: !1,
//                 configurable: !0
//             }),
//             t.prototype.loaded = function () {
//                 var e = this;
//                 u.each(this.cfg,
//                     function (t) {
//                         var n = u.get(e.kinds, t.kind, []);
//                         n.push(t.id),
//                             u.set(e.kinds, t.kind, n)
//                     })
//             },
//             t.prototype.get = function (e) {
//                 return this.cfg[e]
//             },
//             t.prototype.getCombos = function (e) {
//                 return this.kinds[e]
//             },
//             t.prototype.getComboLevel = function (e, t) {
//                 for (var n = u.get(this.kinds, e, []), o = 0, r = 0; r < n.length; r++) {
//                     var i = n[r];
//                     if (!(t >= this.get(i).count)) break;
//                     o = r + 1
//                 }
//                 return o
//             },
//             t.prototype.getComboWithLevel = function (e, t) {
//                 return u.get(this.kinds, e, [])[t]
//             },
//             t.prototype.getAllKinds = function () {
//                 return u.keys(this.kinds)
//             },
//             n = i([l, a.Singleton], t)
//     }(s.default);
// n.default = p
// import Singleton from "Singleton";
// import _BaseParse from "_BaseParse";
import _BaseParse from "./_BaseParse";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class _TraitComboConfig extends _BaseParse {
    private static _instance: _TraitComboConfig = null;
    jsonName: string = "traitComb";
    kinds: any = {};
    get(e: number) {
        return this.cfg[e];
    }
    getAllKinds() {
        return Object.keys(this.kinds);
    }
    getComboLevel(e: string, t: number) {
        const kinds = this.kinds[e] || [];
        let o = 0;
        for (let r = 0; r < kinds.length; r++) {
            const i = kinds[r];
            if (!(t >= this.get(i).count))
                break;
            o = r + 1;
        }
        return o;
    }
    getComboWithLevel(e: string, t: number) {
        return (this.kinds[e] || [])[t];
    }
    getCombos(e: number) {
        return this.kinds[e];
    }
    loaded() {
        _.each(this.cfg, (t: any) => {
            let n = this.kinds[t.kind] || [];
            n.push(t.id);
            this.kinds[t.kind] = n;
        });
    }
    static get Instance() {
        return _TraitComboConfig._instance || (_TraitComboConfig._instance = new _TraitComboConfig());
    }
}
