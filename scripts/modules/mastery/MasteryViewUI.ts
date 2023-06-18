import { GlobalEventName } from "../common/Events";
import { E_MenuToggleType, GameConst, E_ASSET_TYPE, PrefabUIMasterHelper } from "../common/Const";
import _MasteryConfig from "../../ccstudio/config/_MasteryConfig";
import MasteryModel, { E_MASTERY_STATUS } from "../../ccstudio/data/MasteryModel";
import Model from "../../ccstudio/data/Model";
import MasteryInfoUI from "./MasteryInfoUI";
import MasteryItemUI from "./MasteryItemUI";
import UIPool from "../common/UIPool";
import UserData from "../user/UserData";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class MasteryViewUI extends UIPool {
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Button)
    btnEnhance: cc.Button = null;
    @property(cc.Button)
    btnHelper: cc.Button = null;
    @property(cc.Button)
    btnReset: cc.Button = null;
    @property(cc.Node)
    content: cc.Node = null;
    currSelectId = 0;
    @property(cc.Label)
    enhancePrice: cc.Label = null;
    @property(MasteryInfoUI)
    info: MasteryInfoUI = null;
    items = {};
    @property(cc.Label)
    resetPrice: cc.Label = null;
    @property(cc.Label)
    spLabel: cc.Label = null;
    createItem(e: number, t: number, n: number) {
        const o = this.get();
        o.parent = this.content;
        o.setSiblingIndex(0);
        o.x = (-0.5 * (n - 1) + 160 * t);
        o.y = (160 * e);
        return o.getComponent(MasteryItemUI);
    }
    createItems() {
        this.items = {};
        for (let t = 1;; t++) {
            const o = _MasteryConfig.Instance.getLayers(t);
            if (_.isNil(o) || _.isEmpty(o))
                break;
            for (let i = 0; i < o.length; i++) {
                const r = o[i];
                const a = this.createItem(t, i, o.length);
                const s = Model.mastery.getData(r.id);
                a.masteryId = r.id;
                a.setIcon(r.icon);
                a.refreshStatus();
                const c = r.pre;
                const l = _.reduce(c, (t, n) => {
                    t.push(this.items[n].node);
                    return t;
                }, []);
                a.creatLineLines(l);
                a.refreshLinkLineStatus();
                a.node.on("toggle", this.onToggleItem, this);
                if (s && s.status != E_MASTERY_STATUS.EClose) {
                    this.currSelectId = Math.max(s.id, this.currSelectId);
                }
                this.items[r.id] = a;
            }
        }
        this.currSelectId = this.currSelectId || 1;
        this.content.getComponent(cc.Layout).updateLayout();
        this.content.getComponent(cc.Widget).updateAlignment();
    }
    onClickClose() {
        cc.director.emit(GlobalEventName.ClosePageView, E_MenuToggleType.Hero);
    }
    onClickEnhance(): void {
        Model.mastery.lvup(this.currSelectId) && (this.info.refresh(), this.refreshSpCount());
    }
    onClickHelperHandler(): void {
        Model.ui.openViewAsync(PrefabUIMasterHelper);
    }
    onClickReset(): void {
        Model.mastery.reset();
    }
    onDiamondChange() {
        this.refreshDiamond();
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.setCurrInfo(this.currSelectId);
        this.refreshBtnStatus();
        this.refreshSpCount();
        this.refreshDiamond();
        this.resetPrice.string = `${GameConst.MASTERY_RESET_PRICE}`;
        cc.director.on(GlobalEventName.MasteryUnlock, this.onMasterUnlock, this);
        cc.director.on(GlobalEventName.MasteryLvChange, this.onMasterLvchange, this);
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.Diamond, this.onDiamondChange, this);
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.Sp, this.onSpCountChange, this);
    }
    onLoad() {
        this.createItems();
        this.btnReset.node.on("click", this.onClickReset, this);
        this.btnEnhance.node.on("click", this.onClickEnhance, this);
        this.btnHelper.node.on("click", this.onClickHelperHandler, this);
        this.btnClose.node.on("click", this.onClickClose, this);
    }
    onMasterLvchange(e: number) {
        if (this.currSelectId == e) {
            this.info.refresh();
        }
        const t = this.items[e];
        t.refreshStatus();
        t.refreshLinkLineStatus();
        this.refreshBtnStatus();
    }
    onMasterUnlock(e: number) {
        if (this.currSelectId == e) {
            this.info.refresh();
        }
        const t = this.items[e];
        t.refreshStatus();
        t.refreshLinkLineStatus();
        this.refreshBtnStatus();
    }
    onSpCountChange() {
        this.refreshSpCount();
    }
    onToggleItem(e: cc.Toggle) {
        if (e.isChecked) {
            const t = e.getComponent(MasteryItemUI);
            this.setCurrInfo(t.masteryId);
        }
    }
    refreshBtnStatus(): void {
        Model.mastery.getResetEnable() ? this.btnReset.target.getComponent(cc.Sprite).setState(cc.Sprite.State.NORMAL)
            : this.btnReset.target.getComponent(cc.Sprite).setState(cc.Sprite.State.GRAY);
        const e = Model.mastery.getData(this.currSelectId);
        _.isNil(e) || e.status !== E_MASTERY_STATUS.EOpen ? this.btnEnhance.node.active = !1 : this.btnEnhance.node.active = !0;
    }
    // spLabel: cc.Label;
    // content: cc.Node;
    // info: d.default;
    // btnReset: cc.Button;
    // resetPrice: cc.Label;
    // btnEnhance: cc.Button;
    // enhancePrice: cc.Label;
    // btnHelper: cc.Button;
    // btnClose: cc.Button;
    // currSelectId: number;
    // constructor() {
    //   super();
    //   this.spLabel = null;
    //   this.content = null;
    //   this.info = null;
    //   this.btnReset = null;
    //   this.resetPrice = null;
    //   this.btnEnhance = null;
    //   this.enhancePrice = null;
    //   this.btnHelper = null;
    //   this.btnClose = null;
    //   this.currSelectId = 0;
    // }
    refreshDiamond(): void {
        parseInt(UserData.Instance.getItem(E_ASSET_TYPE.Diamond)) < GameConst.MASTERY_RESET_PRICE ? this.resetPrice.node.color = cc.Color.RED : this.resetPrice.node.color = cc.Color.WHITE;
    }
    refreshSpCount() {
        const e = parseInt(UserData.Instance.getItem(E_ASSET_TYPE.Sp));
        const t = _MasteryConfig.Instance.get(this.currSelectId);
        this.spLabel.string = `${e}`;
        if (e < t.costSp) {
            this.spLabel.node.color = cc.Color.RED;
            this.enhancePrice.node.color = cc.Color.RED;
        }
        else {
            this.spLabel.node.color = cc.Color.WHITE;
            this.enhancePrice.node.color = cc.Color.WHITE;
        }
    }
    setCurrInfo(e: number): void {
        this.currSelectId = e;
        this.info.masteryId = e;
        this.info.refresh();
        this.refreshBtnStatus();
        const t = _MasteryConfig.Instance.get(e);
        this.enhancePrice.string = `${t.costSp}`;
    }
    start() {
        this.items[this.currSelectId].getComponent(cc.Toggle).check();
    }
}
