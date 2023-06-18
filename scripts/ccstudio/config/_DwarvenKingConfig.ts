import _BaseParse from "./_BaseParse";
// var a = e("Singleton"),
// s = e("NumberPlus"),
// c = e("_BaseParse"),
// l = cc._decorator,
// u = l.ccclass,
// p = (l.property, globalThis._),
// f = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "dwarvenKing",
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
//         p.each(this.cfg,
//         function(t) {
//             t.hp = s.default.decode(t.hp),
//             t.atkMulit = s.default.decode(t.atkMulit),
//             t.qualities = [],
//             t.nums = [],
//             p.each(t.reward,
//             function(n) {
//                 var o = e.convertStrToNumberArr(n, "|");
//                 t.qualities.push(o[0]),
//                 t.nums.push(o[1])
//             }),
//             delete t.reward
//         })
//     },
//     t.prototype.get = function(e) {
//         return this.cfg[e]
//     },
//     t.prototype.getLevel = function(e) {
//         for (var t = 0; t < Object.keys(this.cfg).length; t++) {
//             var n = this.get(t + 1);
//             if (n && s.default.sub(n.hp, e) > 0) return n.id - 1
//         }
//         return 1
//     },
//     n = i([u, a.Singleton], t)
// } (c.default);
// n.default = f
// import Singleton from "./Singleton";
// import NumberPlus from "./NumberPlus";
import NumberPlus from "../utils/NumberPlus";
// import _BaseParse from "./_BaseParse";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class _DwarvenKingConfig extends _BaseParse {
    private static _instance: _DwarvenKingConfig = null;
    jsonName: string = "dwarvenKing";
    get(e: number) {
        return this.cfg[e];
    }
    getLevel(e: any) {
        for (let t = 0; t < Object.keys(this.cfg).length; t++) {
            const n = this.get(t + 1);
            if (n && NumberPlus.sub(n.hp, e) > 0)
                return n.id - 1;
        }
        return 1;
    }
    loaded() {
        super.loaded();
        _.each(this.cfg, (t: any) => {
            t.hp = NumberPlus.decode(t.hp);
            t.atkMulit = NumberPlus.decode(t.atkMulit);
            t.qualities = [];
            t.nums = [];
            _.each(t.reward, (n: any) => {
                const o = this.convertStrToNumberArr(n, "|");
                t.qualities.push(o[0]);
                t.nums.push(o[1]);
            });
            delete t.reward;
        });
    }
    public static get Instance(): _DwarvenKingConfig {
        if (!_DwarvenKingConfig._instance) {
            _DwarvenKingConfig._instance = new _DwarvenKingConfig();
        }
        return _DwarvenKingConfig._instance;
    }
}
