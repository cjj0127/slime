import _BaseParse from "./_BaseParse";
// var a = e("Singleton"),
// s = e("IGuide"),
// c = e("_BaseParse"),
// l = cc._decorator,
// u = (l.ccclass, l.property, globalThis._,
// function(e) {
//     function t() {
//         var t = null !== e && e.apply(this, arguments) || this;
//         return t.jsonName = "guide",
//         t._newCfg = [],
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
//         Object.keys(this._cfg).forEach(function(t) {
//             var n = e._cfg[t],
//             o = new s.default;
//             o.id = n.id,
//             o.isStrict = 1 == n.isStrict,
//             o.type = n.type,
//             o.lockId = n.lockId,
//             o.stage = n.stage,
//             o.step = n.step,
//             o.findNodePosDelayTime = n.findNodePosDelayTime,
//             o.recoverStep = n.recoverStep,
//             o.text = n.text,
//             o.parentFullPath = n.parentFullPath,
//             o.command = JSON.parse(e.replace(n.command)),
//             o.verification = JSON.parse(e.replace(n.verification)),
//             o.precondition = JSON.parse(e.replace(n.precondition)),
//             o.postCondition = JSON.parse(e.replace(n.postCondition)),
//             o.conditions = [];
//             var r = JSON.parse(e.replace(n.conditions));
//             o.conditions.push(r),
//             e._newCfg.push(o)
//         })
//     },
//     t.prototype.replace = function(e) {
//         for (var t = "",
//         n = 0; n < e.length; n++)"'" == e[n] ? t += """: t += e[n];
//         return t
//     },
//     t.prototype.get = function(e) {
//         return this._cfg[e]
//     },
//     t.prototype.getCfg = function() {
//         return this._newCfg
//     },
//     n = i([a.Singleton], t)
// } (c.default));
// n.default = u
// import Singleton from 'Singleton';
// import IGuide from 'IGuide';
import IGuide from "../../modules/guide/IGuide";
const _: any = window["_"];
// import _BaseParse from '_BaseParse';
const { ccclass, property } = cc._decorator;
@ccclass
export default class _GuideConfig extends _BaseParse {
    private static _instance: _GuideConfig = null;
    private _newCfg: Array<IGuide> = [];
    jsonName: string = 'guide';
    public get(key: any): any {
        return this._cfg[key];
    }
    public getCfg(): Array<IGuide> {
        return this._newCfg;
    }
    public loaded(): void {
        _.each(this._cfg, (n: any) => {
            let o = new IGuide();
            o.id = n.id;
            o.isStrict = (1 == n.isStrict);
            o.type = n.type;
            o.lockId = n.lockId;
            o.stage = n.stage;
            o.step = n.step;
            o.findNodePosDelayTime = n.findNodePosDelayTime;
            o.recoverStep = n.recoverStep;
            o.text = n.text;
            o.parentFullPath = n.parentFullPath;
            o.command = JSON.parse(this.replace(n.command));
            o.verification = JSON.parse(this.replace(n.verification));
            o.precondition = JSON.parse(this.replace(n.precondition));
            o.postCondition = JSON.parse(this.replace(n.postCondition));
            o.conditions = [];
            let r = JSON.parse(this.replace(n.conditions));
            o.conditions.push(r);
            this._newCfg.push(o);
        });
    }
    private replace(str: string): string {
        let result = "";
        for (let i = 0; i < str.length; i++) {
            if (str[i] == "'") {
                result += '"';
            }
            else {
                result += str[i];
            }
        }
        return result;
    }
    public static get Instance(): _GuideConfig {
        if (this._instance == null) {
            this._instance = new _GuideConfig();
        }
        return this._instance;
    }
}
