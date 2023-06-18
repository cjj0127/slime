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
//         return t.jsonName = "trait",
//         t.qualityProps = {},
//         t.props = {},
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
//             var n = u.get(e.qualityProps, t.quality, []);
//             n.push(t.id),
//             u.set(e.qualityProps, t.quality, n);
//             var o = u.get(e.props, t.propType, []);
//             o.push(t.id),
//             u.set(e.props, t.propType, o)
//         })
//     },
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     t.prototype.getQuailtyCfgs = function(e) {
//         return this.qualityProps[e]
//     },
//     t.prototype.getPropCfgs = function(e) {
//         return this.props[e]
//     },
//     t.prototype.getAllProps = function() {
//         return u.keys(this.props)
//     },
//     t.prototype.random = function(e) {
//         var t = this.getQuailtyCfgs(e);
//         return u.shuffle(u.clone(t))[0]
//     },
//     n = i([l, a.Singleton], t)
// } (s.default);
// n.default = p
// import Singleton from 'Singleton';
import _BaseParse from "./_BaseParse";
const u: any = window["_"];
// import _BaseParse from '_BaseParse';
const { ccclass, property } = cc._decorator;
@ccclass
export default class _TraitConfig extends _BaseParse {
    private static _instance: _TraitConfig = null;
    jsonName = "trait";
    props = {};
    qualityProps = {};
    get(e) {
        return this.cfg[e];
    }
    getAllProps() {
        return u.keys(this.props);
    }
    getPropCfgs(e) {
        return this.props[e];
    }
    getQuailtyCfgs(e) {
        return this.qualityProps[e];
    }
    loaded() {
        u.each(this.cfg, (t) => {
            const quality = t.quality;
            const id = t.id;
            const propType = t.propType;
            let n = u.get(this.qualityProps, quality, []);
            n.push(id);
            u.set(this.qualityProps, quality, n);
            let o = u.get(this.props, propType, []);
            o.push(id);
            u.set(this.props, propType, o);
        });
    }
    random(e) {
        const t = this.getQuailtyCfgs(e);
        return u.shuffle(u.clone(t))[0];
    }
    public static get Instance(): _TraitConfig {
        if (_TraitConfig._instance == null) {
            _TraitConfig._instance = new _TraitConfig();
        }
        return _TraitConfig._instance;
    }
}
