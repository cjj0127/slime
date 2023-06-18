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
// s = e("MailMgr"),
// c = e("_BaseParse"),
// l = cc._decorator,
// u = (l.ccclass, l.property, globalThis._),
// p = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "mailbox",
//         t.ids = [],
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
//         var e = u.keys(this.cfg);
//         this.ids = u.map(e, Number),
//         s.default.Instance.init()
//     },
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     t.prototype.getAll = function() {
//         return this.cfg
//     },
//     n = i([a.Singleton], t)
// } (c.default);
// n.default = p
// import Singleton from "Singleton";
// import MailMgr from "MailMgr";
import MailMgr from "../../modules/mail/MailMgr";
// import _BaseParse from "_BaseParse";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class _MailConfig extends _BaseParse {
    private static _instance: _MailConfig = null;
    ids = [];
    jsonName = "mailbox";
    get(e) {
        return this.cfg[e];
    }
    getAll() {
        return this.cfg;
    }
    loaded() {
        let e = Object.keys(this.cfg);
        this.ids = _.map(e, Number);
        MailMgr.Instance.init();
        //         var e = u.keys(this.cfg);
        //         this.ids = u.map(e, Number),
        //         s.default.Instance.init()
    }
    static get Instance(): _MailConfig {
        if (!this._instance) {
            this._instance = new _MailConfig();
        }
        return this._instance;
    }
}
