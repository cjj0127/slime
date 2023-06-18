import { SkillDetailViewUI } from "./SkillDetailViewUI";
import GuideMgr from "../guide/GuideMgr";
import GuideTouch from "../guide/GuideTouch";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import { PAGE_EVENTS } from "../common/ToggleToPage";
import { GlobalEventName } from "../common/Events";
import { MapUIPrefabs, E_ENHANCE_TYPE, E_MenuPageId, E_ToggleShopType, GameConst, E_MenuToggleType } from "../common/Const";
import ListView from "../../ccstudio/display/ListView";
import ListViewAdapter from "../../ccstudio/display/ListViewAdapter";
import SkillModel from "../../ccstudio/data/SkillModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import _SkillConfig from "../../ccstudio/config/_SkillConfig";
import _SkillLevelConfig from "../../ccstudio/config/_SkillLevelConfig";
import CandidateItemUI from "../battle/CandidateItemUI";
import SkillListItemUI from "./SkillListItemUI";
import SlotsUI from "../battle/SlotsUI";
import UnlockCtrl from "../unlock/UnlockCtrl";
const T: any = window["_"];
const { ccclass, property } = cc._decorator;
export enum UiMode {
    Normall = 1,
    SelectSolt = 2
}
@ccclass
export default class SkillViewUI extends ListViewAdapter {
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Button)
    btnEnhanceAll: cc.Button = null;
    @property(cc.Button)
    btnSummon: cc.Button = null;
    candidateId: number = -1;
    @property(CandidateItemUI)
    candidateItem: CandidateItemUI = null;
    @property(ListView)
    listView: ListView = null;
    @property(SlotsUI)
    slots: SlotsUI = null;
    uiMode: UiMode = UiMode.Normall;
    public changeUIMode(): void {
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
    checkUnlockSkillSlot(e: number) {
        const t = this.slots[Model.skill.convertSkillSysIdToSlotIndex(e)];
        if (t) {
            UnlockCtrl.Instance.isUnlock(e) ? t.hideLock() : t.showLock();
        }
    }
    getItemInfo(e: number) {
        const t = _SkillConfig.Instance.get(e);
        return {
            icon: t.icon,
            quality: t.quality,
            name: t.name
        };
    }
    isLocked(e: number) {
        return Model.skill.isLocked(e);
    }
    isWaitUnLock(e: number) {
        return Model.skill.isWaitUnLock(e);
    }
    public onClickCandidateParent(): void {
        this.uiMode = UiMode.Normall;
        this.changeUIMode();
    }
    onClickClose() {
        cc.director.emit(GlobalEventName.ClosePageView, E_MenuToggleType.Hero);
    }
    public onClickEnhanceAll(): void {
        const transResults = Model.skill.transNextAll();
        if (transResults.length > 0) {
            Model.ui.addViewAsyncQueue(MapUIPrefabs.TransResult, {
                data: {
                    type: E_ENHANCE_TYPE.Skill,
                    results: transResults,
                },
            });
        }
        const enhanceResults = Model.skill.lvupAll();
        if (enhanceResults.length > 0) {
            Model.ui.addViewAsyncQueue(MapUIPrefabs.EnhanceResult, {
                data: {
                    type: E_ENHANCE_TYPE.Skill,
                    results: enhanceResults,
                },
            });
        }
    }
    public onClickSummon(): void {
        cc.director.emit(GlobalEventName.ChangeMenu, E_MenuPageId.Shop, E_ToggleShopType.Summon);
    }
    onEquipSelectSolt(e: number) {
        this.candidateId = e;
        this.uiMode = UiMode.SelectSolt;
        this.changeUIMode();
    }
    onLevelUp(e: {
        id: number;
    }) {
        const t = e.id;
        this.refreshBtnStatus();
        const n = this.listView.getMatchItem((item) => item.getComponent(SkillListItemUI).itemId == t);
        const o = Model.skill.getData(t);
        const r = _SkillConfig.Instance.get(t);
        const i = n.getComponent(SkillListItemUI);
        const a = (o?.level) || 1;
        const c = (o?.count) || 0;
        const u = Model.skill.getLvupMaxCnt(t, a);
        const p = _SkillLevelConfig.Instance.getMaxLevel(r.quality);
        i.setLevel(a);
        i.setProgress(c, u, a >= p);
        i.setRedPoint(c >= u && a < p || a >= p && r.next > 0 && c >= GameConst.SKILLMAXLEVEL_NUM);
        const f = Model.skill.getEquipedIdx(t);
        if (f >= 0) {
            this.slots.refreshSlot(t, f);
        }
    }
    onLevelUpAll(e: {
        id: number;
    }[]) {
        const t = this;
        this.refreshBtnStatus();
        const n = this.listView.getItems();
        T.each(n, (item) => {
            if (!T.isNil(item)) {
                const t = item.getComponent(SkillListItemUI);
                const n = Model.skill.getData(t.itemId);
                const o = _SkillConfig.Instance.get(t.itemId);
                const r = (n?.level) || 1;
                const i = (n?.count) || 0;
                const a = Model.skill.getLvupMaxCnt(t.itemId, r);
                const c = _SkillLevelConfig.Instance.getMaxLevel(o.quality);
                t.setLevel(r);
                t.setProgress(i, a, r >= c);
                t.setRedPoint(i >= a && r < c || r >= c && o.next > 0 && i >= GameConst.SKILLMAXLEVEL_NUM);
            }
        });
        T.each(e, (item) => {
            const n = item.id;
            const o = Model.skill.getEquipedIdx(n);
            if (o >= 0) {
                t.slots.refreshSlot(n, o);
            }
        });
    }
    onListItemClick(e: any) {
        this.openDetail(e.itemId);
    }
    onListItemEquip(e: any) {
        if (GuideMgr.instance.skipGuide || GuideMgr.instance.isCompleteSpecialGuide(SpecialGuideEnum.TouchSkillItem)) {
            const t = e.itemId;
            if (Model.skill.getData(t)) {
                let n = Model.skill.getEquipedIdx(t);
                if (n >= 0) {
                    Model.skill.unequip(n);
                }
                else {
                    n = Model.skill.findEmptySolt();
                    if (n >= 0) {
                        Model.skill.equip(n, t);
                    }
                    else {
                        cc.director.emit(GlobalEventName.SkillOpenUIEquipSelectSlot, t);
                    }
                }
            }
            else {
                this.openDetail(t);
            }
        }
    }
    // private listView: cc.Node;
    // private slots: any;
    // private candidateItem: cc.Node;
    // private btnEnhanceAll: cc.Node;
    // private btnSummon: cc.Node;
    // private node: cc.Node;
    // private btnClose: cc.Node;
    // private uiMode: number;
    onLoad() {
        this.listView.setAdapter(this);
        this.slots.delegate = this;
        this.candidateItem.node.parent.on("click", this.onClickCandidateParent, this);
        this.btnEnhanceAll.node.on("click", this.onClickEnhanceAll, this);
        this.btnSummon.node.on("click", this.onClickSummon, this);
        this.node.on(PAGE_EVENTS.PageEnter, this.onPageEnter, this);
        this.node.on(PAGE_EVENTS.PageExit, this.onPageExit, this);
        this.btnClose.node.on("click", this.onClickClose, this);
    }
    // @I.default
    // public slots: any;
    // @u.default
    // public listView: any;
    // @g.default
    // public candidateItem: any;
    // @cc.Button
    // public btnEnhanceAll: cc.Button | null = null;
    // @cc.Button
    // public btnSummon: cc.Button | null = null;
    // @cc.Button
    // public btnClose: cc.Button | null = null;
    // private uiMode: a = a.Normall;
    // private candidateId: string = "";
    public onOwnedChange(): void {
        this.listView.notifyUpdate();
        this.refreshBtnStatus();
    }
    onPageEnter() {
        this.refreshList();
        this.refreshSlots();
        this.refreshBtnStatus();
        this.uiMode = UiMode.Normall;
        this.changeUIMode();
        cc.director.on(GlobalEventName.UnlockSkill, this.checkUnlockSkillSlot, this);
        cc.director.on(GlobalEventName.UnlockSkillCol2, this.checkUnlockSkillSlot, this);
        cc.director.on(GlobalEventName.UnlockSkillCol3, this.checkUnlockSkillSlot, this);
        cc.director.on(GlobalEventName.UnlockSkillCol4, this.checkUnlockSkillSlot, this);
        cc.director.on(GlobalEventName.UnlockSkillCol5, this.checkUnlockSkillSlot, this);
        cc.director.on(GlobalEventName.UnlockSkillCol6, this.checkUnlockSkillSlot, this);
        cc.director.on(GlobalEventName.SkillOpenUIEquipSelectSlot, this.onEquipSelectSolt, this);
        cc.director.on(GlobalEventName.SkillEquipedChange, this.onSlotEquipChange, this);
        cc.director.on(GlobalEventName.SkillLevelUp, this.onLevelUp, this);
        cc.director.on(GlobalEventName.SkillLevelUpAll, this.onLevelUpAll, this);
        cc.director.on(GlobalEventName.SkillTrans, this.onTrans, this);
        cc.director.on(GlobalEventName.SkillTransAll, this.onTransAll, this);
        cc.director.on(GlobalEventName.SkillOwnedChange, this.onOwnedChange, this);
    }
    onPageExit() {
        cc.director.targetOff(this);
    }
    onSelectSlot(e: number) {
        if (this.uiMode == UiMode.Normall) {
            const t = Model.skill.getEquipedId(e);
            if (t >= 0)
                this.openDetail(t);
        }
        else {
            if (this.isLocked(e)) {
                console.log("未解锁");
                return;
            }
            Model.skill.equip(e, this.candidateId);
            this.uiMode = UiMode.Normall;
            this.changeUIMode();
        }
    }
    onSlotEquipChange(e: number) {
        const t = Model.skill.getEquipedId(e);
        this.slots.refreshSlot(t, e);
        this.listView.notifyUpdate();
    }
    onTrans(e: {
        id: number;
        prev: number;
    }) {
        const t = e.id;
        const n = e.prev;
        this.refreshBtnStatus();
        let o = this.listView.getMatchItem((item) => item.getComponent(SkillListItemUI).itemId == t);
        if (o) {
            const r = Model.skill.getData(t);
            const i = _SkillConfig.Instance.get(t);
            const a = o.getComponent(SkillListItemUI);
            const c = (r?.level) || 1;
            const u = (r?.count) || 0;
            const p = Model.skill.getLvupMaxCnt(t, c);
            const f = _SkillLevelConfig.Instance.getMaxLevel(i.quality);
            a.setLevel(c);
            a.setProgress(u, p, c >= f);
            a.setRedPoint(u >= p && c < f || c >= f && i.next > 0 && u >= GameConst.SKILLMAXLEVEL_NUM);
            const d = Model.skill.getEquipedIdx(i.id);
            if (d >= 0) {
                a.showEquiped();
            }
            else {
                a.showNormal();
            }
            a.setEquiped(d >= 0);
        }
        o = this.listView.getMatchItem((item) => item.getComponent(SkillListItemUI).itemId == n);
        if (o) {
            const r = Model.skill.getData(n);
            const i = _SkillConfig.Instance.get(n);
            const a = o.getComponent(SkillListItemUI);
            const c = (r?.level) || 1;
            const u = (r?.count) || 0;
            const p = Model.skill.getLvupMaxCnt(n, c);
            const f = _SkillLevelConfig.Instance.getMaxLevel(i.quality);
            a.setLevel(c);
            a.setProgress(u, p, c >= f);
            a.setRedPoint(u >= p && c < f || c >= f && i.next > 0 && u >= GameConst.SKILLMAXLEVEL_NUM);
            const g = Model.skill.getEquipedIdx(n);
            if (g >= 0) {
                a.showEquiped();
            }
            else {
                a.showNormal();
            }
            a.setEquiped(g >= 0);
        }
        let g = Model.skill.getEquipedIdx(t);
        if (g >= 0) {
            this.slots.refreshSlot(t, g);
        }
        g = Model.skill.getEquipedIdx(n);
        if (g >= 0) {
            this.slots.refreshSlot(n, g);
        }
    }
    onTransAll(e: {
        id: number;
        prev: number;
    }[]) {
        const t = this;
        this.refreshBtnStatus();
        const n = this.listView.getItems();
        T.each(n, (item) => {
            if (!T.isNil(item)) {
                const t = item.getComponent(SkillListItemUI);
                const n = Model.skill.getData(t.itemId);
                const o = _SkillConfig.Instance.get(t.itemId);
                const r = (n?.level) || 1;
                const i = (n?.count) || 0;
                const a = Model.skill.getLvupMaxCnt(t.itemId, r);
                const c = _SkillLevelConfig.Instance.getMaxLevel(o.quality);
                t.setLevel(r);
                t.setProgress(i, a, r >= c);
                t.setRedPoint(i >= a && r < c || r >= c && o.next > 0 && i >= GameConst.SKILLMAXLEVEL_NUM);
                const u = Model.skill.getEquipedIdx(o.id);
                if (u >= 0) {
                    t.showEquiped();
                }
                else {
                    t.showNormal();
                }
                t.setEquiped(u >= 0);
            }
        });
        T.each(e, (item) => {
            const n = item.id;
            const o = item.prev;
            let r = Model.skill.getEquipedIdx(n);
            if (r >= 0) {
                t.slots.refreshSlot(n, r);
            }
            r = Model.skill.getEquipedIdx(o);
            if (r >= 0) {
                t.slots.refreshSlot(o, r);
            }
        });
    }
    openDetail(e: number) {
        Model.ui.openViewAsync(MapUIPrefabs.SkillDetail, {
            viewComp: SkillDetailViewUI,
            data: e
        });
    }
    public refreshBtnStatus(): void {
        this.btnEnhanceAll.interactable = Model.skill.lvupAllEnable() || Model.skill.transNextAllEnable();
    }
    public refreshCandidateInfo(): void {
        const candidate = _SkillConfig.Instance.get(this.candidateId);
        const data = Model.skill.getData(this.candidateId);
        this.candidateItem.setQualityValue(candidate.quality);
        this.candidateItem.setIcon(candidate.icon);
        this.candidateItem.setLevel(data.level);
        const maxCnt = Model.skill.getLvupMaxCnt(this.candidateId, data.level);
        this.candidateItem.setProgress(data.count, maxCnt);
    }
    public refreshList(): void {
        const skills = Model.skill.getAllSkills();
        this.setDataSet(skills);
        this.listView.notifyUpdate();
    }
    public refreshSlots(): void {
        this.slots.refreshEquips(Model.skill.equippedIds);
    }
    removeEquipSlot(e: number) {
        Model.skill.unequip(e);
    }
    updateView(e: cc.Node, t: any, n: any) {
        const o = n.cfg;
        const r = Model.skill.getData(o.id);
        const i = e.getComponent(SkillListItemUI);
        i.delegate = this;
        i.itemId = o.id;
        i.setIcon(o.icon);
        i.setQualityValue(o.quality);
        const a = (r?.level) || 1;
        const c = (r?.count) || 0;
        const l = Model.skill.getLvupMaxCnt(o.id, a);
        const u = _SkillLevelConfig.Instance.getMaxLevel(o.quality);
        i.setLevel(a);
        i.setProgress(c, l, a >= u);
        i.setRedPoint(c >= l && a < u || a >= u && o.next > 0 && c >= GameConst.SKILLMAXLEVEL_NUM);
        if (r) {
            const p = Model.skill.getEquipedIdx(o.id);
            if (p >= 0)
                i.showEquiped();
            else
                i.showNormal();
            i.setEquiped(p >= 0);
        }
        else {
            i.showLocked();
        }
        if (o.id == Model.skill.getMaxOwnId()) {
            if (!e.getComponent(GuideTouch)) {
                e.addComponent(GuideTouch).setId(SpecialGuideEnum.TouchSkillItem);
            }
            this.scheduleOnce(() => {
                GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchSkillItem);
            }, .1);
        }
    }
}
