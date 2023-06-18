import GuideMgr from "../guide/GuideMgr";
import MineResearchInfoUI from "./MineResearchInfoUI";
import MineResearchItemUI from "./MineResearchItemUI";
import MineResearchUpgradingUI from "./MineResearchUpgradingUI";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import { EOpenUIType } from "../common/ViedioType";
import UIPool from "../common/UIPool";
import { GlobalEventName } from "../common/Events";
import { E_ASSET_TYPE, MapUIPrefabs } from "../common/Const";
import Model from "../../ccstudio/data/Model";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
import { E_MINE_RESEARCH_STATUS } from "../../ccstudio/data/MineResearchModel";
import _MineResearchConfig from "../../ccstudio/config/_MineResearchConfig";
const { ccclass, property } = cc._decorator;
const E: any = window["_"];
@ccclass
export default class MineResearchViewUI extends UIPool {
    @property(cc.Node)
    content: cc.Node = null;
    @property(cc.Label)
    cubeCountLabel: cc.Label = null;
    currSelectId = 0;
    @property(MineResearchInfoUI)
    info: MineResearchInfoUI = null;
    items = {};
    @property(MineResearchUpgradingUI)
    upgrading: MineResearchUpgradingUI = null;
    closeMineView() {
        this.getComponent(ViewAnimCtrl).onClose();
    }
    createItem(e: number, t: number, n: number) {
        const o = this.get();
        o.parent = this.content;
        o.setSiblingIndex(0);
        const r = -.5 * (n - 1) * 200 + 200 * t;
        const i = -(100 + 200 * e);
        o.x = r;
        o.y = i;
        return o.getComponent(MineResearchItemUI);
    }
    createItems() {
        let t = 0;
        let n = 1;
        while (true) {
            const layerIds: number[] = _MineResearchConfig.Instance.getLayerIds(t);
            if (E.isNil(layerIds) || layerIds.length == 0)
                break;
            layerIds.forEach((r, i) => {
                const a = this.createItem(t, i, layerIds.length);
                const s = _MineResearchConfig.Instance.get(r);
                const l = Model.mineResearch.getData(r);
                const u = s.maxLevel;
                const f = l.status;
                a.mineResearchId = s.id;
                a.setIcon(s.icon);
                a.setProgress(l.level, u);
                a.setStatus(f == E_MINE_RESEARCH_STATUS.EClose, l.level == u);
                a.node.on("toggle", this.onToggleItem, this);
                const d = s.pre;
                const h = E.reduce(d, (accumulator: cc.Node[], currentValue: any) => {
                    accumulator.push(this.items[currentValue].node);
                    return accumulator;
                }, []);
                a.creatLineLines(h);
                a.refreshLinkLineStatus();
                this.items[r] = a;
                if (l.status != E_MINE_RESEARCH_STATUS.EClose) {
                    n = Math.max(l.id, n);
                }
            });
            t++;
        }
        this.currSelectId = n;
        this.content.getComponent(cc.Layout).updateLayout();
        this.content.getComponent(cc.Widget).updateAlignment();
    }
    onCubeCountChange() {
        this.refreshCubeCount();
    }
    onDestroy() {
        this.items = null;
    }
    onDisable() {
        cc.director.targetOff(this);
        Model.ad.hideBanner();
    }
    onEnable() {
        this.refreshCubeCount();
        this.refreshCurrInfo(this.currSelectId);
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.MineCube, this.onCubeCountChange, this);
        cc.director.on(GlobalEventName.MineResearchComplete, this.onLevelComplete, this);
        cc.director.on(GlobalEventName.MineResearchStartUpgrading, this.onStartUpgrading, this);
        cc.director.on(GlobalEventName.MineResearchUnlock, this.onUnlockId, this);
        cc.director.on(GlobalEventName.MineResearchDone, this.onLevelDone, this);
        const e = Model.mineResearch.currUpgradingId;
        if (e > 0) {
            const t = Model.mineResearch.getData(e);
            if (t.status == E_MINE_RESEARCH_STATUS.EUpgrading) {
                this.upgrading.startLvup(e);
            }
            else {
                this.upgrading.complete();
            }
            if (t.status == E_MINE_RESEARCH_STATUS.EComplete) {
                this.onLevelDone();
            }
        }
        else {
            this.upgrading.complete();
        }
        E.each(this.items, function (e) {
            e.refresh();
        });
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchUpgradeMineButton);
        Model.ad.showBanner(EOpenUIType.Mine);
    }
    onLevelComplete(e: number) {
        const t = this.items[e];
        t.refresh();
        t.refreshLinkLineStatus();
        if (this.info.mineResearchId == e) {
            this.info.refresh();
        }
    }
    onLevelDone() {
        Model.ui.openViewAsync(MapUIPrefabs.MineResearchComplete, {
            data: Model.mineResearch.currUpgradingId
        });
        this.upgrading.complete();
    }
    // private items = {};
    // private currSelectId: number = 0;
    onLoad() {
        this.createItems();
    }
    onStartUpgrading() {
        const e = Model.mineResearch.currUpgradingId;
        this.upgrading.startLvup(e);
    }
    // private cubeCountLabel: cc.Label;
    // private content: cc.Node;
    // private info: f.default;
    // private upgrading: h.default;
    // private currSelectId: number;
    onToggleItem(e: cc.Toggle) {
        if (e.isChecked) {
            const t = e.getComponent(MineResearchItemUI);
            this.currSelectId = t.mineResearchId;
            this.refreshCurrInfo(t.mineResearchId);
        }
    }
    onUnlockId(e: number) {
        const t = this.items[e];
        t.refresh();
        t.refreshLinkLineStatus();
        if (e == this.info.mineResearchId) {
            this.info.refresh();
        }
    }
    refreshCubeCount() {
        const e = Model.mine.cubeCount;
        this.cubeCountLabel.string = `${e}`;
    }
    refreshCurrInfo(e: number) {
        this.info.mineResearchId = e;
        this.info.refresh();
    }
    start() {
        this.items[this.currSelectId].getComponent(cc.Toggle).check();
    }
}
