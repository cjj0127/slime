import { GuideVerifactionEvent } from "../guide/GuideEnums";
import { GlobalEventTarget } from "../common/GlobalEventTarget";
import { GlobalEventName } from "../common/Events";
import { E_QUEST_ACTIVE_ID, GameConst, IMAGE_ICON_PATH_, E_QUEST_VALUE_UPDATE_TYPE, E_QUEST_STATUS, EUNLOCKSYS_ID, E_MenuToggleType, E_ToggleShopType } from "../common/Const";
import { NAMES_BUNDLE } from "../asset/AssetRes";
import _AssetConfig from "../../ccstudio/config/_AssetConfig";
import AssetManager from "../asset/AssetManager";
import LanMgr from "../common/Language";
import UserModel from "../../ccstudio/data/UserModel";
import Model from "../../ccstudio/data/Model";
import _QuestConfig from "../../ccstudio/config/_QuestConfig";
import QuestChain from "./QuestChain";
const b: any = window["_"];
const { ccclass, property } = cc._decorator;
const I = [E_QUEST_ACTIVE_ID.ClearStage];
@ccclass
export default class QuestChainUI extends cc.Component {
    @property(cc.Label)
    descLabel: cc.Label = null;
    onQuestProgress = (e) => {
        const t = QuestChain.Instance.chainQuestId;
        if (t == e) {
            this.refreshProgress(t);
        }
    };
    onQuestStatusChange = (e) => {
        this.refreshStatus(e);
    };
    @property(cc.Label)
    rewardCntLabel: cc.Label = null;
    @property(cc.Sprite)
    rewardIcon: cc.Sprite = null;
    @property(cc.Label)
    titleLabel: cc.Label = null;
    //   t.prototype.onClick = function() {
    //     var e = y.default.Instance.chainQuestId,
    //     t = y.default.Instance.getData(e);
    //     t.status == a.QUEST_STATUS.Complete ? (y.default.Instance.receive(e, this.node.convertToWorldSpaceAR(cc.Vec3.ZERO)), p.GlobalEventTarget.emit(f.GuideVerifactionEvent.CLICK_IN_REGIN, this.node)) : t.status == a.QUEST_STATUS.Job && this.openDialog(t.activeId)
    // },
    onClick() {
        const e = QuestChain.Instance.chainQuestId;
        const t = QuestChain.Instance.getData(e);
        if (t.status == E_QUEST_STATUS.Complete) {
            QuestChain.Instance.receive(e, this.node.convertToWorldSpaceAR(cc.Vec3.ZERO));
            GlobalEventTarget.emit(GuideVerifactionEvent.CLICK_IN_REGIN, this.node);
        }
        else if (t.status == E_QUEST_STATUS.Job) {
            this.openDialog(t.activeId);
        }
    }
    onEnable() {
        this.refresh();
        cc.director.on(GlobalEventName.ChainQuestProgressChange, this.onQuestProgress, this);
        cc.director.on(GlobalEventName.ChainQuestStatusChange, this.onQuestStatusChange, this);
    }
    // private titleLabel: cc.Label = null;
    // private descLabel: cc.Label = null;
    // private rewardCntLabel: cc.Label = null;
    // private rewardIcon: cc.Sprite = null;
    onLoad() {
        this.node.on("click", this.onClick, this);
    }
    openDialog(e) {
        let t;
        if (e == E_QUEST_ACTIVE_ID.Summon ||
            e == E_QUEST_ACTIVE_ID.SummonGear ||
            e == E_QUEST_ACTIVE_ID.SummonPartner ||
            e == E_QUEST_ACTIVE_ID.SummonSkill) {
            const n = Model.user.isUnlock(EUNLOCKSYS_ID.Shop);
            const o = Model.user.isUnlock(EUNLOCKSYS_ID.Equip);
            const r = Model.user.isUnlock(EUNLOCKSYS_ID.Partner);
            const i = Model.user.isUnlock(EUNLOCKSYS_ID.Skill);
            let s = false;
            if (e == E_QUEST_ACTIVE_ID.Summon) {
                s = n && (o || r || i);
            }
            else if (e == E_QUEST_ACTIVE_ID.SummonGear) {
                s = n && o;
            }
            else if (e == E_QUEST_ACTIVE_ID.SummonPartner) {
                s = n && r;
            }
            else if (e == E_QUEST_ACTIVE_ID.SummonSkill) {
                s = n && i;
            }
            if (s) {
                cc.director.emit(GlobalEventName.ShowPageView, E_MenuToggleType.Shop, E_ToggleShopType.Summon);
            }
        }
        else if (e == E_QUEST_ACTIVE_ID.MineDig || e == E_QUEST_ACTIVE_ID.MineResearch) {
            if (Model.user.isUnlock(EUNLOCKSYS_ID.Mine)) {
                cc.director.emit(GlobalEventName.ShowPageView, E_MenuToggleType.Mine);
            }
        }
        else if (e == E_QUEST_ACTIVE_ID.ClearBoss || e == E_QUEST_ACTIVE_ID.ClearGold) {
            t = Model.user.isUnlock(e == E_QUEST_ACTIVE_ID.ClearBoss ? EUNLOCKSYS_ID.BossRush : EUNLOCKSYS_ID.GoldRush);
            if (t) {
                cc.director.emit(GlobalEventName.ShowPageView, E_MenuToggleType.Battle);
            }
        }
    }
    refresh() {
        const e = QuestChain.Instance.chainQuestId;
        this.refreshTitle(e),
            this.refreshProgress(e),
            this.refreshReward(e);
    }
    refreshProgress(e) {
        const t = _QuestConfig.Instance.get(e);
        if (t.updateType == E_QUEST_VALUE_UPDATE_TYPE.Set && b.indexOf(I, t.activeId) >= 0) {
            this.descLabel.string = LanMgr.Instance.getLangByID(t.title);
        }
        else {
            const n = QuestChain.Instance.getData(e);
            const o = n.cur;
            const r = n.max;
            this.descLabel.string = LanMgr.Instance.getLangByID(t.title) + "(" + o + "/" + r + ")";
        }
    }
    refreshReward(e) {
        const t = _QuestConfig.Instance.get(e);
        this.rewardCntLabel.string = "" + t.count;
        const n = _AssetConfig.Instance.get(t.asset);
        const o = IMAGE_ICON_PATH_ + "/" + n.icon;
        this.rewardIcon.spriteFrame = AssetManager.Instance.getSpriteFrame(NAMES_BUNDLE.Game, o);
        this.rewardIcon.node.scale = 40 / this.rewardIcon.node.width;
    }
    refreshStatus(e) {
        const t = QuestChain.Instance.chainQuestId;
        if (t !== e) {
            this.refreshTitle(t);
            this.refreshProgress(t);
            this.refreshReward(t);
        }
    }
    refreshTitle(e) {
        this.titleLabel.string = LanMgr.Instance.getLangByID("title_quest") + " " + (e - GameConst.CHAIN_QUEST_DEFAULT_ID + 1);
    }
}
