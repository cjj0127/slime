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
// var a = e("Const"),
// s = e("Singleton"),
// c = e("_BaseParse"),
// l = cc._decorator,
// u = l.ccclass,
// p = (l.property, globalThis._),
// f = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "const",
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
//     t.prototype.get = function(e) {
//         return this.cfg[e].value
//     },
//     t.prototype.loaded = function() {
//         var e = this;
//         p.each(this.cfg,
//         function(t, n) {
//             var o = t.value;
//             switch (t.valueType) {
//                 case "I":
//                     a.GameConst[n] = parseInt(o);
//                 break;
//                 case "IV":
//                     a.GameConst[n] = e.convertStrToNumberArr(o);
//             }
//         })
//     },
//     n = i([u, s.Singleton], t)
// } (c.default);
// n.default = f
// import * as Const from "Const";
// import Singleton from "Singleton";
// import _BaseParse from "_BaseParse";
// import {ccclass, property} from '@ccclass';
import { GameConst } from "../../modules/common/Const";
const { ccclass, property } = cc._decorator;
@ccclass
export default class _ConstConfig extends _BaseParse {
    private static _instance: _ConstConfig = null;
    jsonName: string = "const";
    convertStrToNumberArr(str: string): number[] {
        let arr = str.split(",");
        let result: number[] = [];
        for (let i = 0; i < arr.length; i++) {
            result.push(parseInt(arr[i]));
        }
        return result;
    }
    public get(e: string): any {
        return this.cfg[e].value;
    }
    public loaded(): void {
        for (let key in this.cfg) {
            let cfgObj = this.cfg[key];
            let cfgValue = cfgObj.value;
            switch (cfgObj.valueType) {
                case "I":
                    GameConst[key] = parseInt(cfgValue);
                    break;
                case "IV":
                    GameConst[key] = this.convertStrToNumberArr(cfgValue);
                    break;
            }
        }
    }
    public static get Instance(): _ConstConfig {
        if (_ConstConfig._instance == null) {
            _ConstConfig._instance = new _ConstConfig();
        }
        return _ConstConfig._instance;
    }
}
