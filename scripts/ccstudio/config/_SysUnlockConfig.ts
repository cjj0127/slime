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
// u = (c.property,
// function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "levelUnlock",
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
//     t.prototype.getAllType = function() {
//         var e = [];
//         for (var t in this.cfg) {
//             var n = this.cfg[t];
//             e.push(n.type)
//         }
//         return e
//     },
//     t.prototype.getUnlockDataByUnlockType = function(e, t) {
//         var n = [];
//         for (var o in this.cfg) {
//             var r = this.cfg[o];
//             r.unlockType == e && r.unlockValue == t && n.push(r.id)
//         }
//         return n
//     },
//     t.prototype.getAllUnlockDataByUnlockType = function(e, t) {
//         var n = [];
//         for (var o in this.cfg) {
//             var r = this.cfg[o];
//             r.unlockType == e && t >= r.unlockValue && n.push(r.id)
//         }
//         return n
//     },
//     t.prototype.getUnlockDataBySysType = function(e) {
//         for (var t in this.cfg) {
//             var n = this.cfg[t];
//             if (n.type == e) return n
//         }
//         return null
//     },
//     t.prototype.getUnlockDataBySysTypeAndValue = function(e, t) {
//         var n = [];
//         for (var o in this.cfg) {
//             var r = this.cfg[o];
//             r.type == e && t >= Number(r.unlockValue) && n.push(r.id)
//         }
//         return n
//     },
//     n = i([l, a.Singleton], t)
// } (s.default));
// n.default = u
// import Singleton from "Singleton";
import _BaseParse from "./_BaseParse";
// import _BaseParse from "_BaseParse";
const { ccclass, property } = cc._decorator;
export default class _SysUnlockConfig extends _BaseParse {
    // Other methods and properties of the original code go here
    private static _instance: _SysUnlockConfig = null;
    jsonName = "levelUnlock";
    get(e: string) {
        return this.cfg[e];
    }
    getAllType() {
        let e = [];
        for (let t in this.cfg) {
            let n = this.cfg[t];
            e.push(n.type);
        }
        return e;
    }
    getAllUnlockDataByUnlockType(e: any, t: any) {
        let n = [];
        for (let o in this.cfg) {
            let r = this.cfg[o];
            if (r.unlockType == e && t >= r.unlockValue) {
                n.push(r.id);
            }
        }
        return n;
    }
    getUnlockDataBySysType(e: any) {
        for (let t in this.cfg) {
            let n = this.cfg[t];
            if (n.type == e) {
                return n;
            }
        }
        return null;
    }
    getUnlockDataBySysTypeAndValue(e: any, t: any) {
        let n = [];
        for (let o in this.cfg) {
            let r = this.cfg[o];
            if (r.type == e && t >= Number(r.unlockValue)) {
                n.push(r.id);
            }
        }
        return n;
    }
    getUnlockDataByUnlockType(e: any, t: any) {
        let n = [];
        for (let o in this.cfg) {
            let r = this.cfg[o];
            if (r.unlockType == e && r.unlockValue == t) {
                n.push(r.id);
            }
        }
        return n;
    }
    public static get Instance(): _SysUnlockConfig {
        if (_SysUnlockConfig._instance == null) {
            _SysUnlockConfig._instance = new _SysUnlockConfig();
        }
        return _SysUnlockConfig._instance;
    }
}
