// var a = e("Singleton"),
// s = e("_BaseParse"),
// c = cc._decorator,
// l = c.ccclass,
// u = (c.property, globalThis._),
// p = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "building",
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
//     t.prototype.getBuildByUnlockLevel = function(e) {
//         var t = null;
//         return u.forEach(this.cfg,
//         function(n) {
//             n.unlockLevel == e && (t = n)
//         }),
//         t
//     },
//     n = i([l, a.Singleton], t)
// } (s.default);
// n.default = p
// "import Singleton from "Singleton";
// import _BaseParse from "_BaseParse";
// import {ccclass, property} from cc._decorator;
import _BaseParse from "./_BaseParse";
const { ccclass, property } = cc._decorator;
@ccclass
export default class _BuildingConfig extends _BaseParse {
    private static _instance: _BuildingConfig = null;
    jsonName: string = "building";
    public get(name: any): any {
        return this.cfg[name];
    }
    public getBuildByUnlockLevel(level: number): any {
        let build = null;
        for (const name in this.cfg) {
            if (this.cfg[name].unlockLevel == level) {
                build = this.cfg[name];
                break;
            }
        }
        return build;
    }
    constructor() {
        super();
    }
    public static get Instance(): _BuildingConfig {
        if (!_BuildingConfig._instance) {
            _BuildingConfig._instance = new _BuildingConfig();
        }
        return _BuildingConfig._instance;
    }
}
