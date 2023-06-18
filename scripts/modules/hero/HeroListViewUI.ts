import GuideMgr from "../guide/GuideMgr";
import HeroData from "./HeroData";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import { EVideoType } from "../common/ViedioType";
import { GlobalEventName } from "../common/Events";
import { GAME_SPINE_PATH_, E_ASSET_TYPE, GameConst, MapUIPrefabs } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import AdsManager from "../ads/AdsManager";
import AssetManager from "../asset/AssetManager";
import _HeroConfig from "../../ccstudio/config/_HeroConfig";
import _HeroExpConfig from "../../ccstudio/config/_HeroExpConfig";
import LanMgr from "../common/Language";
import AdsModel, { E_AD_TYPE } from "../../ccstudio/data/AdsModel";
import HeroModel from "../../ccstudio/data/HeroModel";
import PassModel from "../../ccstudio/data/PassModel";
import UiModel from "../../ccstudio/data/UiModel";
import Model from "../../ccstudio/data/Model";
import MsgHint from "../common/MsgHint";
import GradeLabelUI from "../battle/GradeLabelUI";
import HeroLevelPropsUI from "./HeroLevelPropsUI";
import HeroListItemUI from "./HeroListItemUI";
import HeroSkillInfoUI from "./HeroSkillInfoUI";
import UIPool from "../common/UIPool";
import UserData, { AssetGetType, AssetUseType } from "../user/UserData";
import ViewAnimCtrl from "../../ccstudio/display/ViewAnimCtrl";
const { ccclass, property } = cc._decorator;
const _: any = window["_"];
@ccclass
export default class HeroListViewUI extends UIPool {
    _created: boolean = false;
    _touchInterval: number = 0.1;
    _touchStartInterval: number = 0.5;
    _touchTime: number = 0;
    _touched: boolean = false;
    @property(cc.Button)
    btnBuy: cc.Button = null;
    @property(cc.Button)
    btnEnhance: cc.Button = null;
    @property(cc.Button)
    btnEquip: cc.Button = null;
    @property(cc.Button)
    btnExpAd: cc.Button = null;
    @property(cc.Button)
    btnGet: cc.Button = null;
    currSelectId: number = 0;
    @property(cc.Node)
    equipedNode: cc.Node = null;
    expAdCountLabel: cc.Label = null;
    @property(cc.Label)
    expCnt: cc.Label = null;
    @property(GradeLabelUI)
    gradeSprite: GradeLabelUI = null;
    @property(cc.Layout)
    heroListContent: cc.Layout = null;
    @property(cc.Label)
    levelBuyPrice: cc.Label = null;
    @property(cc.ProgressBar)
    levelExpProgress: cc.ProgressBar = null;
    @property(cc.Label)
    levelExpText: cc.Label = null;
    @property(cc.Node)
    levelInfoNode: cc.Node = null;
    @property(cc.Label)
    levelLabel: cc.Label = null;
    @property(HeroLevelPropsUI)
    levelProps: HeroLevelPropsUI = null;
    listItem: any = {};
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(HeroSkillInfoUI)
    skillInfo: HeroSkillInfoUI = null;
    @property(sp.Skeleton)
    spAnim: sp.Skeleton = null;
    @property(cc.Node)
    unownedNode: cc.Node = null;
    public onClickAdAddExp(): void {
        if (!(Model.ad.getAdTimes(E_AD_TYPE.eExp) >= GameConst.HERO_EXP_AD_NUMBER)) {
            const e = {
                AdsType: EVideoType.AdHeroExp,
                OpenUi: EVideoType.AdHeroExp,
                onSucceed: () => {
                    Model.ad.addTodayTimes(E_AD_TYPE.eExp);
                    UserData.Instance.addItem(E_ASSET_TYPE.SlimeExp, GameConst.HERO_EXP_AD_GET_NUMBER, { type: AssetGetType.Hero });
                },
            };
            AdsManager.getInstance().showRewardedVideo(e);
        }
    }
    onClickBuy() {
        let e = this.currSelectId;
        let t = _HeroConfig.Instance.get(e);
        if (UserData.Instance.subItem(E_ASSET_TYPE.Diamond, t.unlockCost, { type: AssetUseType.Hero })) {
            Model.hero.unlock(t.id);
            this.setStatus(true);
            this.refreshList();
            let n = HeroData.Instance.getData(e);
            let o = _HeroExpConfig.Instance.get(n.level);
            this.setLevel(n.level);
            this.setProgress(n.exp, o, n.level >= t.maxLevel);
        }
        else {
            MsgHint.tip(LanMgr.Instance.getLangByID("Not enough Gem!"));
        }
    }
    public onClickEquip(): void {
        const e = HeroData.Instance.battleId;
        if (Model.hero.equip(this.currSelectId)) {
            const t = this.currSelectId;
            this.setEquiped(t == HeroData.Instance.battleId);
            this.listItem[e].setEquiped(false);
            const n = HeroData.Instance.battleId;
            this.listItem[n].setEquiped(true);
        }
    }
    onClickGet() {
        let e = this.currSelectId;
        let t = _HeroConfig.Instance.get(e);
        if (t.unlockType == 1) {
            MsgHint.tip(LanMgr.Instance.getLangByID("Hero_Tips_SevenUnlock"));
        }
        else if (t.unlockType == 3) {
            if (Model.pass.passId == t.unlockCost) {
                Model.ui.openViewAsync(MapUIPrefabs.PassView);
            }
            else {
                MsgHint.tip(LanMgr.Instance.getLangByID("Hero_Unlock_Tip"));
            }
        }
    }
    onClickLvUp() {
        this.tryLvup();
    }
    public onClose(): void {
        GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchMasteryButton);
        this.node.getComponent(ViewAnimCtrl).onClose();
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        this.currSelectId = HeroData.Instance.battleId;
        this.refreshList();
        this.refreshInfo();
        this.setExpCnt(UserData.Instance.getItem(E_ASSET_TYPE.SlimeExp));
        this.expAdCountLabel.string = "X" + GameConst.HERO_EXP_AD_GET_NUMBER;
        cc.director.on(GlobalEventName.AssetItemChange + E_ASSET_TYPE.SlimeExp, this.onSlimeExpCountChange, this);
        cc.director.on(GlobalEventName.HeroUnlockProp, this.onHeroUnlockProp, this);
        cc.director.on(GlobalEventName.HeroUnlockSkill, this.onHeroUnlockSkill, this);
    }
    onHeroUnlockProp(e: number, t: {
        prop: number;
        value: number;
    }) {
        if (this.pauseLvup(), this.currSelectId == e) {
            t.prop;
            t.value;
            let n = HeroData.Instance.getData(e);
            this.levelProps.unlockProp(n.level);
        }
    }
    onHeroUnlockSkill(e: number) {
        if (this.pauseLvup(), this.currSelectId == e) {
            let t = HeroData.Instance.getData(e).level;
            let n = _HeroConfig.Instance.get(e);
            this.skillInfo.setState(t, n.skillUnlockLv);
        }
    }
    onLoad() {
        this.expAdCountLabel = this.btnExpAd.node.getChildByName("tag").getComponentInChildren(cc.Label);
        this.btnEquip.node.on("click", this.onClickEquip, this);
        this.btnGet.node.on("click", this.onClickGet, this);
        this.btnBuy.node.on("click", this.onClickBuy, this);
        this.btnExpAd.node.on("click", this.onClickAdAddExp, this);
        this.btnEnhance.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStartHandler, this);
        this.btnEnhance.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoveHandler, this);
        this.btnEnhance.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEndHandler, this);
        this.btnEnhance.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancelHandler, this);
    }
    // private _created: boolean;
    // private currSelectId: number;
    // private listItem: {[id: number]: A};
    // constructor(){
    //     this._created = false;
    //     this.currSelectId = 0;
    //     this.listItem = {};
    // }
    public onSlimeExpCountChange(): void {
        this.setExpCnt(UserData.Instance.getItem(E_ASSET_TYPE.SlimeExp));
        const e = this.currSelectId;
        const t = HeroData.Instance.getData(e);
        this.refreshExpStatus(!_.isNil(t));
    }
    public onToggle(e: cc.Toggle): void {
        if (e.isChecked) {
            const t = e.getComponent(HeroListItemUI);
            this.currSelectId = t.getHeroId();
            this.refreshInfo();
        }
    }
    onTouchCancelHandler() {
        this._touched = false;
    }
    onTouchEndHandler() {
        this._touched = false;
        this.scheduleOnce(() => {
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchCloseHeroView);
        });
    }
    onTouchMoveHandler(e: cc.Event.EventTouch) {
        if (!this.btnEnhance.node["_hitTest"](e.getLocation())) {
            this._touched = false;
        }
    }
    onTouchStartHandler() {
        this._touched = true;
        this._touchTime = this._touchStartInterval;
        this._touchInterval = 0.1;
        this.tryLvup();
    }
    pauseLvup() {
        this._touched = false;
    }
    public refreshExpStatus(e: boolean): void {
        const t = parseInt(UserData.Instance.getItem(E_ASSET_TYPE.SlimeExp));
        if (this.btnExpAd.node.active = t <= 0 && e, t <= 0) {
            const n = Model.ad.getAdTimes(E_AD_TYPE.eExp);
            this.btnExpAd.interactable = n < GameConst.HERO_EXP_AD_NUMBER;
            this.btnExpAd.node.getChildByName("tag").active = n < GameConst.HERO_EXP_AD_NUMBER;
            this.btnExpAd.target.getComponentInChildren(cc.Label).string = `${GameConst.HERO_EXP_AD_NUMBER - n}/${GameConst.HERO_EXP_AD_NUMBER}`;
        }
    }
    public refreshInfo(): void {
        const e = this.currSelectId;
        const cfg = _HeroConfig.Instance.get(e);
        console.log(cfg);
        const n = HeroData.Instance.getData(e);
        const o = cfg.unlockPropLvs;
        const r = cfg.props;
        const i = cfg.propValues;
        const a = (n?.level) || 0;
        const s = (n?.exp) || 0;
        const c = _HeroExpConfig.Instance.get(a);
        this.levelProps.setProps(a, r, i, o);
        this.skillInfo.setSkill(cfg.skillId);
        this.skillInfo.setState(a, cfg.skillUnlockLv);
        this.setNameStr(cfg.name);
        this.setLevel((n?.level) || -1);
        this.setProgress(s, c, a >= cfg.maxLevel);
        this.setAnim(cfg.uiAnim);
        this.setGrade(cfg.grade);
        this.setStatus(!_.isNil(n));
        this.setEquiped(e == HeroData.Instance.battleId);
        this.levelBuyPrice.string = cfg.unlockCost.toString();
        const l = cfg.unlockCost <= parseInt(UserData.Instance.diams);
        this.btnBuy.target.getComponent(cc.Sprite).setState(l ? cc.Sprite.State.NORMAL : cc.Sprite.State.GRAY);
        this.levelBuyPrice.node.color = l ? cc.Color.WHITE : cc.Color.RED;
    }
    public refreshList(): void {
        const e = this;
        const t = HeroData.Instance.battleId;
        if (this._created) {
            _.each(this.listItem, (n: HeroListItemUI) => {
                n.refreshStatus();
                n.setEquiped(t == n.getHeroId());
                if (n.getHeroId() == e.currSelectId)
                    n.getComponent(cc.Toggle).check();
            });
        }
        else {
            this._created = true;
            const n = _HeroConfig.Instance.getAll();
            _.each(n, function (n: any) {
                const o = e.get();
                o.parent = e.heroListContent.node;
                const r = o.getComponent(HeroListItemUI);
                r.setHero(n.id);
                r.setEquiped(t == r.getHeroId());
                e.listItem[n.id] = r;
                if (r.getHeroId() == e.currSelectId)
                    r.getComponent(cc.Toggle).check();
                r.node.on("toggle", e.onToggle, e);
            });
        }
    }
    public setAnim(e: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            try {
                const t = GAME_SPINE_PATH_ + "/mushroom";
                const n = await AssetManager.Instance.loadSkeleton(NAMES_BUNDLE.Game, t, e) as any;
                this.spAnim.skeletonData = n;
                this.spAnim.setAnimation(0, "standby", true);
                resolve();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    public setEquiped(e: boolean): void {
        const t = this.btnEquip.target.getComponent(cc.Sprite);
        const n = this.btnEquip.target.getComponentInChildren(cc.Label);
        if (e) {
            t.setState(cc.Sprite.State.GRAY);
            n.string = LanMgr.Instance.getLangByID("item_equiped");
            n.node.color = cc.Color.GRAY;
            this.equipedNode.active = true;
        }
        else {
            t.setState(cc.Sprite.State.NORMAL);
            n.string = LanMgr.Instance.getLangByID("btn_equip");
            n.node.color = cc.Color.WHITE;
            this.equipedNode.active = false;
        }
    }
    public setExpCnt(e: number): void {
        this.expCnt.node.color = e > 0 ? cc.Color.WHITE : cc.Color.RED;
        this.expCnt.string = e + "/1";
    }
    public setGrade(index: number): void {
        this.gradeSprite.setGrade(index);
    }
    public setLevel(e: number): void {
        this.levelLabel.string = "LV " + e;
    }
    public setNameStr(e: number): void {
        this.nameLabel.string = LanMgr.Instance.getLangByID(e);
    }
    public setProgress(e: number, t: number, n = false): void {
        n ? (this.levelExpProgress.progress = 1,
            this.levelExpText.string = LanMgr.Instance.getLangByID("MaxLevel")) : (this.levelExpProgress.progress = t > 0 ? e / t : 0,
            this.levelExpText.string = e + "/" + t);
    }
    public setStatus(b: boolean): void {
        this.levelInfoNode.active = b;
        this.unownedNode.active = !b;
        const t = b ? cc.Color.WHITE : cc.Color.GRAY;
        this.spAnim.node.color = t;
        this.btnEnhance.node.active = b;
        const n = this.currSelectId;
        const o = _HeroConfig.Instance.get(n);
        if (0 == o.unlockType) {
            this.btnEquip.node.active = true;
            this.btnEnhance.node.active = true;
            if (b) {
                const r = HeroData.Instance.getData(n);
                this.btnEquip.node.active = true;
                this.btnEnhance.node.active = r.level < o.maxLevel;
                this.btnGet.node.active = false;
                this.btnBuy.node.active = false;
            }
        }
        else {
            this.btnEquip.node.active = false;
            this.btnEnhance.node.active = false;
            if (1 == o.unlockType) {
                this.btnGet.node.active = true;
                this.btnBuy.node.active = false;
            }
            else if (2 == o.unlockType) {
                this.btnBuy.node.active = true;
                this.btnGet.node.active = false;
            }
            else {
                this.btnBuy.node.active = false;
                this.btnGet.node.active = true;
            }
        }
        this.refreshExpStatus(b);
    }
    start() {
        this.listItem[this.currSelectId].getComponent(cc.Toggle).check();
    }
    tryLvup() {
        if (Model.hero.enhance(this.currSelectId)) {
            let e = HeroData.Instance.getData(this.currSelectId);
            let t = _HeroExpConfig.Instance.get(e.level);
            let n = _HeroConfig.Instance.get(this.currSelectId);
            this.setLevel(e.level);
            this.setProgress(e.exp, t, e.level >= n.maxLevel);
            this.listItem[this.currSelectId].refreshStatus();
            this.setStatus(true);
        }
    }
    update(dt: number) {
        if (this._touched) {
            this._touchTime -= dt;
            if (this._touchTime <= 0) {
                this.tryLvup();
                this._touchTime += this._touchInterval;
            }
        }
    }
}
