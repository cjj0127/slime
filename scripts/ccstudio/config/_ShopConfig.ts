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
//         return t.jsonName = "shop",
//         t.typeShops = {},
//         t.triggerCfgs = {},
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
//         l.each(this.cfg,
//         function(t) {
//             var n = t.trigger.toString(),
//             o = [];
//             if (!l.isEmpty(n)) {
//                 var r = l.split(n, ",");
//                 l.each(r,
//                 function(n) {
//                     if (!l.isEmpty(n)) {
//                         var r = n.split("|"),
//                         i = r[0],
//                         a = r[1];
//                         o.push({
//                             type: parseInt(i),
//                             value: a
//                         });
//                         var s = l.get(e.triggerCfgs, i, []);
//                         s.push(t.id),
//                         l.set(e.triggerCfgs, i, s)
//                     }
//                 })
//             }
//             t.trigger = o;
//             var i = t.goods.toString(),
//             a = [];
//             l.isEmpty(i) || (r = l.split(i, ","), l.each(r,
//             function(e) {
//                 if (!l.isEmpty(e)) {
//                     var t = e.split("|"),
//                     n = parseInt(t[0]),
//                     o = parseInt(t[1]),
//                     r = parseInt(t[2]);
//                     a.push({
//                         type: n,
//                         id: o,
//                         count: r
//                     })
//                 }
//             })),
//             t.goods = a;
//             var s = l.get(e.typeShops, t.type, []);
//             s.push(t),
//             l.set(e.typeShops, t.type, s)
//         })
//     },
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     t.prototype.getTypes = function(e) {
//         return this.typeShops[e]
//     },
//     t.prototype.getTiggerCfgs = function(e) {
//         return l.get(this.triggerCfgs, e, [])
//     },
//     n = i([a.Singleton], t)
// } (s.default);
// n.default = u
// import Singleton from 'Singleton';
// import _BaseParse from '_BaseParse';
import _BaseParse from "./_BaseParse";
const { ccclass, property } = cc._decorator;
const l: any = window["_"];
@ccclass
export default class _ShopConfig extends _BaseParse {
    private static _instance: _ShopConfig = null;
    jsonName = "shop";
    private triggerCfgs = {};
    private typeShops = {};
    get(e) {
        return this.cfg[e];
    }
    getTiggerCfgs(e) {
        return l.get(this.triggerCfgs, e, []);
    }
    getTypes(e) {
        return this.typeShops[e];
    }
    loaded() {
        l.each(this.cfg, (t) => {
            let n = t.trigger.toString();
            let o = [];
            if (!l.isEmpty(n)) {
                let r = l.split(n, ",");
                l.each(r, (n) => {
                    if (!l.isEmpty(n)) {
                        let r = n.split("|");
                        let i = parseInt(r[0]);
                        let a = r[1];
                        o.push({
                            type: i,
                            value: a
                        });
                        let s = l.get(this.triggerCfgs, i, []);
                        s.push(t.id);
                        l.set(this.triggerCfgs, i, s);
                    }
                });
            }
            t.trigger = o;
            let i = t.goods.toString();
            let a = [];
            if (!l.isEmpty(i)) {
                let r = l.split(i, ",");
                l.each(r, (e) => {
                    if (!l.isEmpty(e)) {
                        let t = e.split("|");
                        let n = parseInt(t[0]);
                        let o = parseInt(t[1]);
                        let r = parseInt(t[2]);
                        a.push({
                            type: n,
                            id: o,
                            count: r
                        });
                    }
                });
            }
            t.goods = a;
            let s = l.get(this.typeShops, t.type, []);
            s.push(t);
            l.set(this.typeShops, t.type, s);
        });
    }
    static get Instance(): _ShopConfig {
        if (!this._instance) {
            this._instance = new _ShopConfig();
        }
        return this._instance;
    }
}
