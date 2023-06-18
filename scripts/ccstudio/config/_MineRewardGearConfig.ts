import _GearConfig from "./_GearConfig";
import _BaseParse from "./_BaseParse";
import Utils_ from "../utils/Utils";
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
// var a = e("Const"),
// s = e("Singleton"),
// c = e("Utils"),
// l = e("_GearConfig"),
// u = e("_BaseParse"),
// p = cc._decorator,
// f = p.ccclass,
// d = (p.property, globalThis._),
// h = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "mineRewardGear",
//         t
//     }
//     var n;
//     return r(t, e),
//     n = t,
//     Object.defineProperty(t, "Instance", {
//         get: function() {
//             return s.Singleton.get(n)
//         },
//         enumerable: !1,
//         configurable: !0
//     }),
//     t.prototype.loaded = function() {
//         d.each(this.cfg,
//         function(e) {
//             e.widgets = d.values(e)
//         })
//     },
//     t.prototype.get = function(e) {
//         var t = d.keys(this.cfg),
//         n = t[d.findIndex(t,
//         function(t) {
//             return e <= parseInt(t)
//         })];
//         return d.isNil(n) && (n = d.last(t)),
//         this.cfg[n]
//     },
//     t.prototype.randomReward = function(e) {
//         var t = this.get(e),
//         n = Utils.getRandIndex(t.widgets) + 1,
//         o = l.default.Instance.getGearsWithQuality(a.GEAR_TYPE.WEAPON, n),
//         r = c.default.getElementByWeight(o,
//         function(e) {
//             return e.rate
//         });
//         return r ? r.id: (cc.error("未找到类型的武器", e, o), null)
//     },
//     n = i([f, s.Singleton], t)
// } (u.default);
// n.default = h
// import Const from "Const";
// import Singleton from "Singleton";
// import Utils from "Utils";
// import _GearConfig from "_GearConfig";
// import _BaseParse from "_BaseParse";
import { E_GEAR_TYPE } from "../../modules/common/Const";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class _MineRewardGearConfig extends _BaseParse {
    private static _instance: _MineRewardGearConfig = null;
    jsonName = "mineRewardGear";
    public get(e: number) {
        const t = Object.keys(this.cfg);
        const n = t.find((t) => e <= parseInt(t)) || t[t.length - 1];
        return this.cfg[n];
    }
    public loaded() {
        _.each(this.cfg, (e) => {
            e.widgets = Object.values(e);
        });
    }
    public randomReward(e: number): number {
        const t = this.get(e);
        const n = Utils_.getRandIndex_(t.widgets) + 1;
        const o = _GearConfig.Instance.getGearsWithQuality(E_GEAR_TYPE.WEAPON, n);
        const r: any = Utils_.getItemByWeight(o, (e) => e.rate);
        if (r) {
            return r.id;
        }
        else {
            cc.error("未找到类型的武器", e, o);
            return null;
        }
    }
    public static get Instance() {
        if (!this._instance) {
            this._instance = new _MineRewardGearConfig();
        }
        return this._instance;
    }
}
