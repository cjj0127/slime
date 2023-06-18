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
//         return t.jsonName = "partner",
//         t.qualityCfgs = [],
//         t.qualityUp = {},
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
//     t.prototype.loaded = function() {
//         var e, t = this;
//         p.each(this.cfg,
//         function(n) {
//             e && (e.next = n.id),
//             e = n,
//             n.atk = s.default.decode(n.atk),
//             n.atkUP = s.default.decode(n.atkUP);
//             var o = n.quality,
//             r = p.get(t.qualityCfgs, o, []);
//             r.push(n),
//             p.set(t.qualityCfgs, o, r);
//             var i = p.get(t.qualityUp, o, 0);
//             p.set(t.qualityUp, o, i + n.rate)
//         }),
//         e && (e.next = -1)
//     },
//     t.prototype.getQualityPartners = function(e) {
//         return p.get(this.qualityCfgs, e, [])
//     },
//     t.prototype.getQualityRateUp = function(e) {
//         return p.get(this.qualityUp, e, 0)
//     },
//     t.prototype.getAllPartnerId = function() {
//         var e = [];
//         return p.each(this.cfg,
//         function(t) {
//             e.push(t.id)
//         }),
//         e
//     },
//     n = i([u, a.Singleton], t)
// } (c.default);
// n.default = f
// import Singleton from 'Singleton';
// import NumberPlus from 'NumberPlus';
import NumberPlus from "../utils/NumberPlus";
const _: any = window["_"];
// import _BaseParse from '_BaseParse';
const { ccclass, property } = cc._decorator;
@ccclass
export default class _PartnerConfig extends _BaseParse {
    private static _instance: _PartnerConfig;
    jsonName = "partner";
    // private cfg: any;
    private qualityCfgs: any[] = [];
    private qualityUp: {
        [key: number]: number;
    } = {};
    public get(e: any): any {
        return this.cfg[e];
    }
    public getAllPartnerId(): any[] {
        const e: any[] = [];
        Object.values(this.cfg).forEach((t: any) => {
            e.push(t.id);
        });
        return e;
    }
    public getQualityPartners(e: any): any[] {
        return this.qualityCfgs[e] || [];
    }
    public getQualityRateUp(e: any): number {
        return this.qualityUp[e] || 0;
    }
    public loaded(): void {
        let last: any = null;
        _.values(this.cfg).forEach((n: any) => {
            if (last) {
                last.next = n.id;
            }
            last = n;
            n.atk = NumberPlus.decode(n.atk);
            n.atkUP = NumberPlus.decode(n.atkUP);
            const o = n.quality;
            const r = this.qualityCfgs[o] || [];
            r.push(n);
            this.qualityCfgs[o] = r;
            const i = this.qualityUp[o] || 0;
            this.qualityUp[o] = i + n.rate;
        });
        if (last) {
            last.next = -1;
        }
    }
    public static get Instance(): _PartnerConfig {
        if (!this._instance) {
            this._instance = new _PartnerConfig();
        }
        return this._instance;
    }
}
