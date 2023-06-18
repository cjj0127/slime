import { MenuPage } from "./MenuPage";
import GuideMgr from "../guide/GuideMgr";
import MenuItem from "./MenuItem";
import UnlockCtrl from "../unlock/UnlockCtrl";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import { EInsertAdType, EOpenUIType } from "../common/ViedioType";
import { GlobalEventName } from "../common/Events";
import { EUNLOCKSYS_ID, MapUIPrefabs } from "../common/Const";
import AdsModel from "../../ccstudio/data/AdsModel";
import PartnerModel from "../../ccstudio/data/PartnerModel";
import Model from "../../ccstudio/data/Model";
// n.default = b
const _: any = window["_"];
const { ccclass, property } = cc._decorator;
@ccclass
export default class Menu extends cc.Component {
    // @property(cc.Node)
    // toggleContainer: cc.Node = null;
    // @property(cc.Node)
    // menuPageContent: cc.Node = null;
    // @property([cc.Toggle])
    // menuToggles: cc.Toggle[] = [];
    _lastToggle: cc.Toggle = null;
    @property({ type: MenuPage })
    menuPageContent: MenuPage = null;
    @property([cc.Toggle])
    menuToggles: cc.Toggle[] = [];
    @property(cc.ToggleContainer)
    toggleContainer: cc.ToggleContainer = null;
    check(e: number, t: boolean) {
        const n = this.toggleContainer.toggleItems;
        const o = _.find(n, (toggle: cc.Toggle) => toggle.getComponent(MenuItem).pageId == e);
        o.isChecked = true;
        this.onToggleMenu(o, t);
    }
    checkLock(e: EUNLOCKSYS_ID) {
        let t = 0;
        if (e == EUNLOCKSYS_ID.Partner) {
            t = 1;
        }
        else if (e == EUNLOCKSYS_ID.BossRush) {
            t = 2;
        }
        else if (e == EUNLOCKSYS_ID.Mine) {
            t = 3;
        }
        else if (e == EUNLOCKSYS_ID.Shop) {
            t = 4;
        }
        const n = UnlockCtrl.Instance.isUnlock(e);
        const o = _.find(this.toggleContainer.toggleItems, (toggle: cc.Toggle) => toggle.getComponent(MenuItem).pageId == t);
        if (o) {
            UnlockCtrl.Instance.refreshUnlockState(n, o, e);
        }
    }
    closePageView(e: number, t: boolean) {
        this.menuToggles[e].isChecked = false;
        this.onToggleMenu(this.menuToggles[e], t);
    }
    getAdsNameByToggleName(e: string) {
        let t = "";
        switch (e) {
            case "toggle1":
                t = EOpenUIType.Hero;
                break;
            case "toggle2":
                t = EOpenUIType.Partner;
                break;
            case "toggle3":
                t = EOpenUIType.Battle;
                break;
            case "toggle4":
                t = EOpenUIType.Mine;
                break;
            case "toggle5":
                t = EOpenUIType.Shop;
        }
        return t;
    }
    onChangeMenu(e: EUNLOCKSYS_ID, t: boolean) {
        this.check(e, t);
    }
    onCloseAllView() {
        if (this.lastToggle) {
            this.lastToggle.uncheck();
        }
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        cc.director.on(GlobalEventName.ChangeMenu, this.onChangeMenu, this);
        cc.director.on(GlobalEventName.CloseAllView, this.onCloseAllView, this);
        cc.director.on(GlobalEventName.UnlockPartner, this.checkLock, this);
        cc.director.on(GlobalEventName.UnlockBossRush, this.checkLock, this);
        cc.director.on(GlobalEventName.UnlockMine, this.checkLock, this);
        cc.director.on(GlobalEventName.UnlockShop, this.checkLock, this);
        cc.director.on(GlobalEventName.ShowPageView, this.showPageView, this);
        cc.director.on(GlobalEventName.ClosePageView, this.closePageView, this);
    }
    onLoad() {
        const t = this.toggleContainer.toggleItems;
        t.forEach((toggle: cc.Toggle) => {
            toggle.node.on("toggle", this.onToggleMenu, this);
        });
        this.checkLock(EUNLOCKSYS_ID.Partner);
        this.checkLock(EUNLOCKSYS_ID.BossRush);
        this.checkLock(EUNLOCKSYS_ID.Mine);
        this.checkLock(EUNLOCKSYS_ID.Shop);
    }
    onToggleMenu(e: cc.Toggle, t: boolean) {
        if (e.isChecked) {
            if ((e.enabled = false, this.scheduleOnce(() => e.enabled = true, 0.15), null != this.lastToggle && "toggle3" != this.lastToggle.node.name)) {
                const n = this.getAdsNameByToggleName(this.lastToggle.node.name);
                Model.ad.showInterstitial(EInsertAdType.UICloseAd, n);
            }
            this.lastToggle = e;
            this.menuPageContent.show(e.getComponent(MenuItem).getPageView(), t);
            if (e.getComponent(MenuItem).getPageView() == MapUIPrefabs.PagePartner && Model.partner.getOwnedCount() <= 0) {
                if (!GuideMgr.instance.isCompleteSpecialGuide(SpecialGuideEnum.TouchPartnerItem)) {
                    GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchUpgradePartnerButton);
                    GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchPartnerItem);
                    GuideMgr.instance.completeSpecialGuide(SpecialGuideEnum.TouchEquipPartnerButton);
                    GuideMgr.instance.stopSpecialGuide();
                }
            }
        }
        else {
            if ("toggle3" != e.node.name) {
                const n = this.getAdsNameByToggleName(e.node.name);
                Model.ad.showInterstitial(EInsertAdType.UICloseAd, n);
            }
            this.lastToggle = null;
            this.menuPageContent.hide();
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchAutoSkillButton);
        }
    }
    showPageView(e: number, t: boolean) {
        if (this.lastToggle != this.menuToggles[e] || (this.lastToggle && !this.lastToggle.isChecked)) {
            this.menuToggles[e].isChecked = true;
            this.onToggleMenu(this.menuToggles[e], t);
        }
    }
    get lastToggle() {
        return this._lastToggle;
    }
    set lastToggle(value) {
        if (this._lastToggle != value) {
            this._lastToggle = value;
        }
    }
}
