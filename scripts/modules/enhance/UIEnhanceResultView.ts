import { E_ENHANCE_TYPE } from "../common/Const";
import AsyncQueueTool from "../../ccstudio/utils/AsyncQueueTool";
import _GearConfig from "../../ccstudio/config/_GearConfig";
import _PartnerConfig from "../../ccstudio/config/_PartnerConfig";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
import UIEnhanceResultItem from "./UIEnhanceResultItem";
import UIPool from "../common/UIPool";
const { ccclass, property } = cc._decorator;
@ccclass
export default class EnhanceResultUIView extends UIPool {
    items: UIEnhanceResultItem[] = [];
    @property(cc.Layout)
    layout: cc.Layout = null;
    layoutOriginHeight: number = 0;
    layoutOriginWidth: number = 0;
    resultAsync: AsyncQueueTool = null;
    results: any[] = [];
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    type: E_ENHANCE_TYPE = null;
    addItem(quality: any, icon: any, name: any, prev: any, curr: any) {
        const item = this.get();
        item.parent = this.layout.node;
        item.stopAllActions();
        const itemComponent = item.getComponent(UIEnhanceResultItem);
        itemComponent.setQualityValue(quality);
        itemComponent.setIcon(icon);
        itemComponent.setNameStr(name);
        itemComponent.setEnhanceInfo(prev, curr);
        return itemComponent;
    }
    clear() {
        super.clear();
        this.results.length = 0;
        this.items.length = 0;
        this.unscheduleAllCallbacks();
    }
    getCfg(id: any) {
        switch (this.type) {
            case E_ENHANCE_TYPE.Gear:
                return _GearConfig.Instance.get(id);
            case E_ENHANCE_TYPE.Panter:
                return _PartnerConfig.Instance.get(id);
            case E_ENHANCE_TYPE.Skill:
                return _SkillConfig.Instance.get(id);
            default:
                throw new Error(`Invalid type: ${this.type}`);
        }
    }
    onDisable() {
        this.clear();
    }
    onEnable() {
        this.playResults();
    }
    onLoad() {
        this.layoutOriginWidth = this.layout.node.width;
        this.layoutOriginHeight = this.layout.node.height;
    }
    playResults() {
        this.layout.type = cc.Layout.Type.HORIZONTAL;
        this.layout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        this.layout.node.height = this.layoutOriginHeight;
        this.resultAsync = new AsyncQueueTool();
        for (let i = 0; i < this.results.length; i++) {
            const result = this.results[i];
            const id = result.id;
            const prev = result.prev;
            const curr = result.curr;
            this.resultAsync.push((next: any) => {
                const cfg = this.getCfg(id);
                const item = this.addItem(cfg.quality, cfg.icon, cfg.name, prev, curr);
                this.items.push(item);
                item.node.scale = 1.2;
                item.node.stopAllActions();
                cc.tween(item.node).call(() => {
                    item.playAnim();
                }).to(.1, {
                    scale: 1
                }).start();
                if (i < 5) {
                    item.node.y = 0;
                }
                else if (i == 5) {
                    this.layout.node.width = this.layoutOriginWidth;
                    this.layout.type = cc.Layout.Type.GRID;
                }
                else if (i == 25) {
                    this.scrollView.enabled = true;
                }
                this.layout.enabled = true;
                this.layout.updateLayout();
                this.layout.enabled = false;
                this.scrollView.content.height = Math.max(this.layoutOriginHeight, this.layout.node.height);
                this.scheduleOnce(next, .08);
            });
        }
        this.resultAsync.play();
    }
    reuse(e: any) {
        super.reuse(e);
        this.type = e.type;
        this.results = e.results;
    }
}
