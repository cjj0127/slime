import _BaseParse from "./_BaseParse";
import NumberPlus from "../utils/NumberPlus";
// var a = e("_BaseParse"),
// s = e("Singleton"),
// c = e("NumberPlus"),
// l = e("Const"),
// u = cc._decorator,
// p = u.ccclass,
// f = (u.property, globalThis._),
// d = {
//     ATK: PROP_TYPE.ATK,
//     HP: PROP_TYPE.HP,
//     "HP Recovery": PROP_TYPE.HPRecovery,
//     ASPD: PROP_TYPE.ASPD,
//     "Critical Hit Chance": PROP_TYPE.CriticalHitChance,
//     "Critical Hit Damage": PROP_TYPE.CriticalHitDamage,
//     "Double Shot": PROP_TYPE.DoubleShot,
//     "Triple Shot": PROP_TYPE.TripleShot
// },
// h = function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "propLevel",
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
//         f.each(this.cfg,
//         function(e) {
//             e.props = {},
//             f.each(d,
//             function(t, n) {
//                 e.props[t] = c.default.decode(e[n]),
//                 delete e[n]
//             })
//         })
//     },
//     t.prototype.get = function(e, t) {
//         var n = f.get(this.cfg, t);
//         return f.get(n.props, e, "0")
//     },
//     n = i([p, s.Singleton], t)
// } (a.default);
// n.default = h
// import _BaseParse from "./_BaseParse";
// import Singleton from "./Singleton";
// import NumberPlus from "./NumberPlus";
// import { PROP_TYPE } from "./Const";
import { ENUM_PROP_TYPE } from "../../modules/common/Const";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
export const propMap = {
    ATK: ENUM_PROP_TYPE.ATK,
    HP: ENUM_PROP_TYPE.HP,
    "HP Recovery": ENUM_PROP_TYPE.HPRecovery,
    ASPD: ENUM_PROP_TYPE.ASPD,
    "Critical Hit Chance": ENUM_PROP_TYPE.CriticalHitChance,
    "Critical Hit Damage": ENUM_PROP_TYPE.CriticalHitDamage,
    "Double Shot": ENUM_PROP_TYPE.DoubleShot,
    "Triple Shot": ENUM_PROP_TYPE.TripleShot
};
@ccclass
export default class _PropLevelConfig extends _BaseParse {
    private static _instance: _PropLevelConfig = null;
    jsonName = "propLevel";
    get(propName, level) {
        const propLevel = _.get(this.cfg, level);
        return _.get(propLevel.props, propName, "0");
    }
    loaded() {
        //         f.each(this.cfg,
        //         function(e) {
        //             e.props = {},
        //             f.each(d,
        //             function(t, n) {
        //                 e.props[t] = c.default.decode(e[n]),
        //                 delete e[n]
        //             })
        //         })
        _.each(this.cfg, (e) => {
            e.props = {};
            _.each(propMap, function (propName, typeKey) {
                e.props[propName] = NumberPlus.decode(e[typeKey]);
                delete e[typeKey];
            });
        });
    }
    public static get Instance() {
        return this._instance || (this._instance = new _PropLevelConfig());
    }
}
