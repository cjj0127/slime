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
// l = (c.ccclass, c.property, globalThis._),
// u = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "collection",
//         t.typeOfCollections = {},
//         t.symbolToCollection = {},
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
//         l.each(this.cfg,
//         function(t) {
//             var n = t.type,
//             o = t.ids,
//             r = l.get(e.typeOfCollections, n, []);
//             r.push(t),
//             l.set(e.typeOfCollections, n, r);
//             var i = l.get(e.symbolToCollection, n, {});
//             l.set(e.symbolToCollection, n, i),
//             l.each(o,
//             function(e) {
//                 var n = l.get(i, e, []);
//                 n.push(t.id),
//                 l.set(i, e, n)
//             })
//         })
//     },
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     t.prototype.getTypeCollections = function(e) {
//         return l.get(this.typeOfCollections, e, [])
//     },
//     t.prototype.getSymbolCollections = function(e, t) {
//         var n = e + "." + t;
//         return l.get(this.symbolToCollection, n, [])
//     },
//     n = i([a.Singleton], t)
// } (s.default);
// n.default = u
// import Singleton from "Singleton";
// import _BaseParse from "_BaseParse";
import _BaseParse from "./_BaseParse";
const { ccclass, property } = cc._decorator;
const _ = window["_"];
@ccclass
export default class _CollectionConfig extends _BaseParse {
    static _instance: _CollectionConfig = null;
    jsonName: string = "collection";
    symbolToCollection: {
        [key: string]: any;
    } = {};
    typeOfCollections: {
        [key: string]: any;
    } = {};
    get(e: any) {
        return this.cfg[e];
    }
    getSymbolCollections(e: any, t: string) {
        let n = e + "." + t;
        return _.get(this.symbolToCollection, n, []);
    }
    getTypeCollections(e: string) {
        return _.get(this.typeOfCollections, e, []);
    }
    loaded() {
        let self = this;
        _.each(this.cfg, function (t: any) {
            let n = t.type, o = t.ids, r = _.get(self.typeOfCollections, n, []);
            r.push(t);
            _.set(self.typeOfCollections, n, r);
            let i = _.get(self.symbolToCollection, n, {});
            _.set(self.symbolToCollection, n, i);
            _.each(o, function (e: any) {
                let n = _.get(i, e, []);
                n.push(t.id);
                _.set(i, e, n);
            });
        });
    }
    static get Instance() {
        return _CollectionConfig._instance || (_CollectionConfig._instance = new _CollectionConfig);
    }
}
