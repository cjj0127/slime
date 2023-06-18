import _BaseParse from "./_BaseParse";
// var a = e("Singleton"),
//     s = e("NumberPlus"),
//     c = e("_BaseParse"),
//     l = cc._decorator,
//     u = l.ccclass,
//     p = (l.property, globalThis._),
//     f = function (e) {
//         function t() {
//             var t = null !== e && e.apply(this, arguments) || this;
//             return t.jsonName = "gear",
//                 t.qualityCfgs = [],
//                 t.qualityRateUp = {},
//                 t.typeCfgs = {},
//                 t.typeWithQualityCfgs = {},
//                 t.typeWithQualityRateUp = {},
//                 t
//         }
//         var n;
//         return r(t, e),
//             n = t,
//             Object.defineProperty(t, "Instance", {
//                 get: function () {
//                     return a.Singleton.get(n)
//                 },
//                 enumerable: !1,
//                 configurable: !0
//             }),
//             t.prototype.loaded = function () {
//                 var e, t = this;
//                 p.each(this.cfg,
//                     function (n) {
//                         e && (e.type == n.type ? e.next = n.id : e.next = -1),
//                             e = n;
//                         var o = n.quality;
//                         n.equip = NumberPlus.decode(n.equip),
//                             n.equipUP = NumberPlus.decode(n.equipUP);
//                         var r = p.get(t.qualityCfgs, o, []);
//                         r.push(n),
//                             p.set(t.qualityCfgs, o, r);
//                         var i = p.get(t.qualityRateUp, o, 0);
//                         p.set(t.qualityRateUp, o, i + n.rate);
//                         var a = p.get(t.typeCfgs, n.type, []);
//                         a.push(n),
//                             p.set(t.typeCfgs, n.type, a);
//                         var c = p.get(t.typeWithQualityCfgs, [n.type, n.quality], []);
//                         c.push(n),
//                             p.set(t.typeWithQualityCfgs, [n.type, n.quality], c);
//                         var l = p.get(t.typeWithQualityRateUp, [n.type, n.quality], 0);
//                         p.set(t.typeWithQualityRateUp, [n.type, n.quality], l + n.rate)
//                     }),
//                     e && (e.next = -1)
//             },
//             t.prototype.get = function (e) {
//                 return this.cfg[e]
//             },
//             t.prototype.getGears = function (e) {
//                 return this.typeCfgs[e]
//             },
//             t.prototype.getGearsWithQuality = function (e, t) {
//                 return p.get(this.typeWithQualityCfgs, [e, t], [])
//             },
//             t.prototype.getGearsWithQualityUp = function (e, t) {
//                 return p.get(this.typeWithQualityRateUp, [e, t], 0)
//             },
//             t.prototype.getQualityGears = function (e) {
//                 return p.get(this.qualityCfgs, e, [])
//             },
//             t.prototype.getQualityRateUp = function (e) {
//                 return p.get(this.qualityRateUp, e, 0)
//             },
//             t.prototype.getAllGearId = function () {
//                 var e = [];
//                 return p.each(this.cfg,
//                     function (t) {
//                         e.push(t.id)
//                     }),
//                     e
//             },
//             n = i([u, a.Singleton], t)
//     }(c.default);
import NumberPlus from "../utils/NumberPlus";
// n.default = f
const _: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class _GearConfig extends _BaseParse {
    private static _instance: _GearConfig = null;
    jsonName = "gear";
    qualityCfgs = [];
    qualityRateUp = {};
    typeCfgs = {};
    typeWithQualityCfgs = {};
    typeWithQualityRateUp = {};
    get(e) {
        return this.cfg[e];
    }
    getAllGearId() {
        const ids = [];
        for (const gear of this.cfg) {
            ids.push(gear.id);
        }
        return ids;
    }
    getGears(e) {
        return this.typeCfgs[e];
    }
    getGearsWithQuality(e, t) {
        return _.get(this.typeWithQualityCfgs, [e, t], []);
    }
    getGearsWithQualityUp(e, t) {
        return _.get(this.typeWithQualityRateUp, [e, t], 0);
    }
    getQualityGears(e) {
        return _.get(this.qualityCfgs, e, []);
    }
    getQualityRateUp(e) {
        return _.get(this.qualityRateUp, e, 0);
    }
    loaded() {
        let prevGear = null;
        _.each(this.cfg, (gear) => {
            if (prevGear && prevGear.type == gear.type) {
                prevGear.next = gear.id;
            }
            else {
                gear.next = -1;
            }
            prevGear = gear;
            const quality = gear.quality;
            gear.equip = NumberPlus.decode(gear.equip);
            gear.equipUP = NumberPlus.decode(gear.equipUP);
            const qualityCfgs = _.get(this.qualityCfgs, quality, []);
            qualityCfgs.push(gear);
            _.set(this.qualityCfgs, quality, qualityCfgs);
            const qualityRateUp = _.get(this.qualityRateUp, quality, 0);
            _.set(this.qualityRateUp, quality, qualityRateUp + gear.rate);
            const typeCfgs = _.get(this.typeCfgs, gear.type, []);
            typeCfgs.push(gear);
            _.set(this.typeCfgs, gear.type, typeCfgs);
            const typeWithQualityCfgs = _.get(this.typeWithQualityCfgs, [gear.type, quality], []);
            typeWithQualityCfgs.push(gear);
            _.set(this.typeWithQualityCfgs, [gear.type, quality], typeWithQualityCfgs);
            const typeWithQualityRateUp = _.get(this.typeWithQualityRateUp, [gear.type, quality], 0);
            _.set(this.typeWithQualityRateUp, [gear.type, quality], typeWithQualityRateUp + gear.rate);
        });
        if (prevGear) {
            prevGear.next = -1;
        }
    }
    public static get Instance(): _GearConfig {
        if (this._instance == null) {
            this._instance = new _GearConfig();
        }
        return this._instance;
    }
}
