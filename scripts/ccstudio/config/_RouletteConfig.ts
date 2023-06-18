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
// var a = cc._decorator,
// s = (a.ccclass, a.property, globalThis._),
// c = e("Singleton"),
// l = e("Utils"),
// u = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "roulette",
//         t.idToIdx = {},
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
//         var e = this;
//         s.each(this.cfg,
//         function(t, n) {
//             e.idToIdx[t.id] = n
//         })
//     },
//     t.prototype.get = function(e) {
//         var t = this.idToIdx[e];
//         return this.cfg[t]
//     },
//     t.prototype.getWithIdx = function(e) {
//         return this.cfg[e]
//     },
//     t.prototype.randomReward = function() {
//         return l.default.getElementByWeight(this.cfg,
//         function(e) {
//             return e.widget
//         }).id
//     },
//     n = i([c.Singleton], t)
// } (e("_BaseParse").default);
// n.default = u
// import Singleton from "Singleton";
// import Utils from "Utils";
// import { ccclass, property } from "cc.decorator";
import Utils_ from "../utils/Utils";
const { ccclass, property } = cc._decorator;
const _ = window['_'];
@ccclass
export default class _RouletteConfig extends _BaseParse {
    private static _instance: _RouletteConfig = null;
    private idToIdx: {
        [key: string]: number;
    } = {};
    jsonName: string = "roulette";
    public get(id: any): any {
        const index = this.idToIdx[id];
        return this.cfg[index];
    }
    public getWithIdx(index: number): any {
        return this.cfg[index];
    }
    public loaded() {
        _.each(this.cfg, (element: any, index: number) => {
            this.idToIdx[element.id] = index;
        });
    }
    public randomReward() {
        return Utils_.getItemByWeight(this.cfg, (element: any) => element.widget).id;
    }
    static get Instance(): _RouletteConfig {
        if (!this._instance) {
            this._instance = new _RouletteConfig();
        }
        return this._instance;
    }
}
