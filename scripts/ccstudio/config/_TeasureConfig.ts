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
//         return t.jsonName = "treasure",
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
//             n.ownedHp = s.default.decode(n.ownedHp),
//             n.ownedHpUP = s.default.decode(n.ownedHpUP),
//             n.ownedAtk = s.default.decode(n.ownedAtk),
//             n.ownedAtkUP = s.default.decode(n.ownedAtkUP);
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
//     t.prototype.getTypeById = function(e) {
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
// import { Singleton } from "Singleton";
// import { NumberPlus } from "NumberPlus";
// import { _BaseParse } from "_BaseParse";
import NumberPlus from "../utils/NumberPlus";
const p: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class _TeasureConfig extends _BaseParse {
    private static _instance: _TeasureConfig;
    effectSkillId: any = {};
    jsonName: string = "treasure";
    typeIds: any = {};
    types: any[] = [];
    get(e: number) {
        return this.cfg[e];
    }
    getEffectSkill(e: number) {
        return this.get(e).skillId;
    }
    getSkillEffectId(e: number) {
        return this.effectSkillId[e];
    }
    getTypeById(e: number) {
        return this.get(e).type;
    }
    getTypeIds(e: any) {
        return this.typeIds[e];
    }
    getTypes() {
        return this.types;
    }
    loaded() {
        let self = this;
        let t: any[] = [];
        p.each(this.cfg, function (n) {
            n.ownedHp = NumberPlus.decode(n.ownedHp);
            n.ownedHpUP = NumberPlus.decode(n.ownedHpUP);
            n.ownedAtk = NumberPlus.decode(n.ownedAtk);
            n.ownedAtkUP = NumberPlus.decode(n.ownedAtkUP);
            let o = p.get(self.typeIds, n.type, []);
            o.push(n.id);
            p.set(self.typeIds, n.type, o);
            t.push(n.type);
            if (n.skillId > 0) {
                self.effectSkillId[n.skillId] = n.id;
            }
        });
        this.types = p.sortedUniq(t);
    }
    static get Instance() {
        if (this._instance == null) {
            this._instance = new _TeasureConfig();
        }
        return this._instance;
    }
}
