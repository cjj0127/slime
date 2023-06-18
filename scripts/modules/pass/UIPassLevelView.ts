import { PAGE_EVENTS } from "../common/ToggleToPage";
import { GlobalEventName } from "../common/Events";
import { GameConst, E_ITEM_TYPE } from "../common/Const";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import PassModel from "../../ccstudio/data/PassModel";
import Model from "../../ccstudio/data/Model";
import _PassRewardsConfig from "../../ccstudio/config/_PassRewardsConfig";
import AssetHeroInfoUI from "../asset/AssetHeroInfoUI";
import AssetInfoUI from "../asset/AssetInfoUI";
import UIPassLevelItem from "./UIPassLevelItem";
const _: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class UIPassLevelView extends cc.Component {
    _created = false;
    @property(cc.Layout)
    contentLayout = null;
    @property(cc.Prefab)
    itemPrefab = null;
    @property([UIPassLevelItem])
    levelItems = [];
    @property(cc.Node)
    levelProgress = null;
    lvUping = false;
    @property(cc.ScrollView)
    scrollView = null;
    _register() {
        this.contentLayout.node.parent.on(cc.Node.EventType.POSITION_CHANGED, this.refreshLevelProgress, this);
    }
    createLevelItems() {
        if (!this._created) {
            this.contentLayout.enabled = false;
            const passId: number = Model.pass.passId;
            for (let t = 0; t < GameConst.PASS_MAX_LEVEL; t++) {
                const n: number = t + 1;
                const o: cc.Node = cc.instantiate(this.itemPrefab);
                o.parent = this.contentLayout.node;
                const r: any = _PassRewardsConfig.Instance.getLevel(passId, n);
                const i: UIPassLevelItem = o.getComponent(UIPassLevelItem);
                i.setLevel(n);
                i.setIcon(r.icon1, r.icon2);
                i.setCount(r.count1, r.count2);
                i.delegate = this;
                this.levelItems.push(i);
            }
            this.contentLayout.enabled = true;
            this.contentLayout.updateLayout();
            this._created = true;
        }
    }
    onActivePremium() {
        this.refreshLevelStatus();
    }
    onClickNormall(e: any, t: number) {
        const n: cc.Vec3 = e.normalIcon.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
        if (Model.pass.receiveNormallReward(t, n)) {
            const o: any = Model.pass.getLevelData(t);
            e.setReceived(o.premiumReceived, o.normalReceived);
            e.setLighted(o.premiumReceived, o.normalReceived);
        }
        else {
            const passId: number = Model.pass.passId;
            const i: any = _PassRewardsConfig.Instance.getLevel(passId, t);
            this.popDetail(i.itemId2, e.normalIcon.node);
        }
    }
    onClickPremium(e: any, t: number) {
        const n: cc.Vec3 = e.premiumIcon.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
        if (Model.pass.receivePremiumReward(t, n)) {
            const o: any = Model.pass.getLevelData(t);
            e.setReceived(o.premiumReceived, o.normalReceived);
            e.setLighted(o.premiumReceived, o.normalReceived);
        }
        else {
            const passId: number = Model.pass.passId;
            const i: any = _PassRewardsConfig.Instance.getLevel(passId, t);
            this.popDetail(i.itemId1, e.premiumIcon.node);
        }
    }
    onLevelChange() {
        const e: number = Model.pass.level;
        0 == e && (this.levelProgress.height = 0);
        e >= GameConst.PASS_MAX_LEVEL ? this.levelProgress.height = this.node.height : this.refreshLevelProgress();
        this.refreshLevelStatus();
        this.lvUping = true;
    }
    onLoad() {
        this.node.on(PAGE_EVENTS.PageEnter, this.onPageEnter, this);
        this.node.on(PAGE_EVENTS.PageExit, this.onPageExit, this);
    }
    onPageEnter() {
        this.createLevelItems();
        const e: number = Model.pass.level;
        const t: number = 1 - (e - 1) / 31;
        this.scrollView.scrollToPercentVertical(t, 0.15);
        e <= 0 && (this.levelProgress.height = 0);
        e >= GameConst.PASS_MAX_LEVEL && (this.levelProgress.height = this.node.height);
        this._register();
        this.scheduleOnce(this.refreshLevelProgress, 0);
        this.refreshLevelStatus();
        cc.director.on(GlobalEventName.PassLevelChange, this.onLevelChange, this);
        cc.director.on(GlobalEventName.PassActivePremium, this.onActivePremium, this);
    }
    onPageExit() {
        cc.director.targetOff(this);
    }
    popDetail(id: number, parent: cc.Node) {
        _AssetConfig.Instance.get(id).type == E_ITEM_TYPE.Hero ? AssetHeroInfoUI.addPopItem(id, parent) : AssetInfoUI.addPopItem(id, parent);
    }
    refreshLevelProgress() {
        const e: number = Model.pass.level;
        if (e > 0 && e < GameConst.PASS_MAX_LEVEL) {
            const t: UIPassLevelItem = this.levelItems[e - 1];
            const n: cc.Vec3 = t.node.convertToWorldSpaceAR(cc.Vec3.ZERO);
            const o: cc.Vec2 = this.levelProgress.parent.convertToNodeSpaceAR(n);
            this.levelProgress.height = Math.max(0, this.levelProgress.y - o.y + 0.5 * t.node.height);
        }
    }
    refreshLevelStatus() {
        const e: number = Model.pass.level;
        const t: boolean = Model.pass.premiumActive;
        _.each(this.levelItems, (n: UIPassLevelItem) => {
            const o: any = Model.pass.getLevelData(n.getLevel());
            if (o) {
                n.setReceived(o.premiumReceived, o.normalReceived);
                n.setLighted(o.premiumReceived, o.normalReceived);
            }
            else {
                n.setReceived(false, false);
                n.setLighted(true, true);
            }
            n.setActive(n.getLevel() <= e);
            n.setLocked(true != t);
        });
    }
}
