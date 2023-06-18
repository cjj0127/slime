import GuideMgr from "../guide/GuideMgr";
import GuideTouch from "../guide/GuideTouch";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import { GlobalEventName } from "../common/Events";
import { E_GEAR_TYPE, GameConst, E_MenuPageId, E_ToggleShopType, MapUIPrefabs, E_ENHANCE_TYPE } from "../common/Const";
import _GearConfig from "../../ccstudio/config/_GearConfig";
import _GearLevelConfig from "../../ccstudio/config/_GearLevelConfig";
import GearModel from "../../ccstudio/data/GearModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import UIListViewItem from "../../ccstudio/display/UIListViewItem";
import UIPool from "../common/UIPool";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
// n.default = P
const _: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class GearViewUI extends UIPool {
    @property({ type: cc.Button })
    btnEnhanceAll: cc.Button = null;
    @property({ type: cc.Button })
    btnSummon: cc.Button = null;
    @property({ type: Object })
    gearDetailInfo: any = null;
    @property({ type: cc.Integer })
    gearType: number = E_GEAR_TYPE.WEAPON;
    @property({ type: cc.Layout })
    layout: cc.Layout = null;
    list: any = {};
    onArmorChange(e, t) {
        if (this.gearType == E_GEAR_TYPE.ARMOR) {
            this.gearDetailInfo.refreshDetail();
            this.gearDetailInfo.refreshBtnStatus();
            this.gearDetailInfo.refrshEquipRed();
            this.refreshEquipedInfo(e, t);
            this.refreshMaxRed();
        }
    }
    onClickEnhanceAll() {
        let transResults = Model.gear.transNextAll(this.gearType);
        if (transResults.length > 0) {
            Model.ui.addViewAsyncQueue(MapUIPrefabs.TransResult, {
                data: {
                    type: E_ENHANCE_TYPE.Gear,
                    results: transResults
                }
            });
        }
        let lvupResults = Model.gear.lvupAll(this.gearType);
        if (lvupResults.length > 0) {
            Model.ui.addViewAsyncQueue(MapUIPrefabs.EnhanceResult, {
                data: {
                    type: E_ENHANCE_TYPE.Gear,
                    results: lvupResults
                }
            });
        }
    }
    onClickSummon() {
        this.node.emit("Close");
        cc.director.emit(GlobalEventName.ChangeMenu, E_MenuPageId.Shop, E_ToggleShopType.Summon);
    }
    onClose() {
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchArmorView);
        this.getComponent(ViewAnimCtrl).onClose();
    }
    onEnable() {
        let currEquipId = Model.gear.getCurrEquipId(this.gearType);
        if (currEquipId < 0) {
            let gears = _GearConfig.Instance.getGears(this.gearType);
            currEquipId = _.first(gears).id;
        }
        this.gearDetailInfo.selectId = currEquipId;
        this.refreshList();
        this.refreshBtnStatus();
        cc.director.on(GlobalEventName.GearLevelUp, this.onLevelUp, this);
        cc.director.on(GlobalEventName.GearLevelUpAll, this.onLevelUpAll, this);
        cc.director.on(GlobalEventName.GearTrans, this.onTrans, this);
        cc.director.on(GlobalEventName.GearTransAll, this.onTransAll, this);
        cc.director.on(GlobalEventName.EquipWeaponChange, this.onWeaponChange, this);
        cc.director.on(GlobalEventName.EquipArmorChange, this.onArmorChange, this);
    }
    onLevelUp(e) {
        const t = e.id;
        if (Model.gear.getData(t).type == this.gearType) {
            const n = this.list[t];
            if (n) {
                const o = n.getComponent(UIListViewItem);
                const r = Model.gear.getData(o.itemId);
                const i = (null == r ? undefined : r.level) || 1;
                const s = (null == r ? undefined : r.count) || 0;
                const u = Model.gear.getLvupMaxCnt(o.itemId, i);
                const p = _GearConfig.Instance.get(t);
                const f = _GearLevelConfig.Instance.getMaxLevel(p.quality);
                o.setLevel(i);
                o.setProgress(s, u, i >= f);
                o.setRedPoint(s >= u && i < f || i >= f && p.next > 0 && s >= GameConst.GEARMAXLEVEL_NUM);
            }
        }
        if (this.gearDetailInfo.selectId == t) {
            this.gearDetailInfo.refreshDetail();
            this.gearDetailInfo.refreshBtnStatus();
        }
        this.refreshMaxRed();
        this.refreshBtnStatus();
    }
    onLevelUpAll(e) {
        if (e == this.gearType) {
            const t = this.list;
            _.each(t, (e) => {
                if (!_.isNil(e)) {
                    const t = e.getComponent(UIListViewItem);
                    const n = Model.gear.getData(t.itemId);
                    const o = (null == n ? undefined : n.level) || 1;
                    const r = (null == n ? undefined : n.count) || 0;
                    const i = Model.gear.getLvupMaxCnt(t.itemId, o);
                    const s = _GearConfig.Instance.get(t.itemId);
                    const u = _GearLevelConfig.Instance.getMaxLevel(s.quality);
                    t.setLevel(o);
                    t.setProgress(r, i, o >= u);
                    t.setRedPoint(r >= i && o < u || o >= u && s.next > 0 && r >= GameConst.GEARMAXLEVEL_NUM);
                }
            });
        }
        this.gearDetailInfo.refreshDetail();
        this.gearDetailInfo.refreshBtnStatus();
        this.refreshBtnStatus();
        this.refreshMaxRed();
    }
    onListItemClick(e) {
        this.gearDetailInfo.selectId = e.itemId;
        this.scheduleOnce(() => {
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchEquipWeaponButton);
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchEquipArmorButton);
        }, .1);
    }
    // private gearDetailInfo: any;
    // private btnSummon: cc.Button;
    // private btnEnhanceAll: cc.Button;
    // private layout: cc.Layout;
    onLoad() {
        this.gearDetailInfo.gearType = this.gearType;
        this.btnSummon.node.on("click", this.onClickSummon, this);
        this.btnEnhanceAll.node.on("click", this.onClickEnhanceAll, this);
    }
    onTrans(e) {
        const o = e.id;
        const r = e.prev;
        let t, n, s, u, p, d, g;
        if ((n = Model.gear.getData(o)).type == this.gearType && (t = this.list[o])) {
            s = t.getComponent(UIListViewItem);
            u = (null == (n = Model.gear.getData(s.itemId)) ? undefined : n.level) || 1;
            p = (null == n ? undefined : n.count) || 0;
            d = Model.gear.getLvupMaxCnt(s.itemId, u);
            g = _GearConfig.Instance.get(o);
            const q = _GearLevelConfig.Instance.getMaxLevel(g.quality);
            s.setLevel(u);
            s.setProgress(p, d, u >= q);
            s.setRedPoint(p >= d && u < q || u >= q && g.next > 0 && p >= GameConst.GEARMAXLEVEL_NUM);
            if (n) {
                Model.gear.getCurrEquipId(this.gearType) == g.id ? s.showEquiped() : s.showNormal();
            }
            else {
                s.showLocked();
            }
        }
        if ((n = Model.gear.getData(r)).type == this.gearType && (t = this.list[r])) {
            s = t.getComponent(UIListViewItem);
            u = (null == (n = Model.gear.getData(s.itemId)) ? undefined : n.level) || 1;
            p = (null == n ? undefined : n.count) || 0;
            d = Model.gear.getLvupMaxCnt(s.itemId, u);
            g = _GearConfig.Instance.get(r);
            const q = _GearLevelConfig.Instance.getMaxLevel(g.quality);
            s.setLevel(u);
            s.setProgress(p, d, u >= q);
            s.setRedPoint(p >= d && u < q || u >= q && g.next > 0 && g.next > 0 && p >= GameConst.GEARMAXLEVEL_NUM);
        }
        if (this.gearDetailInfo.selectId == o || this.gearDetailInfo.selectId == r) {
            this.gearDetailInfo.refreshDetail();
            this.gearDetailInfo.refreshBtnStatus();
        }
        this.refreshMaxRed();
        this.refreshBtnStatus();
    }
    onTransAll(e) {
        if (e == this.gearType) {
            const t = this.list;
            t.forEach((e) => {
                if (!_.isNil(e)) {
                    const n = e.getComponent(UIListViewItem);
                    const o = Model.gear.getData(n.itemId);
                    const r = (null == o ? undefined : o.level) || 1;
                    const i = (null == o ? undefined : o.count) || 0;
                    const s = Model.gear.getLvupMaxCnt(n.itemId, r);
                    const u = _GearConfig.Instance.get(n.itemId);
                    const p = _GearLevelConfig.Instance.getMaxLevel(u.quality);
                    n.setLevel(r);
                    n.setProgress(i, s, r >= p);
                    n.setRedPoint(i >= s && r < p || r >= p && u.next > 0 && i >= GameConst.GEARMAXLEVEL_NUM);
                    if (o) {
                        Model.gear.getCurrEquipId(this.gearType) == u.id ? n.showEquiped() : n.showNormal();
                    }
                    else {
                        n.showLocked();
                    }
                }
            });
            this.gearDetailInfo.refreshDetail();
            this.gearDetailInfo.refreshBtnStatus();
            this.refreshBtnStatus();
            this.refreshMaxRed();
        }
    }
    onWeaponChange(e, t) {
        if (this.gearType == E_GEAR_TYPE.WEAPON) {
            this.gearDetailInfo.refreshDetail();
            this.gearDetailInfo.refreshBtnStatus();
            this.gearDetailInfo.refrshEquipRed();
            this.refreshEquipedInfo(e, t);
            this.refreshMaxRed();
        }
    }
    refreshBtnStatus(): void {
        this.btnEnhanceAll.interactable =
            Model.gear.lvupAllEnable(this.gearType) ||
                Model.gear.transNextAllEnable(this.gearType);
    }
    refreshEquipedInfo(e, t) {
        let n;
        if (e >= 0 && (n = this.list[e])) {
            n.getComponent(UIListViewItem).showEquiped();
        }
        if (t >= 0 && (n = this.list[t])) {
            n.getComponent(UIListViewItem).showNormal();
        }
    }
    refreshList() {
        if (_.keys(this.list).length == 0) {
            let gears = Model.gear.getAllGears(this.gearType);
            _.each(gears, (t) => {
                let cfg = t.cfg;
                let item = this.get();
                item.parent = this.layout.node;
                let view = item.getComponent(UIListViewItem);
                this.updateView(view, t);
                this.list[cfg.id] = view;
            });
        }
        else {
            let gears = Model.gear.getAllGears(this.gearType);
            _.each(gears, (t) => {
                let cfg = t.cfg;
                let view = this.list[cfg.id];
                this.updateView(view, t);
            });
        }
        this.scheduleOnce(() => {
            let selectId = this.gearDetailInfo.selectId;
            let selectItem = this.list[selectId];
            this.showSelectItem(selectItem);
            this.refreshMaxRed();
        }, 0);
    }
    refreshMaxRed(): void {
        const currEquipId = Model.gear.getCurrEquipId(this.gearType);
        const maxOwnGear = Model.gear.getMaxOwnGear(this.gearType);
        const list = this.list;
        _.each(list, (n) => {
            if (!_.isNil(n)) {
                const o = n.getComponent(UIListViewItem);
                o.setMaxPoint(o.itemId == maxOwnGear && currEquipId !== maxOwnGear);
            }
        });
    }
    showSelectItem(e) {
        e.getComponent(cc.Toggle).check();
    }
    //     t.prototype.updateView = function(e, t) {
    //         e.delegate = this;
    //         var n = t.cfg,
    //         o = t.data;
    //         e.itemId = n.id,
    //         e.setIcon(n.icon),
    //         e.setQualityValue(n.quality);
    //         var r = (null == o ? void 0 : o.level) || 1,
    //         i = (null == o ? void 0 : o.count) || 0,
    //         s = Model.gear.getLvupMaxCnt(n.id, r),
    //         c = _GearLevelConfig.Instance.getMaxLevel(n.quality);
    //         e.setLevel(r),
    //         e.setProgress(i, s, r >= c),
    //         e.setRedPoint(i >= s && r < c || r >= c && n.next > 0 && i >= GameConst.GEARMAXLEVEL_NUM),
    //         o ? Model.gear.getCurrEquipId(this.gearType) == n.id ? e.showEquiped() : e.showNormal() : e.showLocked(),
    //         Model.gear.getMaxOwnGear(this.gearType) == n.id && (e.node.getComponent(d.default) || (e.node.addComponent(d.default).setId(SpecialGuideEnum.TouchWeaponItem), e.node.addComponent(d.default).setId(SpecialGuideEnum.TouchArmorItem)), GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchWeaponItem), GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchArmorItem))
    //     },
    updateView(e: UIListViewItem, t: any) {
        e.delegate = this;
        let cfg = t.cfg;
        let data = t.data;
        e.itemId = cfg.id;
        e.setIcon(cfg.icon);
        e.setQualityValue(cfg.quality);
        let level = (data ? data.level : undefined) || 1;
        let count = (data ? data.count : undefined) || 0;
        let maxCnt = Model.gear.getLvupMaxCnt(cfg.id, level);
        let maxLevel = _GearLevelConfig.Instance.getMaxLevel(cfg.quality);
        e.setLevel(level);
        e.setProgress(count, maxCnt, level >= maxLevel);
        e.setRedPoint(count >= maxCnt && level < maxLevel || level >= maxLevel && cfg.next > 0 && count >= GameConst.GEARMAXLEVEL_NUM);
        if (data) {
            if (Model.gear.getCurrEquipId(this.gearType) == cfg.id) {
                e.showEquiped();
            }
            else {
                e.showNormal();
            }
        }
        else {
            e.showLocked();
        }
        if (Model.gear.getMaxOwnGear(this.gearType) == cfg.id) {
            if (!e.node.getComponent(GuideTouch)) {
                e.node.addComponent(GuideTouch).setId(SpecialGuideEnum.TouchWeaponItem);
                e.node.addComponent(GuideTouch).setId(SpecialGuideEnum.TouchArmorItem);
            }
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchWeaponItem);
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchArmorItem);
        }
    }
    ;
}
