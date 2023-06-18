import LanMgr from "../common/Language";
import _QuestConfig from "../../ccstudio/config/_QuestConfig";
import _TraitConfig from "../../ccstudio/config/_TraitConfig";
import _TraitLevelConfig from "../../ccstudio/config/_TraitLevelConfig";
import UIPool from "../common/UIPool";
import TraitRuleListItemUI from "./TraitRuleListItemUI";
const g: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class TraitRuleViewUI extends UIPool {
    @property(cc.Component)
    content: cc.Component = null;
    @property(cc.Label)
    title: cc.Label = null;
    createItem() {
        const e = this.get();
        e.parent = this.content.node;
        return e.getComponent(TraitRuleListItemUI);
    }
    createProp(e) {
        const t = _QuestConfig.Instance.get(e);
        const n = LanMgr.Instance.getLangByID(t.desc);
        const o = cc.instantiate(this.title.node);
        o.parent = this.content.node;
        o.getComponent(cc.Label).string = LanMgr.Instance.getLangByID(t.name);
        const r = _TraitConfig.Instance.getPropCfgs(e);
        for (let i = r.length - 1; i >= 0; i--) {
            const c = r[i];
            const u = _TraitConfig.Instance.get(c);
            const p = u.propAdd;
            const f = "" + n.replace("%{value}", "" + p);
            const d = this.createItem();
            d.setGrade(u.quality);
            d.setDescStr(f);
        }
    }
    createProps() {
        const t = _TraitConfig.Instance.getAllProps();
        g.each(t, (t) => {
            this.createProp(parseInt(t));
        });
    }
    createQuailty() {
        this.title.string = LanMgr.Instance.getLangByID("Acquisition probability by grade");
        const t = g.sortBy(_TraitLevelConfig.Instance.getAll(), (e) => -e.quality);
        g.each(t, (t) => {
            const n = t.quality;
            const o = t.rate;
            const r = this.createItem();
            r.setGrade(n);
            r.setDescStr((o / 1e4).toFixed(4) + "%");
        });
    }
    onLoad() {
        this.createQuailty();
        this.createProps();
    }
}
