import _BaseParse from "./_BaseParse";
import { NAMES_BUNDLE } from "../../modules/asset/AssetRes";
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
// },
// a = this && this.__awaiter ||
// function(e, t, n, o) {
//     return new(n || (n = Promise))(function(r, i) {
//         function a(e) {
//             try {
//                 c(o.next(e))
//             } catch(t) {
//                 i(t)
//             }
//         }
//         function s(e) {
//             try {
//                 c(o.
//                 throw (e))
//             } catch(t) {
//                 i(t)
//             }
//         }
//         function c(e) {
//             var t;
//             e.done ? r(e.value) : (t = e.value, t instanceof n ? t: new n(function(e) {
//                 e(t)
//             })).then(a, s)
//         }
//         c((o = o.apply(e, t || [])).next())
//     })
// },
// s = this && this.__generator ||
// function(e, t) {
//     var n, o, r, i, a = {
//         label: 0,
//         sent: function() {
//             if (1 & r[0]) throw r[1];
//             return r[1]
//         },
//         trys: [],
//         ops: []
//     };
//     return i = {
//         next: s(0),
//         throw: s(1),
//         return: s(2)
//     },
//     "function" == typeof Symbol && (i[Symbol.iterator] = function() {
//         return this
//     }),
//     i;
//     function s(e) {
//         return function(t) {
//             return c([e, t])
//         }
//     }
//     function c(i) {
//         if (n) throw new TypeError("Generator is already executing.");
//         for (; a;) try {
//             if (n = 1, o && (r = 2 & i[0] ? o.
//             return: i[0] ? o.
//             throw || ((r = o.
//             return) && r.call(o), 0) : o.next) && !(r = r.call(o, i[1])).done) return r;
//             switch (o = 0, r && (i = [2 & i[0], r.value]), i[0]) {
//                 case 0:
//                 case 1:
//                     r = i;
//                 break;
//                 case 4:
//                     return a.label++,
//                 {
//                     value: i[1],
//                     done: !1
//                 };
//                 case 5:
//                     a.label++,
//                 o = i[1],
//                 i = [0];
//                 continue;
//                 case 7:
//                     i = a.ops.pop(),
//                 a.trys.pop();
//                 continue;
//                 default: if (! (r = (r = a.trys).length > 0 && r[r.length - 1]) && (6 == i[0] || 2 == i[0])) {
//                     a = 0;
//                     continue
//                 }
//                 if (3 == i[0] && (!r || i[1] > r[0] && i[1] < r[3])) {
//                     a.label = i[1];
//                     break
//                 }
//                 if (6 == i[0] && a.label < r[1]) {
//                     a.label = r[1],
//                     r = i;
//                     break
//                 }
//                 if (r && a.label < r[2]) {
//                     a.label = r[2],
//                     a.ops.push(i);
//                     break
//                 }
//                 r[2] && a.ops.pop(),
//                 a.trys.pop();
//                 continue;
//             }
//             i = t.call(e, a)
//         } catch(s) {
//             i = [6, s],
//             o = 0
//         } finally {
//             n = r = 0
//         }
//         if (5 & i[0]) throw i[1];
//         return {
//             value: i[0] ? i[1] : void 0,
//             done: !0
//         }
//     }
// };
// Object.defineProperty(n, "__esModule", {
//     value: !0
// });
// var c = e("Singleton"),
// l = e("AssetManager"),
// u = e("AssetRes"),
// p = e("_BaseParse"),
// f = cc._decorator,
// d = f.ccclass,
// h = (f.property, globalThis._),
// g = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "mine",
//         t.meterCfgDatas = {},
//         t
//     }
//     var n;
//     return r(t, e),
//     n = t,
//     Object.defineProperty(t, "Instance", {
//         get: function() {
//             return c.Singleton.get(n)
//         },
//         enumerable: !1,
//         configurable: !0
//     }),
//     t.prototype.loaded = function() {
//         h.each(this.cfg,
//         function(e) {
//             var t = e.total;
//             e.cfgs = [],
//             e.cfgs.push(e.enter);
//             for (var n = 0; n < t; n++) {
//                 var o = "cfg" + (n + 1);
//                 e.cfgs.push(e[o])
//             }
//         })
//     },
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     t.prototype.getWith = function(e) {
//         var t = h.keys(this.cfg),
//         n = t[h.findIndex(t,
//         function(t) {
//             return e <= parseInt(t)
//         })];
//         return h.isNil(n) && (n = h.last(t)),
//         this.cfg[n]
//     },
//     t.prototype.loadMineCfg = function(e) {
//         return a(this, void 0, void 0,
//         function() {
//             var t = this;
//             return s(this,
//             function() {
//                 return [2, new Promise(function(n) {
//                     return a(t, void 0, void 0,
//                     function() {
//                         return s(this,
//                         function() {
//                             return AssetManager.Instance.load(BUNDLE_NAMES.Game, "Cfgs/Mine/" + e, cc.JsonAsset, null,
//                             function(e) {
//                                 var t = e.assets.json;
//                                 n(t)
//                             }),
//                             [2]
//                         })
//                     })
//                 })]
//             })
//         })
//     },
//     t.prototype.getMineCfgData = function(e, t) {
//         return a(this, void 0, void 0,
//         function() {
//             var n, o, r, i, a, c;
//             return s(this,
//             function(s) {
//                 switch (s.label) {
//                     case 0:
//                         return (n = this.meterCfgDatas[e]) || (n = this.meterCfgDatas[e] = {}),
//                     (o = n[t]) ? [3, 2] : (r = this.get(e), i = r.cfgs[t], a = n, c = t, [4, this.loadMineCfg(i)]);
//                     case 1:
//                         o = a[c] = s.sent(),
//                     s.label = 2;
//                     case 2:
//                         return [2, o];
//                 }
//             })
//         })
//     },
//     n = i([d, c.Singleton], t)
// } (p.default);
// n.default = g
// import * as Singleton from "Singleton";
// import AssetManager  from "AssetManager";
// import { AssetRes } from "AssetRes";
// import { _BaseParse } from "_BaseParse";
import AssetManager from "../../modules/asset/AssetManager";
const h: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class _MineConfig extends _BaseParse {
    private static _instance: _MineConfig = null;
    jsonName: string = "mine";
    private meterCfgDatas: any = {};
    public get(e: any): any {
        return this.cfg[e];
    }
    public async getMineCfgData(e: any, t: number): Promise<any> {
        const n = this.meterCfgDatas[e] || (this.meterCfgDatas[e] = {});
        let o = n[t];
        if (!o) {
            const r = this.get(e);
            const i = r.cfgs[t];
            o = n[t] = await this.loadMineCfg(i);
        }
        return o;
    }
    public getWith(e: number): any {
        const t = h.keys(this.cfg);
        let n = t[h.findIndex(t, (key) => {
            return e <= parseInt(key);
        })];
        if (h.isNil(n)) {
            n = t[t.length - 1];
        }
        return this.cfg[n];
    }
    public async loadMineCfg(e: string): Promise<any> {
        return new Promise((resolve) => {
            AssetManager.Instance.load(NAMES_BUNDLE.Game, "Cfgs/Mine/" + e, cc.JsonAsset, null, (e: any) => {
                const t = e.assets.json;
                resolve(t);
            });
        });
    }
    // async onLoad() {
    //     const res = await AssetManager.loadResAsync(this.jsonName, cc.JsonAsset) as cc.TextAsset;
    //     const jsonData = JSON.parse(res.text);
    //     this.meterCfgDatas = _BaseParse.parseJsonData(jsonData);
    // }
    public loaded(): void {
        h.each(this.cfg, (v) => {
            const e = v.total;
            v.cfgs = [];
            v.cfgs.push(v.enter);
            for (let n = 0; n < e; n++) {
                const o = "cfg" + (n + 1);
                v.cfgs.push(v[o]);
            }
        });
    }
    static get Instance(): _MineConfig {
        return _MineConfig._instance || (_MineConfig._instance = new _MineConfig());
    }
}
