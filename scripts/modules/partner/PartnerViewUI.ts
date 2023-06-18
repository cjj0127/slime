import GuideMgr from "../guide/GuideMgr";
import GuideTouch from "../guide/GuideTouch";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import LanMgr from "../common/Language";
import { GlobalEventName } from "../common/Events";
import { E_MenuToggleType, GameConst, EUNLOCKSYS_ID, E_UNLOCK_STATE, MapUIPrefabs, E_ENHANCE_TYPE } from "../common/Const";
import ListView from "../../ccstudio/display/ListView";
import ListViewAdapter from "../../ccstudio/display/ListViewAdapter";
import PartnerModel from "../../ccstudio/data/PartnerModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import NumberPlus from "../../ccstudio/utils/NumberPlus";
import _PartnerConfig from "../../ccstudio/config/_PartnerConfig";
import _PartnerLevelConfig from "../../ccstudio/config/_PartnerLevelConfig";
import CandidateItemUI from "../battle/CandidateItemUI";
import PartnerListItemUI from "./PartnerListItemUI";
import SlotsUI from "../battle/SlotsUI";
import UnlockData from "../unlock/UnlockData";
// n.default = R
export enum UiMode {
    Normall,
    SelectSolt
}
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class PartnerViewUI extends ListViewAdapter {
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Button)
    btnEnhanceAll: cc.Button = null;
    candidateId: number = -1;
    @property(CandidateItemUI)
    candidateItem: CandidateItemUI = null;
    @property(ListView)
    listView: ListView = null;
    @property(cc.Label)
    ownedAtkValue: cc.Label = null;
    @property(SlotsUI)
    slots: SlotsUI = null;
    uiMode: UiMode = UiMode.Normall;
    changeUIMode(): void {
        if (this.uiMode == UiMode.Normall) {
            this.candidateItem.node.parent.active = false;
            this.slots.hideCandidates();
        }
        else {
            this.slots.showCandidates();
            this.candidateItem.node.parent.active = true;
            this.refreshCandidateInfo();
        }
    }
    checkUnlockPartnerSlot(e: number) {
        let t = this.slots.slots[Model.partner.convertPartnerSysIdToSlotIndex(e)];
        if (t) {
            let n = Model.unlock.getData(e);
            if (n.state == E_UNLOCK_STATE.WaitUnlock) {
                Model.unlock.unlock(e);
                t.showLock(e);
                t.playUnlockAni();
            }
            else if (n.state == E_UNLOCK_STATE.Unlocked) {
                t.hideLock();
            }
            else if (n.state == E_UNLOCK_STATE.Locked) {
                t.showLock(e);
            }
        }
    }
    getItemInfo(e: number): {
        icon: string;
        quality: number;
        name: string;
    } {
        const t = _PartnerConfig.Instance.get(e);
        return {
            icon: t.icon,
            quality: t.quality,
            name: t.name,
        };
    }
    isLocked(e: number): boolean {
        return Model.partner.isLocked(e);
    }
    isWaitUnLock(e: number): boolean {
        return Model.partner.isWaitUnLock(e);
    }
    onClickCandidateParent() {
        this.uiMode = UiMode.Normall;
        this.changeUIMode();
    }
    onClickClose() {
        cc.director.emit(GlobalEventName.ClosePageView, E_MenuToggleType.Partner);
    }
    onClickEnhanceAll() {
        let e = Model.partner.transNextAll();
        if (e.length > 0) {
            Model.ui.addViewAsyncQueue(MapUIPrefabs.TransResult, {
                data: {
                    type: E_ENHANCE_TYPE.Panter,
                    results: e
                }
            });
        }
        let t = Model.partner.lvupAll();
        if (t.length > 0) {
            Model.ui.addViewAsyncQueue(MapUIPrefabs.EnhanceResult, {
                viewComp: MapUIPrefabs.EnhanceResult.viewComp,
                data: {
                    type: E_ENHANCE_TYPE.Panter,
                    results: t
                }
            });
        }
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.refreshList();
        this.refreshOwnedAtkValue();
        this.refreshSlots();
        this.refreshBtnStatus();
        this.uiMode = UiMode.Normall;
        this.changeUIMode();
        this.listView.getScrollView().scrollToTop();
        this.node.once("anim-in-done", () => {
            _.each(this.slots.slots, (t, n) => {
                let o = EUNLOCKSYS_ID.Partner + n;
                this.checkUnlockPartnerSlot(o);
            });
        });
        cc.director.on(GlobalEventName.PartnerOpenUIEquipSelectSlot, this.onEquipSelectSolt, this);
        cc.director.on(GlobalEventName.PartnerEquipedChange, this.onSlotEquipChange, this);
        cc.director.on(GlobalEventName.PartnerLevelUp, this.onLevelUp, this);
        cc.director.on(GlobalEventName.PartnerLevelUpAll, this.onLevelUpAll, this);
        cc.director.on(GlobalEventName.PartnerTrans, this.onTrans, this);
        cc.director.on(GlobalEventName.PartnerTransAll, this.onTransAll, this);
        cc.director.on(GlobalEventName.PartnerOwnedChange, this.onOwnedChange, this);
        cc.director.on(GlobalEventName.UnlockPartnerCol2, this.checkUnlockPartnerSlot, this);
        cc.director.on(GlobalEventName.UnlockPartnerCol3, this.checkUnlockPartnerSlot, this);
        cc.director.on(GlobalEventName.UnlockPartnerCol4, this.checkUnlockPartnerSlot, this);
        cc.director.on(GlobalEventName.UnlockPartnerCol5, this.checkUnlockPartnerSlot, this);
    }
    onEquipSelectSolt(e: number): void {
        this.candidateId = e;
        this.uiMode = UiMode.SelectSolt;
        this.changeUIMode();
    }
    onLevelUp(e: {
        id: number;
    }): void {
        const t = e.id;
        this.refreshOwnedAtkValue();
        this.refreshBtnStatus();
        const n = this.listView.getMatchItem((e) => {
            return e.getComponent(PartnerListItemUI).itemId == t;
        });
        if (n) {
            const o = Model.partner.getData(t);
            const r = n.getComponent(PartnerListItemUI);
            const i = Model.partner.getLvupMaxCnt(t, o.level);
            const a = _PartnerConfig.Instance.get(t);
            const c = (o?.level) || 1;
            const u = _PartnerLevelConfig.Instance.getMaxLevel(a.quality);
            r.setLevel(o.level);
            r.setProgress(o.count, i, c >= u);
            r.setRedPoint(o.count >= i && c < u || c >= u && a.next > 0 && o.count >= GameConst.PARTNERMAXLEVEL_NUM);
        }
    }
    // public slots: y.default;
    // public listView: u.default;
    // public btnEnhanceAll: cc.Button;
    // public ownedAtkValue: cc.Label;
    // public candidateItem: g.default;
    // public btnClose: cc.Button;
    onLevelUpAll(): void {
        this.refreshOwnedAtkValue();
        this.refreshBtnStatus();
        const items = this.listView.getItems();
        _.forEach(items, (item: cc.Node) => {
            if (!_.isNil(item)) {
                const component = item.getComponent(PartnerListItemUI);
                const data = Model.partner.getData(component.itemId);
                if (data) {
                    const maxCnt = Model.partner.getLvupMaxCnt(component.itemId, data.level);
                    const qualityInfo = _PartnerConfig.Instance.get(component.itemId);
                    const currentLevel = (data.level != null) ? data.level : 1;
                    const maxLevel = _PartnerLevelConfig.Instance.getMaxLevel(qualityInfo.quality);
                    component.setLevel(data.level);
                    component.setProgress(data.count, maxCnt, currentLevel >= maxLevel);
                    component.setRedPoint(data.count >= maxCnt && currentLevel < maxLevel || currentLevel >= maxLevel && qualityInfo.next > 0 && data.count >= GameConst.PARTNERMAXLEVEL_NUM);
                }
            }
        });
    }
    onListItemClick(e: any): void {
        this.openDetail(e.itemId);
    }
    onListItemEquip(e: any): void {
        if (GuideMgr.instance.skipGuide ||
            GuideMgr.instance.isCompleteSpecialGuide(SpecialGuideEnum.TouchPartnerItem)) {
            const t = e.itemId;
            if (Model.partner.getData(t)) {
                let n = Model.partner.getEquipedIdx(t);
                if (n >= 0) {
                    Model.partner.unequip(n);
                }
                else {
                    n = Model.partner.findEmptySolt();
                    if (n >= 0) {
                        Model.partner.equip(n, t);
                    }
                    else {
                        cc.director.emit(GlobalEventName.PartnerOpenUIEquipSelectSlot, t);
                    }
                }
            }
            else {
                this.openDetail(t);
            }
        }
    }
    onLoad() {
        this.btnEnhanceAll.node.on("click", this.onClickEnhanceAll, this);
        this.candidateItem.node.parent.on("click", this.onClickCandidateParent, this);
        this.slots.delegate = this;
        this.listView.setAdapter(this);
        this.btnClose.node.on("click", this.onClickClose, this);
    }
    onOwnedChange(): void {
        this.listView.notifyUpdate();
        this.refreshOwnedAtkValue();
        this.refreshBtnStatus();
    }
    onSelectSlot(e: number): void {
        if (this.uiMode == UiMode.Normall) {
            const t = Model.partner.getEquipedId(e);
            t >= 0 && this.openDetail(t);
        }
        else {
            if (this.isLocked(e))
                return;
            Model.partner.equip(e, this.candidateId);
            this.uiMode = UiMode.Normall;
            this.changeUIMode();
        }
    }
    onSlotEquipChange(e: number, t: any): void {
        const n = Model.partner.getEquipedId(e);
        this.slots.refreshSlot(n, e);
        this.refreshListItem(t);
        this.refreshListItem(n);
    }
    onTrans(e: {
        id: number;
        prev: number;
    }): void {
        const { id, prev } = e;
        this.refreshOwnedAtkValue();
        this.refreshBtnStatus();
        let item = this.listView.getMatchItem((node: cc.Node) => {
            return node.getComponent(PartnerListItemUI).itemId == id;
        });
        if (item) {
            const data = Model.partner.getData(id);
            const component = item.getComponent(PartnerListItemUI);
            const maxCnt = Model.partner.getLvupMaxCnt(id, data.level);
            const qualityInfo = _PartnerConfig.Instance.get(id);
            const currentLevel = (data.level != null) ? data.level : 1;
            const maxLevel = _PartnerLevelConfig.Instance.getMaxLevel(qualityInfo.quality);
            component.setLevel(data.level);
            component.setProgress(data.count, maxCnt, currentLevel >= maxLevel);
            component.setRedPoint(data.count >= maxCnt && currentLevel < maxLevel || currentLevel >= maxLevel && qualityInfo.next > 0 && data.count >= GameConst.PARTNERMAXLEVEL_NUM);
            const equippedIdx = Model.partner.getEquipedIdx(qualityInfo.id);
            if (equippedIdx >= 0) {
                component.showEquiped();
            }
            else {
                component.showNormal();
            }
            component.setEquiped(equippedIdx >= 0);
        }
        item = this.listView.getMatchItem((node: cc.Node) => {
            return node.getComponent(PartnerListItemUI).itemId == prev;
        });
        if (item) {
            const data = Model.partner.getData(prev);
            const component = item.getComponent(PartnerListItemUI);
            const maxCnt = Model.partner.getLvupMaxCnt(prev, data.level);
            const qualityInfo = _PartnerConfig.Instance.get(prev);
            const currentLevel = (data.level != null) ? data.level : 1;
            const maxLevel = _PartnerLevelConfig.Instance.getMaxLevel(qualityInfo.quality);
            component.setLevel(data.level);
            component.setProgress(data.count, maxCnt, currentLevel >= maxLevel);
            component.setRedPoint(data.count >= maxCnt && currentLevel < maxLevel || currentLevel >= maxLevel && qualityInfo.next > 0 && data.count >= GameConst.PARTNERMAXLEVEL_NUM);
        }
    }
    onTransAll(): void {
        this.refreshBtnStatus();
        this.refreshOwnedAtkValue();
        this.refreshBtnStatus();
        const items = this.listView.getItems();
        _.forEach(items, (item: cc.Node) => {
            if (!_.isNil(item)) {
                const component = item.getComponent(PartnerListItemUI);
                const data = Model.partner.getData(component.itemId);
                if (data) {
                    const maxCnt = Model.partner.getLvupMaxCnt(component.itemId, data.level);
                    const qualityInfo = _PartnerConfig.Instance.get(component.itemId);
                    const currentLevel = (data.level != null) ? data.level : 1;
                    const maxLevel = _PartnerLevelConfig.Instance.getMaxLevel(qualityInfo.quality);
                    component.setLevel(data.level);
                    component.setProgress(data.count, maxCnt, currentLevel >= maxLevel);
                    component.setRedPoint(data.count >= maxCnt && currentLevel < maxLevel || currentLevel >= maxLevel && qualityInfo.next > 0 && data.count >= GameConst.PARTNERMAXLEVEL_NUM);
                    const equippedIdx = Model.partner.getEquipedIdx(qualityInfo.id);
                    if (equippedIdx >= 0) {
                        component.showEquiped();
                    }
                    else {
                        component.showNormal();
                    }
                    component.setEquiped(equippedIdx >= 0);
                }
                else {
                    component.showLocked();
                }
            }
        });
    }
    openDetail(e: any): void {
        Model.ui.openViewAsync(MapUIPrefabs.PartnerDetail, {
            data: e,
        });
    }
    refreshBtnStatus(): void {
        this.btnEnhanceAll.interactable =
            Model.partner.lvupAllEnable() ||
                Model.partner.transNextAllEnable();
    }
    refreshCandidateInfo(): void {
        const e = Model.partner.getData(this.candidateId);
        const t = _PartnerConfig.Instance.get(this.candidateId);
        const n = _PartnerLevelConfig.Instance.getMaxLevel(t.quality);
        this.candidateItem.setQualityValue(t.quality);
        this.candidateItem.setIcon(t.icon);
        this.candidateItem.setLevel(e.level);
        const o = Model.partner.getLvupMaxCnt(t.id, e.level);
        this.candidateItem.setProgress(e.count, o, e.level >= n);
    }
    refreshList(): void {
        const e = Model.partner.getAllPartners();
        this.setDataSet(e);
        this.listView.notifyUpdate();
    }
    refreshListItem(e: number): void {
        if (!(e < 0)) {
            const t = this.listView.getMatchItem((t) => {
                return t.getComponent(PartnerListItemUI).itemId == e;
            });
            if (t) {
                const n = Model.partner.getData(e);
                const o = t.getComponent(PartnerListItemUI);
                if (n) {
                    const r = Model.partner.getEquipedIdx(e);
                    r >= 0 ? o.showEquiped() : o.showNormal();
                    o.setEquiped(r >= 0);
                }
                else {
                    o.showLocked();
                }
            }
        }
    }
    refreshOwnedAtkValue() {
        let e = Model.partner.allOwnedAtk;
        this.ownedAtkValue.string = LanMgr.Instance.getLangByID("ATK") + " +" + NumberPlus.format(e) + "%";
    }
    refreshSlots(): void {
        this.slots.refreshEquips(Model.partner.equippedIds);
    }
    updateView(e, t, n) {
        let o = n.cfg;
        let r = Model.partner.getData(o.id);
        let i = e.getComponent(PartnerListItemUI);
        i.delegate = this;
        i.itemId = o.id;
        i.setIcon(o.icon);
        i.setQualityValue(o.quality);
        let a = (null == r ? void 0 : r.level) || 1;
        let c = (null == r ? void 0 : r.count) || 0;
        let l = Model.partner.getLvupMaxCnt(o.id, a);
        let u = _PartnerLevelConfig.Instance.getMaxLevel(o.quality);
        if (i.setLevel(a), i.setProgress(c, l, a >= u), i.setRedPoint(c >= l && a < u || a >= u && o.next > 0 && c >= GameConst.PARTNERMAXLEVEL_NUM), r) {
            let p = Model.partner.getEquipedIdx(o.id);
            p >= 0 ? i.showEquiped() : i.showNormal(),
                i.setEquiped(p >= 0);
        }
        else {
            i.showLocked();
        }
        if (o.id == Model.partner.getMaxOwnId()) {
            (i.getComponent(GuideTouch) || i.addComponent(GuideTouch).setId(SpecialGuideEnum.TouchPartnerItem),
                GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchPartnerItem));
        }
    }
}
