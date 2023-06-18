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
//         return t.jsonName = "mineResearch",
//         t.unlockSkills = {},
//         t.skillLayers = {},
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
//             var n = t.pre,
//             o = t.id;
//             t.maxLevel = t.value.length,
//             t.value.unshift(0),
//             l.each(n,
//             function(t) {
//                 var n = l.get(e.unlockSkills, t, []);
//                 n.push(o),
//                 l.set(e.unlockSkills, t, n)
//             })
//         });
//         var t = {},
//         n = function(o) {
//             var r = t[o] || 0,
//             i = e.unlockSkills[o]; ! l.isNil(i) && i.length > 0 && l.each(i,
//             function(e) {
//                 t[e] = r + 1,
//                 n(e)
//             })
//         },
//         o = l.keys(this.unlockSkills),
//         r = l.first(o);
//         t[r] = 0,
//         n(r),
//         this.skillLayers = t
//     },
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     t.prototype.getUnlockSkills = function(e) {
//         return this.unlockSkills[e]
//     },
//     t.prototype.getIdLayer = function(e) {
//         return this.skillLayers[e]
//     },
//     t.prototype.getLayerIds = function(e) {
//         return l.reduce(this.skillLayers,
//         function(t, n, o) {
//             return n == e && t.push(o),
//             t
//         },
//         [])
//     },
//     t.prototype.getCompleteNeedDiams = function(e, t) {
//         var n = Math.ceil(t / 60),
//         o = this.get(e),
//         r = o.minFastComplete,
//         i = o.minuteFastComplete,
//         a = Math.ceil(r / i);
//         return n > a && (r += i * (n - a)),
//         r
//     },
//     t.prototype.getExpend = function(e, t) {
//         var n = this.get(e).expend;
//         return t >= n.length ? l.last(n) : n[t]
//     },
//     t.prototype.getIncreaseValue = function(e, t) {
//         return this.get(e).value[t]
//     },
//     t.prototype.getLevelUpDuration = function(e, t) {
//         return void 0 == t && (t = 0),
//         this.get(e).researchTime * Math.pow(2, t) * 60
//     },
//     n = i([a.Singleton], t)
// } (s.default);
// n.default = u
// import Singleton from "Singleton";
import _BaseParse from "./_BaseParse";
// import _BaseParse from "_BaseParse";
const { ccclass, property } = cc._decorator;
const l: any = window["_"];
@ccclass
export default class _MineResearchConfig extends _BaseParse {
    private static _instance: _MineResearchConfig = null;
    jsonName: string = "mineResearch";
    private skillLayers: Record<string, any> = {};
    private unlockSkills: Record<string, any> = {};
    get(e: any) {
        return this.cfg[e];
    }
    getCompleteNeedDiams(e: any, t: any) {
        const n = Math.ceil(t / 60);
        const o = this.get(e);
        let r = o.minFastComplete;
        const i = o.minuteFastComplete;
        const a = Math.ceil(r / i);
        if (n > a) {
            r += i * (n - a);
        }
        return r;
    }
    getExpend(e: any, t: any) {
        const n = this.get(e).expend;
        return t >= n.length ? l.last(n) : n[t];
    }
    getIdLayer(e: any) {
        return this.skillLayers[e];
    }
    getIncreaseValue(e: any, t: any) {
        return this.get(e).value[t];
    }
    getLayerIds(e: any) {
        return l.reduce(this.skillLayers, (t: any, n: any, o: any) => {
            if (n == e) {
                t.push(o);
            }
            return t;
        }, []);
    }
    getLevelUpDuration(e: any, t: any = 0) {
        return this.get(e).researchTime * Math.pow(2, t) * 60;
    }
    getUnlockSkills(e: any) {
        return this.unlockSkills[e];
    }
    loaded() {
        l.each(this.cfg, (t: any) => {
            const n = t.pre;
            const o = t.id;
            t.maxLevel = t.value.length;
            t.value.unshift(0);
            l.each(n, (t: any) => {
                const n = l.get(this.unlockSkills, t, []);
                n.push(o);
                l.set(this.unlockSkills, t, n);
            });
        });
        const t: any = {};
        const n = (o: any) => {
            const r = t[o] || 0;
            const i = this.unlockSkills[o];
            if (!l.isNil(i) && i.length > 0) {
                l.each(i, (e: any) => {
                    t[e] = r + 1;
                    n(e);
                });
            }
        };
        const o = l.keys(this.unlockSkills);
        const r = l.first(o);
        t[r] = 0;
        n(r);
        this.skillLayers = t;
    }
    static get Instance(): _MineResearchConfig {
        return _MineResearchConfig._instance || (_MineResearchConfig._instance = new _MineResearchConfig());
    }
}
