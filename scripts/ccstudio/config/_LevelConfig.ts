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
//         return t.jsonName = "level",
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
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     t.prototype.getWave = function(e, t) {
//         return this.get(e).Waves[t]
//     },
//     t.prototype.loaded = function() {
//         var e = this;
//         p.each(this.cfg,
//         function(t) {
//             t.obtain = NumberPlus.decode(t.obtain),
//             t.multiHP = NumberPlus.decode(t.multiHP),
//             t.multiAttack = NumberPlus.decode(t.multiAttack),
//             t.multiGold = NumberPlus.decode(t.multiGold),
//             t.Waves = [];
//             for (var n = function(n) {
//                 var o = "wave" + (n + 1),
//                 r = t[o],
//                 i = t.Waves[n] = [];
//                 p.each(r,
//                 function(t) {
//                     var n = e.convertStrToNumberArr(t, "|"),
//                     o = n[0],
//                     r = n[1];
//                     i.push({
//                         id: o,
//                         cnt: r
//                     })
//                 }),
//                 delete t[o]
//             },
//             o = 0; o < 5; o++) n(o);
//             t.widgets = [],
//             t.items = [],
//             p.each(t.obtainWidget,
//             function(n) {
//                 var o = e.convertStrToNumberArr(n, "|");
//                 t.items.push(o[0]),
//                 t.widgets.push(o[1])
//             }),
//             delete t.obtainWidget
//         }),
//         this.maxLevel = p.keys(this.cfg).length
//     },
//     t.prototype.getMax = function() {
//         return this.maxLevel
//     },
//     n = i([u, a.Singleton], t)
// } (c.default);
// n.default = f
// class t {
//   cfg: any;
//   maxLevel: number;
import NumberPlus from "../utils/NumberPlus";
//   constructor() { }
//   get(e: string) {
//     return this.cfg[e];
//   }
//   getWave(e: string, t: number) {
//     return this.get(e).Waves[t];
//   }
//   loaded() {
//     let e = this;
//     Object.keys(this.cfg).forEach(function(t) {
//       let curr = e.cfg[t];
//       curr.obtain = decode(curr.obtain);
//       curr.multiHP = decode(curr.multiHP);
//       curr.multiAttack = decode(curr.multiAttack);
//       curr.multiGold = decode(curr.multiGold);
//       curr.Waves = [];
//       for (let n = 0; n < 5; n++) {
//         let o = "wave" + (n + 1),
//           r = curr[o],
//           i = curr.Waves[n] = [];
//         r.forEach(function(t: any) {
//           let n = e.convertStrToNumberArr(t, "|"),
//             o = n[0],
//             r = n[1];
//           i.push({
//             id: o,
//             cnt: r
//           });
//         });
//         delete curr[o];
//       }
//       curr.widgets = [];
//       curr.items = [];
//       curr.obtainWidget.forEach(function(n: any) {
//         let o = e.convertStrToNumberArr(n, "|");
//         curr.items.push(o[0]);
//         curr.widgets.push(o[1]);
//       });
//       delete curr.obtainWidget;
//     });
//     this.maxLevel = Object.keys(this.cfg).length;
//   }
//   getMax() {
//     return this.maxLevel;
//   }
//   convertStrToNumberArr(e: string, t: string) {
//     return null;
//   }
// }
// function decode(str: any): any {
//   return JSON.parse(str);
// }
// const n: any = i([u, a.Singleton], t);
// n.default = f;
// import Singleton from "Singleton";
// import NumberPlus from "NumberPlus";
// import _BaseParse from "_BaseParse";
const { ccclass, property } = cc._decorator;
const p: any = window["_"];
@ccclass
export default class _LevelConfig extends _BaseParse {
    private static _instance: _LevelConfig = null;
    jsonName = "level";
    maxLevel = 0;
    convertStrToNumberArr(e: string, t: string) {
        return e.split(t).map((e) => {
            return parseInt(e);
        });
    }
    get(e: any) {
        return this.cfg[e];
    }
    getMax() {
        return this.maxLevel;
    }
    getWave(e: string, t: number) {
        return this.get(e).Waves[t];
    }
    loaded() {
        p.each(this.cfg, (t: any) => {
            t.obtain = NumberPlus.decode(t.obtain);
            t.multiHP = NumberPlus.decode(t.multiHP);
            t.multiAttack = NumberPlus.decode(t.multiAttack);
            t.multiGold = NumberPlus.decode(t.multiGold);
            t.Waves = [];
            var func = (i: number) => {
                var o = "wave" + (i + 1);
                var r = t[o];
                var a = (t.Waves[i] = []);
                p.each(r, (t: any) => {
                    var n = this.convertStrToNumberArr(t, "|");
                    var o = n[0];
                    var r = n[1];
                    a.push({
                        id: o,
                        cnt: r
                    });
                });
                delete t[o];
            };
            for (let i = 0; i < 5; i++)
                func(i);
            t.widgets = [];
            t.items = [];
            t.obtainWidget.forEach((n) => {
                const o = this.convertStrToNumberArr(n, "|");
                t.items.push(o[0]);
                t.widgets.push(o[1]);
            });
            delete t.obtainWidget;
        });
        this.maxLevel = Object.keys(this.cfg).length;
    }
    static get Instance() {
        if (!_LevelConfig._instance) {
            _LevelConfig._instance = new _LevelConfig();
        }
        return _LevelConfig._instance;
    }
}
