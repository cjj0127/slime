import { E_SUMMON_TYPE } from "../common/Const";
import AsyncQueueTool from "../../ccstudio/utils/AsyncQueueTool";
import _GearConfig from "../../ccstudio/config/_GearConfig";
import _PartnerConfig from "../../ccstudio/config/_PartnerConfig";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
import UIPool from "../common/UIPool";
import SummonResultItemUI from "./SummonResultItemUI";
const { ccclass, property } = cc._decorator;
@ccclass
export default class ISummonResultView extends UIPool {
    items = [];
    @property(cc.Layout)
    layout: cc.Layout = null;
    layoutOriginHeight = 0;
    layoutOriginWidth = 0;
    resultAsync = null;
    results = [];
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    addItem(e: any, t: any, n: any, o: any, r: any) {
        const i = this.get();
        i.parent = this.layout.node;
        i.stopAllActions();
        const a = i.getComponent(SummonResultItemUI);
        a.setQualityValue(e);
        a.setIcon(t);
        a.setType(o, r);
        return a;
    }
    clear() {
        super.clear();
        this.results.length = 0;
        this.items.length = 0;
        this.resultAsync?.clear();
    }
    createItem(e): any {
        return null;
    }
    getCfg(e: any, t: any) {
        switch (e) {
            case E_SUMMON_TYPE.Gear:
            case E_SUMMON_TYPE.Weapon:
            case E_SUMMON_TYPE.Armor:
                return this.getGearCfgInfo(t);
            case E_SUMMON_TYPE.Partner:
                return this.getPartnerCfgInfo(t);
            case E_SUMMON_TYPE.Skill:
                return this.getSkillCfgInfo(t);
        }
    }
    getGearCfgInfo(e: any) {
        const t = _GearConfig.Instance.get(e);
        return {
            quality: t.quality,
            icon: t.icon,
            name: t.name,
            gearType: t.type
        };
    }
    getPartnerCfgInfo(e: any) {
        const t = _PartnerConfig.Instance.get(e);
        return {
            quality: t.quality,
            icon: t.icon,
            name: t.name
        };
    }
    getSkillCfgInfo(e: any) {
        const t = _SkillConfig.Instance.get(e);
        return {
            quality: t.quality,
            icon: t.icon,
            name: t.name
        };
    }
    onDisable() {
        this.unscheduleAllCallbacks();
        this.clear();
    }
    onEnable() {
        this.playResults();
    }
    onLoad() {
        this.layoutOriginWidth = this.layout.node.width;
        this.layoutOriginHeight = this.layout.node.height;
    }
    public playResults() {
        this.layout.type = cc.Layout.Type.HORIZONTAL;
        this.layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        this.layout.node.height = this.layoutOriginHeight;
        this.resultAsync = new AsyncQueueTool();
        for (let i = 0; i < this.results.length; i++) {
            const index = i;
            const rowIndex = Math.floor(i / 5);
            const preIndex = index;
            this.resultAsync.push(next => {
                const item = this.createItem(this.results[index]);
                this.items.push(item);
                item.node.scale = 1.2;
                cc.tween(item.node).to(0.1, { scale: 1 }).start();
                item.node.y = index < 5 ? 0 : 5 == index ? (this.layout.node.width = this.layoutOriginWidth, this.layout.type = cc.Layout.Type.GRID) : 25 == index && (this.scrollView.enabled = true);
                this.layout.enabled = true;
                this.layout.updateLayout();
                this.layout.enabled = false;
                this.scrollView.content.height = Math.max(this.layoutOriginHeight, this.layout.node.height);
                if (rowIndex !== preIndex) {
                    var t = rowIndex;
                    this.scrollView.scrollToBottom(0);
                }
                this.scheduleOnce(next, 0.018);
            });
        }
        this.resultAsync.play();
    }
}
