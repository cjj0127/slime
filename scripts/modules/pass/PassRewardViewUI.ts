import { E_SUMMON_TYPE } from "../common/Const";
import AsyncQueueTool from "../../ccstudio/utils/AsyncQueueTool";
import _GearConfig from "../../ccstudio/config/_GearConfig";
import ISummonResultView from "../shop/ISummonResultView";
import AdsModel from "../../ccstudio/data/AdsModel";
import Model from "../../ccstudio/data/Model";
import _PartnerConfig from "../../ccstudio/config/_PartnerConfig";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
const { ccclass, property } = cc._decorator;
@ccclass
export default class PassRewardViewUI extends ISummonResultView {
    public createItem(e: any) {
        const t = this.getCfg(e.type, e.id);
        return this.addItem(t.quality, t.icon, t.name, e.id, e.type);
    }
    public onEnable() {
        super.onEnable();
        Model.ad.hideBanner();
    }
    playResults() {
        var e = this;
        this.layout.type = cc.Layout.Type.HORIZONTAL,
            this.layout.resizeMode = cc.Layout.ResizeMode.CONTAINER,
            this.layout.node.height = this.layoutOriginHeight,
            this.resultAsync = new AsyncQueueTool;
        for (var t = 0, n = function (n) {
            var r = n, i = t, u = o.results[n], p = Math.floor(n / 5);
            o.resultAsync.push(function (n) {
                var o = e.createItem(u);
                e.items.push(o),
                    r < 5 ? o.node.y = 0 : 5 == r ? (e.layout.node.width = e.layoutOriginWidth, e.layout.type = cc.Layout.Type.GRID) : 25 == r && (e.scrollView.enabled = !0),
                    e.layout.enabled = !0,
                    e.layout.updateLayout(),
                    e.layout.enabled = !1,
                    e.scrollView.content.height = Math.max(e.layoutOriginHeight, e.layout.node.height),
                    p != i && (t = p, e.scrollView.scrollToBottom(0));
                var f = .018, d = !1, h = 0;
                switch (u.type) {
                    case E_SUMMON_TYPE.Gear:
                    case E_SUMMON_TYPE.Weapon:
                    case E_SUMMON_TYPE.Armor:
                        (g = _GearConfig.Instance.get(u.id)).quality >= 4 && u.isNew && (f += .6, d = !0),
                            h = g.quality;
                        break;
                    case E_SUMMON_TYPE.Skill:
                        (g = _SkillConfig.Instance.get(u.id)).quality >= 4 && u.isNew && (f += .6, d = !0),
                            h = g.quality;
                        break;
                    case E_SUMMON_TYPE.Partner:
                        var g;
                        (g = _PartnerConfig.Instance.get(u.id)).quality >= 4 && u.isNew && (f += .6, d = !0),
                            h = g.quality;
                }
                o.node.stopAllActions(),
                    d ? (o.node.scale = 1.8, cc.tween(o.node).delay(.1).to(.16, {
                        scale: 1
                    }, {
                        easing: cc.easing.sineIn
                    }).start()) : (o.node.scale = 1.2, cc.tween(o.node).to(.1, {
                        scale: 1
                    }).start()),
                    o.playGlow(h),
                    e.scheduleOnce(n, f);
            });
        }, o = this, r = 0; r < this.results.length; r++)
            n(r);
        this.resultAsync.play();
    }
    public reuse(e: any) {
        this.results = e;
    }
}
