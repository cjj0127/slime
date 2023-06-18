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
// }),
// MINE_REWARD_TYPE = void 0;
// var a = e("Singleton"),
// s = e("Utils"),
// c = e("_BaseParse"),
// l = cc._decorator,
// u = l.ccclass;
// l.property,
// function(e) {
//     e[e.Item = 1] = "Item",
//     e[e.Gear = 2] = "Gear"
// } (MINE_REWARD_TYPE || (MINE_REWARD_TYPE = {}));
// var p = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "mineReward",
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
//     t.prototype.randomReward = function(e) {
//         var t = this.cfg[e],
//         n = t.types,
//         o = t.rewardIds,
//         r = t.counts,
//         i = t.widgets,
//         a = Utils.getRandIndex(i);
//         return {
//             type: n[a],
//             id: o[a],
//             count: r[a]
//         }
//     },
//     n = i([u, a.Singleton], t)
// } (c.default);
// n.default = p
// import { Singleton } from "Singleton";
// import { Utils } from "Utils";
// import { _BaseParse } from "_BaseParse";
import Utils_ from "../utils/Utils";
export enum E_MINE_REWARD_TYPE {
    eItem = 1,
    eGear = 2
}
const { ccclass, property } = cc._decorator;
@ccclass
export default class _MineRewardConfig extends _BaseParse {
    private static _instance: _MineRewardConfig = null;
    jsonName = "mineReward";
    get(e: any): any {
        return this.cfg[e];
    }
    randomReward(e: any): any {
        const t = this.cfg[e], n = t.types, o = t.rewardIds, r = t.counts, i = t.widgets, a = Utils_.getRandIndex_(i);
        return {
            type: n[a],
            id: o[a],
            count: r[a]
        };
    }
    static get Instance(): _MineRewardConfig {
        return _MineRewardConfig._instance || (_MineRewardConfig._instance = new _MineRewardConfig());
    }
}
