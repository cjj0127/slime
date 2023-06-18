import { E_SUMMON_TYPE } from "../common/Const";
import _GearConfig from "../../ccstudio/config/_GearConfig";
import ISummonResultView from "../shop/ISummonResultView";
import _PartnerConfig from "../../ccstudio/config/_PartnerConfig";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
import MyTools from "../../ccstudio/utils/MyTools";
const { ccclass, property } = cc._decorator;
@ccclass
export default class UIDayRewardView extends ISummonResultView {
    createItem(e: {
        type: number;
        id: number;
    }): any {
        const t: any = this.getCfg(e.type, e.id);
        return this.addItem(t.quality, t.icon, t.name, e.id, e.type);
    }
    async playResults() {
        this.layout.type = cc.Layout.Type.HORIZONTAL;
        this.layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        this.layout.node.height = this.layoutOriginHeight;
        let e = 0, t = 0;
        while (t < this.results.length) {
            const n = this.results[t];
            const o = this.createItem(n);
            this.items.push(o);
            if (t < 5) {
                o.node.y = 0;
            }
            else if (t == 5) {
                this.layout.node.width = this.layoutOriginWidth;
                this.layout.type = cc.Layout.Type.GRID;
            }
            else if (t == 25) {
                this.scrollView.enabled = true;
            }
            this.layout.enabled = true;
            this.layout.updateLayout();
            this.layout.enabled = false;
            this.scrollView.content.height = Math.max(this.layoutOriginHeight, this.layout.node.height);
            const r = Math.floor(t / 5);
            if (r !== e) {
                this.scrollView.scrollToBottom(0);
                e = r;
            }
            let i = 0.015, a = false;
            let d = 0;
            const h = n.type;
            switch (h) {
                case E_SUMMON_TYPE.Gear:
                case E_SUMMON_TYPE.Weapon:
                case E_SUMMON_TYPE.Armor:
                    const _h = _GearConfig.Instance.get(n.id);
                    if (_h.quality >= 4 && n.isNew) {
                        i += 0.6;
                        a = true;
                    }
                    d = _h.quality;
                    break;
                case E_SUMMON_TYPE.Skill:
                    const _skill = _SkillConfig.Instance.get(n.id);
                    if (_skill.quality >= 4 && n.isNew) {
                        i += 0.6;
                        a = true;
                    }
                    d = _skill.quality;
                    break;
                case E_SUMMON_TYPE.Partner:
                    const _partner = _PartnerConfig.Instance.get(n.id);
                    if (_partner.quality >= 4 && n.isNew) {
                        i += 0.6;
                        a = true;
                    }
                    d = _partner.quality;
                    break;
            }
            o.node.stopAllActions();
            if (a) {
                o.node.scale = 1.8;
                cc.tween(o.node).delay(0.1).to(0.16, { scale: 1 }, { easing: cc.easing.sineIn }).start();
            }
            else {
                o.node.scale = 1.2;
                cc.tween(o.node).to(0.1, { scale: 1 }).start();
            }
            o.playGlow(d);
            await MyTools.sleep(i);
            t++;
        }
    }
    reuse(e: any) {
        this.results = e;
    }
}
