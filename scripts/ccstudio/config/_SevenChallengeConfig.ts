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
//         return t.jsonName = "sevenChallenge",
//         t.typeQuests = {},
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
//         u.each(this.cfg,
//         function(t) {
//             var n = u.get(e.typeQuests, t.day, {});
//             n[t.id] = t,
//             u.set(e.typeQuests, t.day, n)
//         })
//     },
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     t.prototype.getByQuestId = function(e) {
//         var t = null;
//         return u.forEach(this.cfg,
//         function(n) {
//             n.quest == e && (t = n)
//         }),
//         t
//     },
//     t.prototype.getDayQuests = function(e) {
//         return this.typeQuests[e]
//     },
//     n = i([l, a.Singleton], t)
// } (s.default);
// n.default = p
// import Singleton from "Singleton";
import _BaseParse from "./_BaseParse";
// import _BaseParse from "_BaseParse";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class _SevenChallengeConfig extends _BaseParse {
    private static _instance: _SevenChallengeConfig = null;
    jsonName: string = "sevenChallenge";
    typeQuests: {
        [key: string]: any;
    } = {};
    get(e: number) {
        return this.cfg[e];
    }
    getByQuestId(e: number) {
        let t = null;
        _.each(this.cfg, (n: any) => {
            if (n.quest == e)
                t = n;
        });
        return t;
    }
    getDayQuests(e: number) {
        return this.typeQuests[e];
    }
    loaded() {
        _.each(this.cfg, (t: any) => {
            const n = this.typeQuests[t.day] || {};
            n[t.id] = t;
            this.typeQuests[t.day] = n;
        });
    }
    static get Instance(): _SevenChallengeConfig {
        if (!this._instance) {
            this._instance = new _SevenChallengeConfig();
        }
        return this._instance;
    }
}
