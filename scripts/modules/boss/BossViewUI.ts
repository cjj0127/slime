import GuideMgr from "../guide/GuideMgr";
import UnlockCtrl from "../unlock/UnlockCtrl";
import { SpecialGuideEnum } from "../guide/GuideEnums";
import { GlobalEventName } from "../common/Events";
import { E_MenuToggleType, EUNLOCKSYS_ID, PrefabBossKeyHelperUI } from "../common/Const";
import Model from "../../ccstudio/data/Model";
const { ccclass, property } = cc._decorator;
@ccclass
export class BossViewUI extends cc.Component {
    @property(cc.Node)
    LegionRushNode: cc.Node = null;
    @property(cc.Node)
    bossRushNode: cc.Node = null;
    @property(cc.ScrollView)
    bossScrollView: cc.ScrollView = null;
    @property(cc.Button)
    btnClose: cc.Button = null;
    @property(cc.Button)
    btnHelper: cc.Button = null;
    @property(cc.Node)
    dwarvenKingNode: cc.Node = null;
    @property(cc.Node)
    goldRushNode: cc.Node = null;
    @property(cc.Node)
    relicesNode: cc.Node = null;
    
    checkLock(e: number) {
        let t = null;
        if (e == EUNLOCKSYS_ID.GoldRush) {
            t = this.goldRushNode;
        }
        else if (e == EUNLOCKSYS_ID.BossRush) {
            t = this.bossRushNode;
        }
        else if (e == EUNLOCKSYS_ID.Trait) {
            t = this.dwarvenKingNode;
        }
        else if (e == EUNLOCKSYS_ID.Relices) {
            t = this.relicesNode;
        }
        else if (e == EUNLOCKSYS_ID.HeroRush) {
            t = this.LegionRushNode;
        }
        const n = Model.user.isUnlock(e);
        UnlockCtrl.Instance.refreshUnlockNodeState(n, t, e);
    }
    
    guideScrollToLast(e: number) {
        this.bossScrollView.content.y = e;
    }
    
    onClickClose() {
        cc.director.emit(GlobalEventName.ClosePageView, E_MenuToggleType.Battle);
    }
    
    onClickHelperHandler() {
        Model.ui.openViewAsync(PrefabBossKeyHelperUI);
    }
    
    onDisable() {
        cc.director.targetOff(this);
    }
    
    onEnable() {
        this.checkLock(EUNLOCKSYS_ID.GoldRush);
        this.checkLock(EUNLOCKSYS_ID.BossRush);
        this.checkLock(EUNLOCKSYS_ID.Trait);
        this.checkLock(EUNLOCKSYS_ID.Relices);
        this.checkLock(EUNLOCKSYS_ID.HeroRush);
        cc.director.on(GlobalEventName.UnlockGoldRush, this.checkLock, this);
        cc.director.on(GlobalEventName.UnlockBossRush, this.checkLock, this);
        cc.director.on(GlobalEventName.UnlockDwarvenKingRush, this.checkLock, this);
        cc.director.on(GlobalEventName.UnlockHeroRush, this.checkLock, this);
        cc.director.on(GlobalEventName.UnlockRelices, this.checkLock, this);
        cc.director.on(GlobalEventName.GuideScrollToLast, this.guideScrollToLast, this);
        this.scheduleOnce(() => {
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchBossButton);
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchCoinButton);
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchSnowButton);
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchCaveRushButton);
            GuideMgr.instance.checkSpecial(SpecialGuideEnum.TouchLegionRushButton);
        }, 0.1);
    }
    // btnHelper: cc.Button = null;
    // goldRushNode: cc.Node = null;
    // bossRushNode: cc.Node = null;
    // dwarvenKingNode: cc.Node = null;
    // relicesNode: cc.Node = null;
    // LegionRushNode: cc.Node = null;
    // bossScrollView: cc.ScrollView = null;
    // btnClose: cc.Button = null;
    
    onLoad() {
        this.btnHelper.node.on("click", this.onClickHelperHandler, this);
        this.btnClose.node.on("click", this.onClickClose, this);
    }
}
