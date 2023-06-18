// var a = e("Singleton"),
// s = e("_BaseParse"),
// c = cc._decorator,
// l = c.ccclass,
// u = (c.property, globalThis._),
// p = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "bossRush",
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
//         var e = 1;
//         u.each(this.cfg,
//         function(t) {
//             t.isBoss = !0,
//             t.id = e++
//         })
//     },
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     n = i([l, a.Singleton], t)
// } (s.default);
// n.default = p
// import Singleton from "Singleton";
import _BaseParse from "./_BaseParse";
// import _BaseParse from "_BaseParse";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class _BossRushConfig extends _BaseParse {
    private static _instance: _BossRushConfig = null;
    jsonName: string = "bossRush";
    get(e: number) {
        return this.cfg[e];
    }
    loaded() {
        let e = 1;
        _.each(this.cfg, (t) => {
            t.isBoss = true;
            t.id = e++;
        });
    }
    static get Instance(): _BossRushConfig {
        if (!_BossRushConfig._instance) {
            _BossRushConfig._instance = new _BossRushConfig();
        }
        return _BossRushConfig._instance;
    }
}
