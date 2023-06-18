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
// var a = e("_BaseParse"),
// s = e("Singleton"),
// c = e("Const"),
// l = cc._decorator,
// u = l.ccclass,
// p = (l.property, globalThis._),
// f = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "skill",
//         t.qualityCfgs = [],
//         t.typeSkills = {},
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
//         var e, t = this;
//         p.each(this.cfg,
//         function(n) {
//             if (n.type == c.SKILL_TYPE.Summon) {
//                 e && (e.type == n.type ? e.next = n.id: e.next = -1),
//                 e = n;
//                 var o = n.quality,
//                 r = p.get(t.qualityCfgs, o, []);
//                 r.push(n),
//                 p.set(t.qualityCfgs, o, r)
//             }
//             var i = p.get(t.typeSkills, n.type, []);
//             i.push(n),
//             p.set(t.typeSkills, n.type, i)
//         }),
//         e && (e.next = -1)
//     },
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     t.prototype.getQualitySkills = function(e) {
//         return p.get(this.qualityCfgs, e, [])
//     },
//     t.prototype.getTypeSkills = function(e) {
//         return p.get(this.typeSkills, e, [])
//     },
//     t.prototype.getAllSkillId = function() {
//         var e = [];
//         return p.each(this.cfg,
//         function(t) {
//             2 == t.type && e.push(t.id)
//         }),
//         e
//     },
//     n = i([u, s.Singleton], t)
// } (a.default);
// n.default = f
// import _BaseParse from '_BaseParse';
// import Singleton from 'Singleton';
import { E_SKILL_TYPE } from "../../modules/common/Const";
const _: any = window["_"];
// import { SKILL_TYPE } from 'Const';
const { ccclass, property } = cc._decorator;
@ccclass
export default class _SkillConfig extends _BaseParse {
    static _inst: _SkillConfig = null;
    jsonName: string = "skill";
    private qualityCfgs: any[] = [];
    private typeSkills: {
        [type: number]: any[];
    } = {};
    public get(e: any): any {
        return this.cfg[e];
    }
    public getAllSkillId(): number[] {
        let ids: number[] = [];
        _.each(this.cfg, (cfg: any) => {
            if (cfg.type == 2) {
                ids.push(cfg.id);
            }
        });
        return ids;
    }
    public getQualitySkills(e: number): any[] {
        return this.qualityCfgs[e] || [];
    }
    public getTypeSkills(e: number): any[] {
        return this.typeSkills[e] || [];
    }
    public loaded(): void {
        let summonNext: any = null;
        _.each(this.cfg, (cfg: any) => {
            if (cfg.type == E_SKILL_TYPE.Summon) {
                if (summonNext) {
                    if (summonNext.type == cfg.type) {
                        summonNext.next = cfg.id;
                    }
                    else {
                        summonNext.next = -1;
                    }
                }
                summonNext = cfg;
                let quality = cfg.quality;
                let qualityCfgs = this.qualityCfgs[quality] || [];
                qualityCfgs.push(cfg);
                this.qualityCfgs[quality] = qualityCfgs;
            }
            let key = cfg.type;
            let skills = this.typeSkills[key] || [];
            skills.push(cfg);
            this.typeSkills[key] = skills;
        });
        if (summonNext) {
            summonNext.next = -1;
        }
    }
    static get Instance(): _SkillConfig {
        if (!_SkillConfig._inst) {
            _SkillConfig._inst = new _SkillConfig();
        }
        return _SkillConfig._inst;
    }
}
