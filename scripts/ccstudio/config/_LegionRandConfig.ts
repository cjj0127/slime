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
// s = e("Utils"),
// c = e("_BaseParse"),
// l = cc._decorator,
// u = l.ccclass,
// p = (l.property, globalThis._),
// f = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "legionRand",
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
//     t.prototype.randData = function(e, t, n) {
//         var o = this.get(t),
//         r = Utils.randomRange(0, 100) <= o.powerRate,
//         i = o.normalEnemy;
//         return (n || r) && (i = o.bossEnemy),
//         {
//             id: t,
//             propId: o.propId,
//             upType: o.upType,
//             upNumValue: this.getUpNumValue(t, e, r),
//             enemy: i,
//             isPowerEnemy: r
//         }
//     },
//     t.prototype.getUpNumValue = function(e, t, n) {
//         var o = this.get(e);
//         if (0 == o.propId) return 1;
//         var r = o.legionLevelArea,
//         i = 0;
//         p.forEach(r,
//         function(e) {
//             t >= e && i++
//         });
//         var a = o.upNum[i];
//         n && (a = o.powerUpNum[i]);
//         var c = a.split("|");
//         return 2 != c.length ? 0 : Utils.randomRange(parseInt(c[0]), parseInt(c[1]))
//     },
//     t.prototype.getDataWithOutAddLevelProp = function() {
//         var e = [];
//         return p.forEach(this.cfg,
//         function(t) {
//             0 != t.propId && e.push(t.id)
//         }),
//         e
//     },
//     n = i([u, a.Singleton], t)
// } (c.default);
// n.default = f
// import Singleton from '../Singleton';
// import Utils from '../Utils';
// import _BaseParse from '../_BaseParse';
import Utils_ from "../utils/Utils";
const _: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class _LegionRandConfig extends _BaseParse {
    private static _instance: _LegionRandConfig = null;
    jsonName: string = "legionRand";
    get(e: any): any {
        return this.cfg[e];
    }
    getDataWithOutAddLevelProp(): any[] {
        const e: any[] = [];
        _.each(this.cfg, function (t: any) {
            if (t.propId !== 0) {
                e.push(t.id);
            }
        });
        return e;
    }
    getUpNumValue(e: any, t: any, n: boolean): any {
        const o = this.get(e);
        if (o.propId == 0) {
            return 1;
        }
        const r = o.legionLevelArea;
        let i = 0;
        _.each(r, (ele: any) => {
            if (t >= ele) {
                i++;
            }
        });
        let a = o.upNum[i];
        if (n) {
            a = o.powerUpNum[i];
        }
        const c = a.split("|");
        if (c.length !== 2) {
            return 0;
        }
        return Utils_.getRandomRange(parseInt(c[0]), parseInt(c[1]));
    }
    randData(e: any, t: any, n?: boolean): any {
        const o = this.get(t);
        const r = Utils_.getRandomRange(0, 100) <= o.powerRate;
        let i = o.normalEnemy;
        if (n || r) {
            i = o.bossEnemy;
        }
        return {
            id: t,
            propId: o.propId,
            upType: o.upType,
            upNumValue: this.getUpNumValue(t, e, r),
            enemy: i,
            isPowerEnemy: r,
        };
    }
    static get Instance(): _LegionRandConfig {
        if (!this._instance) {
            this._instance = new _LegionRandConfig();
        }
        return this._instance;
    }
}
