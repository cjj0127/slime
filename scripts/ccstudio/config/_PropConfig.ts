import _BaseParse from "./_BaseParse";
// var a = e("Singleton"),
// s = e("Language"),
// c = e("_BaseParse"),
// l = cc._decorator,
// u = l.ccclass,
// p = (l.property,
// function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "prop",
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
//     t.prototype.getDesc = function(e, t) {
//         var n = this.get(e);
//         return Language.Instance.getLangByID(n.desc).replace("%{value}", "" + t)
//     },
//     n = i([u, a.Singleton], t)
// } (c.default));
// n.default = p
// import Singleton from "Singleton";
// import Language from "Language";
import LanMgr from "../../modules/common/Language";
// import _BaseParse from "_BaseParse";
const { ccclass, property } = cc._decorator;
@ccclass
export default class _PropConfig extends _BaseParse {
    static _instance: _PropConfig = null;
    jsonName = "prop";
    get(e: any): any {
        return this.cfg[e];
    }
    getDesc(e: any, t: any): string {
        const n = this.get(e);
        return LanMgr.Instance.getLangByID(n.desc).replace("%{value}", t);
    }
    static get Instance(): _PropConfig {
        if (_PropConfig._instance == null) {
            _PropConfig._instance = new _PropConfig();
        }
        return _PropConfig._instance;
    }
}
