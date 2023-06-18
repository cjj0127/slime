import { GuideEvent, GuideEnums, SpecialGuideEnum } from "../guide/GuideEnums";
import { GlobalEventName } from "../common/Events";
import { E_UnlockSysType, ENUM_PROP_TYPE, EUNLOCKSYS_ID, E_UNLOCK_STATE, E_MenuToggleType, E_ToggleHeroType, _UNLOCKSYS_LAN_ID, LEVEL_DIFFICULTY_NAME } from "../common/Const";
import Config from "../../ccstudio/configs/Config";
import GuideMgr from "../guide/GuideMgr";
import LanMgr from "../common/Language";
import _LevelConfig from "../../ccstudio/config/_LevelConfig";
import LevelModel from "../../ccstudio/data/LevelModel";
import MineModel from "../../ccstudio/data/MineModel";
import UiModel from "../../ccstudio/data/UiModel";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
import QuestChain from "../quest/QuestChain";
import _SysUnlockConfig from "../../ccstudio/config/_SysUnlockConfig";
import MsgHint from "../common/MsgHint";
import UnlockData from "./UnlockData";
import UserData from "../user/UserData";
import UserProp from "../user/UserProp";
// n.default = E
export default class UnlockCtrl extends cc.Component {
    private static _instance: UnlockCtrl;
    public SetUnlockState(e: number): void {
        if (Model.user.isSKillSlot(e)) {
            if (Model.user.isSkillSlotUnlockCondition(e)) {
                Model.unlock.waitUnlock(e);
            }
        }
        else if (Model.user.isPartnerSlot(e)) {
            if (Model.user.isPartnerSlotUnlockCondition(e)) {
                Model.unlock.waitUnlock(e);
            }
        }
        else {
            Model.unlock.unlock(e);
        }
    }
    checkAllSystems() {
        if (!UserData.isNewPlayer) {
            for (let t = 0; t <= E_UnlockSysType.TripleShot; t++) {
                let n = t;
                let o = this.getUnlockTypeCurValue(n);
                _SysUnlockConfig.Instance.getAllUnlockDataByUnlockType(n, o).forEach(function (t) {
                    let n = _SysUnlockConfig.Instance.get(t);
                    if (!this.isUnlock(n.type)) {
                        let o = this.getMsgByType(n.type);
                        this.SetUnlockState(n.type);
                        cc.director.emit(o, n.type);
                    }
                }.bind(this));
            }
        }
    }
    checkOpenDialog(e, t) {
        Model.unlock.getData(e),
            Model.unlock.getData(e).state == E_UNLOCK_STATE.WaitUnlock && (Model.user.isSKillSlot(e) ?
                (Model.ui.closeAll(), cc.director.emit(GlobalEventName.ShowPageView, E_MenuToggleType.Hero, E_ToggleHeroType.Skill)) :
                Model.user.isPartnerSlot(e) && (Model.ui.closeAll(), cc.director.emit(GlobalEventName.ShowPageView, E_MenuToggleType.Partner))),
            Model.user.isSKillSlot(e) || Model.user.isPartnerSlot(e) || t();
    }
    public checkUnlock(e: number): void {
        if (this.isUnlock(e)) {
            const t = GuideMgr.instance.getSpecialGuideEnum(GuideEnums.UNLOCK_SYSTEM, e);
            if (t !== SpecialGuideEnum.None) {
                GuideMgr.instance.checkSpecial(t);
            }
        }
    }
    getMsgByType(e: EUNLOCKSYS_ID): string {
        let msg = "";
        switch (e) {
            case EUNLOCKSYS_ID.Mine:
                msg = GlobalEventName.UnlockMine;
                break;
            case EUNLOCKSYS_ID.BossRush:
                msg = GlobalEventName.UnlockBossRush;
                break;
            case EUNLOCKSYS_ID.GoldRush:
                msg = GlobalEventName.UnlockGoldRush;
                break;
            case EUNLOCKSYS_ID.Relices:
                msg = GlobalEventName.UnlockDrop;
                break;
            case EUNLOCKSYS_ID.Trait:
                msg = GlobalEventName.UnlockFeatures;
                break;
            case EUNLOCKSYS_ID.HeroRush:
                msg = GlobalEventName.UnlockHeroRush;
                break;
            case EUNLOCKSYS_ID.Shop:
                msg = GlobalEventName.UnlockShop;
                break;
            case EUNLOCKSYS_ID.Equip:
                msg = GlobalEventName.UnlockEquip;
                break;
            case EUNLOCKSYS_ID.Partner:
                msg = GlobalEventName.UnlockPartner;
                break;
            case EUNLOCKSYS_ID.PartnerCol2:
                msg = GlobalEventName.UnlockPartnerCol2;
                break;
            case EUNLOCKSYS_ID.PartnerCol3:
                msg = GlobalEventName.UnlockPartnerCol3;
                break;
            case EUNLOCKSYS_ID.PartnerCol4:
                msg = GlobalEventName.UnlockPartnerCol4;
                break;
            case EUNLOCKSYS_ID.PartnerCol5:
                msg = GlobalEventName.UnlockPartnerCol5;
                break;
            case EUNLOCKSYS_ID.Skill:
                msg = GlobalEventName.UnlockSkill;
                break;
            case EUNLOCKSYS_ID.SkillCol2:
                msg = GlobalEventName.UnlockSkillCol2;
                break;
            case EUNLOCKSYS_ID.SkillCol3:
                msg = GlobalEventName.UnlockSkillCol3;
                break;
            case EUNLOCKSYS_ID.SkillCol4:
                msg = GlobalEventName.UnlockSkillCol4;
                break;
            case EUNLOCKSYS_ID.SkillCol5:
                msg = GlobalEventName.UnlockSkillCol5;
                break;
            case EUNLOCKSYS_ID.SkillCol6:
                msg = GlobalEventName.UnlockSkillCol6;
                break;
            case EUNLOCKSYS_ID.Hero:
                msg = GlobalEventName.UnlockHero;
                break;
            case EUNLOCKSYS_ID.Relices:
                msg = GlobalEventName.UnlockRelices;
                break;
            case EUNLOCKSYS_ID.Mastery:
                msg = GlobalEventName.UnlockMastery;
                break;
            case EUNLOCKSYS_ID.Atlas:
                msg = GlobalEventName.UnlockAtlas;
                break;
            case EUNLOCKSYS_ID.Wheel:
                msg = GlobalEventName.UnlockWheel;
                break;
            case EUNLOCKSYS_ID.Sign:
                msg = GlobalEventName.UnlockSign;
                break;
            case EUNLOCKSYS_ID.Pass:
                msg = GlobalEventName.UnlockPass;
                break;
            case EUNLOCKSYS_ID.Task:
                msg = GlobalEventName.UnlockTask;
                break;
            case EUNLOCKSYS_ID.Hangup:
                msg = GlobalEventName.UnlockHungup;
                break;
            case EUNLOCKSYS_ID.Bless:
                msg = GlobalEventName.UnlockBless;
                break;
            case EUNLOCKSYS_ID.FlyChest:
                msg = GlobalEventName.UnlockFlyChest;
                break;
            case EUNLOCKSYS_ID.DoubleShotAtribute:
                msg = GlobalEventName.UnlockDoubleShotAtribute;
                break;
            case EUNLOCKSYS_ID.TripleShotAtribute:
                msg = GlobalEventName.UnlockTripleShotAtribute;
                break;
            case EUNLOCKSYS_ID.SevenChallenge:
                msg = GlobalEventName.UnlockSevenChallenge;
        }
        return msg;
    }
    public getUnclockTips(e: any): string {
        let t = "";
        const n = _UNLOCKSYS_LAN_ID[e.unlockType];
        const o = LanMgr.Instance.getLangByID(n);
        if (e.unlockType == E_UnlockSysType.Level) {
            const r = Config.level.get(e.unlockValue);
            const i = LanMgr.Instance.getLangByID(LEVEL_DIFFICULTY_NAME[r.difficulty - 1]) + " " + r.level;
            t = o.replace("{s}", i);
        }
        else if (e.unlockType == E_UnlockSysType.Task) {
            const s = e.unlockValue - 20000;
            t = o.replace("{s}", s.toString());
        }
        else {
            t = o.replace("{s}", e.unlockValue.toString());
        }
        return t;
    }
    getUnlockTypeCurValue(e: E_UnlockSysType) {
        let t = 0;
        switch (e) {
            case E_UnlockSysType.Level:
                t = Model.level.currNormalLevel;
                break;
            case E_UnlockSysType.MineDeep:
                t = Model.mine.digDeep;
                break;
            case E_UnlockSysType.Task:
                t = QuestChain.Instance.chainQuestId;
                break;
            case E_UnlockSysType.DoubleShot:
                t = UserProp.Instance.loadUserPorpLevel(ENUM_PROP_TYPE.DoubleShot).level;
                break;
            case E_UnlockSysType.TripleShot:
                t = UserProp.Instance.loadUserPorpLevel(ENUM_PROP_TYPE.TripleShot).level;
                break;
        }
        return t;
    }
    // public checkOpenDialog(e: number, t: Function): void {
    //     Model.unlock.getData(e);
    //     if (Model.unlock.getData(e).state == UNLOCK_STATE.WaitUnlock) {
    //         if (Model.user.isSKillSlot(e)) {
    //             Model.ui.closeAll();
    //             cc.director.emit(GlobalEvent.ShowPageView, MenuToggleType.Hero, ToggleHeroType.Skill);
    //         } else if (Model.user.isPartnerSlot(e)) {
    //             Model.ui.closeAll();
    //             cc.director.emit(GlobalEvent.ShowPageView, MenuToggleType.Partner);
    //         } else {
    //             t();
    //         }
    //     }
    // }
    public isUnlock(e: number): boolean {
        return Model.user.isUnlock(e);
    }
    onDestroy() {
        UnlockCtrl._instance = null;
    }
    onDisable() {
        cc.director.targetOff(this);
    }
    onEnable() {
        cc.director.on(GlobalEventName.UnlockValueChange, this.onLockChange, this);
        cc.director.on(GuideEvent.COMPLETE_SPECIAL_GUIDE, this.onLockAfterGuide, this);
    }
    onLoad() {
        UnlockCtrl._instance = this;
    }
    onLockAfterGuide() {
        let e = UserData.Instance.gaveUnlockTypeAferGuide();
        if (e !== 0 && !this.isUnlock(e)) {
            this.unlockSys(e);
        }
    }
    onLockChange(e: EUNLOCKSYS_ID, t: number) {
        _SysUnlockConfig.Instance.getAllUnlockDataByUnlockType(e, t).forEach(function (e) {
            let t = _SysUnlockConfig.Instance.get(e);
            if (t && !this.isUnlock(t.type)) {
                this.unlockSys(t.type);
            }
        }.bind(this));
    }
    public refreshUnlockNodeState(e: boolean, t: cc.Node, n: number = null): void {
        const o = t.getChildByName("lock");
        if (o) {
            o.active = !e;
            const r = o.getChildByName("lockTip");
            if (r && n) {
                const i = _SysUnlockConfig.Instance.getUnlockDataBySysType(n);
                r.getComponent(cc.Label)!.string = this.getUnclockTips(i);
            }
        }
    }
    public refreshUnlockState(e: boolean, t: cc.Button, n: number): void {
        const r = t.node.getChildByName("lock");
        if (r) {
            if (e) {
                r.active = false;
                t.interactable = true;
            }
            else {
                r.active = true;
                t.interactable = false;
            }
            if (!r.getComponent(cc.Button)) {
                r.addComponent(cc.Button);
            }
            r.getComponent(cc.Button)!.node.on("click", () => {
                const e = _SysUnlockConfig.Instance.getUnlockDataBySysType(n);
                this.showUnclockTips(e);
            }, this);
        }
    }
    public showUnclockTips(e: any): void {
        const t = this.getUnclockTips(e);
        MsgHint.tip(t);
    }
    start() {
        this.checkAllSystems();
    }
    public unlockSys(e: number): void {
        if (GuideMgr.instance.isInGuide()) {
            UserData.Instance.saveUnlockTypeAferGuide(e);
        }
        else {
            const msg: string = this.getMsgByType(e);
            this.SetUnlockState(e);
            this.checkOpenDialog(e, () => {
                cc.director.emit(msg, e);
            });
            this.checkUnlock(e);
        }
    }
    public static get Instance(): UnlockCtrl {
        return UnlockCtrl._instance;
    }
}
