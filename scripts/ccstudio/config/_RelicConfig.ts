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
//         return t.jsonName = "relic",
//         t.typeIds = {},
//         t.types = [],
//         t.effectSkillId = {},
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
//         var e = this,
//         t = [];
//         p.each(this.cfg,
//         function(n) {
//             n.owned = s.default.decode(n.owned),
//             n.ownedUP = s.default.decode(n.ownedUP);
//             var o = p.get(e.typeIds, n.type, []);
//             o.push(n.id),
//             p.set(e.typeIds, n.type, o),
//             t.push(n.type),
//             n.skillId > 0 && (e.effectSkillId[n.skillId] = n.id)
//         }),
//         this.types = p.sortedUniq(t)
//     },
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     t.prototype.getTypes = function() {
//         return this.types
//     },
//     t.prototype.getTypeIds = function(e) {
//         return this.typeIds[e]
//     },
//     t.prototype.getType = function(e) {
//         return this.get(e).type
//     },
//     t.prototype.getSkillEffectId = function(e) {
//         return this.effectSkillId[e]
//     },
//     t.prototype.getEffectSkill = function(e) {
//         return this.get(e).skillId
//     },
//     n = i([u, a.Singleton], t)
// } (c.default);
// n.default = f
// import Singleton from 'Singleton';
// import NumberPlus from 'NumberPlus';
import NumberPlus from "../utils/NumberPlus";
// import _BaseParse from '_BaseParse';
const { ccclass, property } = cc._decorator;
const _ = window['_'];
@ccclass
export default class _RelicConfig extends _BaseParse {
    private static _instance: _RelicConfig = null;
    public effectSkillId: {
        [key: number]: number;
    } = {};
    public jsonName: string = "relic";
    public typeIds: {
        [key: string]: number[];
    } = {};
    public types: string[] = [];
    public get(e: number): any {
        return this.cfg[e];
    }
    public getEffectSkill(e: number): number {
        return this.get(e).skillId;
    }
    public getSkillEffectId(e: number): number {
        return this.effectSkillId[e];
    }
    public getType(e: number): string {
        return this.get(e).type;
    }
    public getTypeIds(e: any): number[] {
        return this.typeIds[e];
    }
    public getTypes(): string[] {
        return this.types;
    }
    public loaded(): void {
        const t: any[] = [];
        _.each(this.cfg, (n) => {
            n.owned = NumberPlus.decode(n.owned),
                n.ownedUP = NumberPlus.decode(n.ownedUP);
            const o = _.get(this.typeIds, n.type, []);
            o.push(n.id);
            _.set(this.typeIds, n.type, o);
            t.push(n.type);
            if (n.skillId > 0) {
                this.effectSkillId[n.skillId] = n.id;
            }
        });
        this.types = _.sortedUniq(t);
    }
    public static get Instance(): _RelicConfig {
        if (!this._instance) {
            this._instance = new _RelicConfig();
        }
        return this._instance;
    }
}
