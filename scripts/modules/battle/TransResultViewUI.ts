import { E_ENHANCE_TYPE } from "../common/Const";
import AsyncQueueTool from "../../ccstudio/utils/AsyncQueueTool";
import _GearConfig from "../../ccstudio/config/_GearConfig";
import _PartnerConfig from "../../ccstudio/config/_PartnerConfig";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
import UIPool from "../common/UIPool";
import TransResultItemUI from "./TransResultItemUI";
const { ccclass, property } = cc._decorator;
@ccclass
export class TransResultUIView extends UIPool {
    @property(cc.Node)
    arrawNode: cc.Node = null;
    @property(cc.Node)
    complateNode: cc.Node = null;
    @property()
    layoutNextOriginHeight: number = 0;
    @property()
    layoutNextOriginWidth: number = 0;
    @property()
    layoutPreOriginHeight: number = 0;
    @property()
    layoutPreOriginWidth: number = 0;
    @property(cc.Layout)
    nextLayout: cc.Layout = null;
    @property(cc.Layout)
    preLayout: cc.Layout = null;
    resultAsync: AsyncQueueTool = null;
    results: TransResultItemUI[] = [];
    @property()
    scrollOriginHeight: number = 0;
    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;
    @property(cc.Node)
    skinNode: cc.Node = null;
    type: any = null;
    addItem(e: cc.Node, t: any, n: any): TransResultItemUI {
        const o = this.get();
        o.parent = e;
        o.stopAllActions();
        const r = o.getComponent(TransResultItemUI);
        r.setQualityValue(t);
        r.setIcon(n);
        return r;
    }
    clear() {
        super.clear();
        this.results.length = 0;
        this.unscheduleAllCallbacks();
    }
    getCfg(e: any) {
        switch (this.type) {
            case E_ENHANCE_TYPE.Gear:
                return _GearConfig.Instance.get(e);
            case E_ENHANCE_TYPE.Panter:
                return _PartnerConfig.Instance.get(e);
            case E_ENHANCE_TYPE.Skill:
                return _SkillConfig.Instance.get(e);
            default:
                return null;
        }
    }
    onDisable() {
        this.clear();
    }
    onEnable() {
        this.playSkinAnim();
        this.playResults();
    }
    onLoad() {
        this.layoutPreOriginWidth = this.preLayout.node.width;
        this.layoutPreOriginHeight = this.preLayout.node.height;
        this.layoutNextOriginWidth = this.nextLayout.node.width;
        this.layoutNextOriginHeight = this.nextLayout.node.height;
        this.scrollOriginHeight = this.scrollView.content.height;
    }
    playResults() {
        this.arrawNode.active = false;
        this.complateNode.active = false;
        this.preLayout.type = cc.Layout.Type.HORIZONTAL;
        this.preLayout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        this.preLayout.node.height = this.layoutPreOriginHeight;
        this.nextLayout.type = cc.Layout.Type.HORIZONTAL;
        this.nextLayout.resizeMode = cc.Layout.ResizeMode.CONTAINER;
        this.nextLayout.node.height = this.layoutNextOriginHeight;
        this.scrollView.content.height = this.scrollOriginHeight;
        this.resultAsync = new AsyncQueueTool();
        const widget = this.scrollView.content.getComponent(cc.Widget);
        for (let i = 0; i < this.results.length; i++) {
            const r = i;
            const prev = this.results[i].prev;
            this.resultAsync.push((cb: any) => {
                const cfg = this.getCfg(prev);
                const item = this.addItem(this.preLayout.node, cfg.quality, cfg.icon);
                item.setMax();
                item.playAnim();
                if (r < 5) {
                    item.node.y = 0.5 * item.node.height + this.preLayout.paddingBottom;
                }
                else if (r == 5) {
                    this.preLayout.node.width = this.layoutPreOriginWidth;
                    this.preLayout.type = cc.Layout.Type.GRID;
                }
                this.preLayout.enabled = true;
                this.preLayout.updateLayout();
                this.preLayout.enabled = false;
                this.scrollView.content.height = Math.max(this.scrollOriginHeight, this.preLayout.node.height);
                if (this.scrollView.content.height > this.scrollOriginHeight) {
                    widget.updateAlignment();
                }
                this.scheduleOnce(cb, 0.12);
            });
        }
        this.resultAsync.push((cb: any) => {
            this.scheduleOnce(() => {
                this.arrawNode.active = true;
                this.scrollView.content.height = Math.max(this.scrollOriginHeight, this.preLayout.node.height + this.arrawNode.height + 20);
                cb();
            }, 0.2);
        });
        for (let i = 0; i < this.results.length; i++) {
            const o = i;
            const r = this.results[i];
            const id = r.id;
            const count = r.count;
            this.resultAsync.push((cb: any) => {
                const cfg = this.getCfg(id);
                const item = this.addItem(this.nextLayout.node, cfg.quality, cfg.icon);
                item.setCount(count);
                item.playAnim();
                if (o < 5) {
                    item.node.y = -0.5 * item.node.height - this.preLayout.paddingBottom;
                }
                else if (o == 5) {
                    this.nextLayout.node.width = this.layoutNextOriginWidth;
                    this.nextLayout.type = cc.Layout.Type.GRID;
                }
                this.nextLayout.enabled = true;
                this.nextLayout.updateLayout();
                this.nextLayout.enabled = false;
                this.scrollView.content.height = Math.max(this.scrollOriginHeight, this.preLayout.node.height + this.nextLayout.node.height + this.arrawNode.height + 40);
                if (this.scrollView.content.height > this.scrollOriginHeight) {
                    widget.updateAlignment();
                }
                this.scheduleOnce(cb, 0.12);
            });
        }
        this.resultAsync.complete = () => {
            this.complateNode.active = true;
        };
        this.resultAsync.play();
    }
    playSkinAnim() {
        this.skinNode.stopAllActions();
        cc.tween(this.skinNode).by(5, { angle: 360 }).repeatForever().start();
    }
    reuse(e: any) {
        this.type = e.type;
        this.results = e.results;
    }
}
